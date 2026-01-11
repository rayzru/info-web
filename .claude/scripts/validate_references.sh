#!/bin/bash

#############################################################################
# Cross-Reference Validation Script
# Validates all markdown links in .claude/ directory
#
# Usage: ./.claude/scripts/validate_references.sh
#############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]})" )" && pwd )"
CLAUDE_DIR="$SCRIPT_DIR/.."
ERRORS_FOUND=0

echo -e "${GREEN}Validating cross-references in .claude/ directory...${NC}\n"

# Find all markdown files in .claude
find "$CLAUDE_DIR" -type f -name "*.md" | while read -r file; do
    echo -e "Checking: ${file#$CLAUDE_DIR/}"

    # Extract markdown links: [text](path)
    # Match both relative and absolute paths
    grep -oE '\[([^\]]+)\]\(([^)]+)\)' "$file" | while read -r match; do
        # Extract the path from [text](path)
        link=$(echo "$match" | sed -E 's/\[([^\]]+)\]\(([^)]+)\)/\2/')

        # Skip external links (http://, https://, #anchor)
        if [[ "$link" =~ ^https?:// ]] || [[ "$link" =~ ^# ]]; then
            continue
        fi

        # Resolve relative path
        file_dir=$(dirname "$file")
        if [[ "$link" =~ ^/ ]]; then
            # Absolute path from project root
            target_file="${CLAUDE_DIR}${link}"
        else
            # Relative path
            target_file="${file_dir}/${link}"
        fi

        # Remove anchor (#L42, #section)
        target_file=$(echo "$target_file" | sed 's/#.*//')

        # Normalize path (remove .., .)
        target_file=$(cd "$(dirname "$target_file")" 2>/dev/null && pwd)/$(basename "$target_file") || target_file=""

        # Check if target exists
        if [ ! -f "$target_file" ]; then
            echo -e "  ${RED}✗${NC} Broken link: $link"
            echo -e "    Referenced in: ${file#$CLAUDE_DIR/}"
            echo -e "    Target not found: $target_file"
            ERRORS_FOUND=$((ERRORS_FOUND + 1))
        fi
    done
done

echo ""
if [ $ERRORS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ All cross-references valid!${NC}"
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS_FOUND broken reference(s)${NC}"
    exit 1
fi
