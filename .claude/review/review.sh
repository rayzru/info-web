#!/bin/bash

# On-demand code review for Fenix backend
# Usage: ./review.sh [changes|all|performance|security|patterns|<file>]
# When called from hooks, expects JSON input via stdin

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Review issues file
REVIEW_ISSUES_FILE=".claude/REVIEW_ISSUES.md"

# Check if we're in hook mode (stdin available) or manual mode
if [ -t 0 ]; then
    # Manual mode - parse arguments normally
    TARGET="${1:-changes}"
    VERBOSE="${2:-}"
    HOOK_MODE=false
else
    # Hook mode - read JSON from stdin
    JSON_INPUT=$(cat)
    FILE_PATH=$(echo "$JSON_INPUT" | jq -r '.tool_input.file_path' 2>/dev/null)
    HOOK_MODE=true
    
    # If we got a valid file path, set it as target
    if [ -n "$FILE_PATH" ] && [ -f "$FILE_PATH" ]; then
        TARGET="$FILE_PATH"
        # For hooks, we'll run all checks quietly
        VERBOSE=""
    else
        # No valid file path from hook, exit silently
        exit 0
    fi
fi

# Header (only in manual mode)
if [ "$HOOK_MODE" = false ]; then
    echo -e "${BLUE}════════════════════════════════════════════${NC}"
    echo -e "${BLUE}    Fenix Code Review - $(date +%Y-%m-%d)${NC}"
    echo -e "${BLUE}════════════════════════════════════════════${NC}"
fi

# Function to get files to review
get_files_to_review() {
    case "$TARGET" in
        changes)
            # Review uncommitted changes
            git diff --name-only --diff-filter=AM | grep "\.cs$" || true
            git diff --cached --name-only --diff-filter=AM | grep "\.cs$" || true
            ;;
        all)
            # Review all C# files
            find . -name "*.cs" -not -path "./bin/*" -not -path "./obj/*" -not -path "./Migrations/*" | head -100
            ;;
        *.cs)
            # Review specific file
            if [ -f "$TARGET" ]; then
                echo "$TARGET"
            else
                echo -e "${RED}Error: File $TARGET not found${NC}"
                exit 1
            fi
            ;;
        *)
            # Module-specific review, no files needed
            ;;
    esac
}

# Function to run specific review module
run_review_module() {
    local module="$1"
    local files="$2"
    
    if [ -f "$SCRIPT_DIR/check-$module.sh" ]; then
        echo -e "\n${GREEN}Running $module review...${NC}"
        bash "$SCRIPT_DIR/check-$module.sh" "$files"
    fi
}

# Main review logic
if [ "$HOOK_MODE" = true ]; then
    # Hook mode - run all checks on single file, pass JSON via stdin
    TOTAL_ISSUES=0
    for module in security performance patterns; do
        if [ -f "$SCRIPT_DIR/check-$module.sh" ]; then
            # Pass the JSON to each check script via stdin
            echo "$JSON_INPUT" | bash "$SCRIPT_DIR/check-$module.sh"
            TOTAL_ISSUES=$((TOTAL_ISSUES + $?))
        fi
    done
    
    # Clean up review file if no issues found
    if [ $TOTAL_ISSUES -eq 0 ] && [ -f "$REVIEW_ISSUES_FILE" ]; then
        # Check if file only contains header (no actual issues)
        if [ $(wc -l < "$REVIEW_ISSUES_FILE") -le 4 ]; then
            rm "$REVIEW_ISSUES_FILE" 2>/dev/null
        fi
    fi
else
    # Manual mode - existing logic
    case "$TARGET" in
        performance|security|patterns)
            # Run specific module
            FILES=$(get_files_to_review "all")
            if [ ! -z "$FILES" ]; then
                run_review_module "$TARGET" "$FILES"
            else
                echo -e "${YELLOW}No files to review${NC}"
            fi
            ;;
        *)
            # Get files to review
            FILES=$(get_files_to_review)
            
            if [ -z "$FILES" ]; then
                echo -e "${GREEN}✓ No changes to review${NC}"
                exit 0
            fi
            
            # Count files
            FILE_COUNT=$(echo "$FILES" | wc -l)
            echo -e "${BLUE}Reviewing $FILE_COUNT file(s)...${NC}"
            
            # Run all review modules
            for module in performance security patterns; do
                if [ -f "$SCRIPT_DIR/check-$module.sh" ]; then
                    echo -e "\n${BLUE}──── ${module^} Check ────${NC}"
                    echo "$FILES" | xargs -I {} bash "$SCRIPT_DIR/check-$module.sh" {}
                fi
            done
            ;;
    esac
fi

# Summary (only in manual mode)
if [ "$HOOK_MODE" = false ]; then
    echo -e "\n${BLUE}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Review complete!${NC}"
    echo -e "Run with 'verbose' for detailed output: ./review.sh $TARGET verbose"
fi

exit 0