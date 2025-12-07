#!/bin/bash

# Performance review module
# Checks for common performance issues in C# code
# Usage: check-performance.sh [file]
# When called from hooks, expects JSON input via stdin

# Check if we have stdin data (hook call) or command line args (manual call)
if [ $# -gt 0 ]; then
    # Command line arguments provided (manual call)
    FILE="$1"
else
    # No arguments, try to read JSON from stdin (hook call)
    JSON_INPUT=$(cat)
    
    # Extract file path from JSON
    FILE=$(echo "$JSON_INPUT" | jq -r '.tool_input.file_path' 2>/dev/null)
fi

ISSUES_FOUND=0

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Review issues file
REVIEW_ISSUES_FILE=".claude/REVIEW_ISSUES.md"

# Skip if no file provided
[ -z "$FILE" ] && exit 0
[ ! -f "$FILE" ] && exit 0

# Only check C# files
[[ ! "$FILE" =~ \.cs$ ]] && exit 0

TEMP_ISSUES=""

# ====== CRITICAL ISSUES ======

# Check 1: Database calls in loops (CRITICAL - can crash production)
# Looking for patterns like:
#   foreach (var id in ids) {
#       var user = await _context.Users.FirstAsync(x => x.Id == id);
#   }
if grep -q "foreach\|while\|for (" "$FILE" 2>/dev/null; then
    # Check if there might be DB calls in loops (simplified check)
    if grep -A5 -B1 "foreach\|while\|for (" "$FILE" 2>/dev/null | grep -q "Async\|\.ToList\|\.First\|\.Single" 2>/dev/null; then
        echo -e "${RED}  ⚠ $(basename $FILE): Possible database call in loop${NC}"
        echo "    Load data before the loop or use batch operations"
        TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 PERFORMANCE: Possible database call in loop in \`$FILE\`\n"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

# ====== WARNING ISSUES ======

# Check 2: Multiple SaveChanges in handlers (WARNING - transaction issues)
# Looking for patterns like:
#   await _context.SaveChangesAsync();
#   // ... more code ...
#   await _context.SaveChangesAsync();
if [[ "$FILE" =~ Handler\.cs$ ]]; then
    SAVE_COUNT=$(grep -c "SaveChanges\(Async\)\?" "$FILE" 2>/dev/null || echo 0)
    if [ "$SAVE_COUNT" -gt 1 ]; then
        echo -e "${YELLOW}  ⚠ $(basename $FILE): Multiple SaveChanges ($SAVE_COUNT found)${NC}"
        echo "    Consider combining into a single transaction"
        TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ PERFORMANCE: Multiple SaveChanges in \`$FILE\` ($SAVE_COUNT found)\n"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

# Check 3: Multiple Include/ThenInclude statements (WARNING - can cause performance issues)
# Looking for patterns like:
#   query.Include(x => x.Orders).ThenInclude(o => o.Items)  -- nested loading
#   query.Include(x => x.Orders).Include(x => x.Users)      -- multiple collections
# Multiple includes can cause Cartesian product explosion and memory issues
if grep -q "\.Include\|\.ThenInclude" "$FILE" 2>/dev/null; then
    # Count how many Include and ThenInclude statements there are
    INCLUDE_COUNT=$(grep -o "\.Include" "$FILE" 2>/dev/null | wc -l | tr -d ' ')
    THEN_INCLUDE_COUNT=$(grep -o "\.ThenInclude" "$FILE" 2>/dev/null | wc -l | tr -d ' ')
    
    # Determine severity based on context and count
    if [[ "$FILE" =~ GraphQL.*\.cs$ ]]; then
        # In GraphQL context, any Include is problematic (should use DataLoaders)
        if [ "$THEN_INCLUDE_COUNT" -gt 0 ] || [ "$INCLUDE_COUNT" -gt 1 ]; then
            echo -e "${YELLOW}  ⚠ $(basename $FILE): Multiple collections loaded in GraphQL context${NC}"
            echo "    Found $INCLUDE_COUNT Include(s) and $THEN_INCLUDE_COUNT ThenInclude(s)"
            echo "    GraphQL should use DataLoaders instead of Include/ThenInclude"
            TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ PERFORMANCE: Multiple Include/ThenInclude in GraphQL context \`$FILE\` ($INCLUDE_COUNT Include, $THEN_INCLUDE_COUNT ThenInclude)\n"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        elif [ "$INCLUDE_COUNT" -eq 1 ]; then
            echo -e "${YELLOW}  💡 $(basename $FILE): Include found in GraphQL context${NC}"
            echo "    Consider using DataLoaders for better performance"
            TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 💡 PERFORMANCE: Include in GraphQL context \`$FILE\` (use DataLoaders)\n"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    else
        # In non-GraphQL context, warn about excessive includes
        if [ "$THEN_INCLUDE_COUNT" -gt 0 ] || [ "$INCLUDE_COUNT" -gt 2 ]; then
            echo -e "${YELLOW}  ⚠ $(basename $FILE): Multiple Include/ThenInclude statements${NC}"
            echo "    Found $INCLUDE_COUNT Include(s) and $THEN_INCLUDE_COUNT ThenInclude(s)"
            echo "    Consider using split queries or load collections separately"
            TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ PERFORMANCE: Multiple Include/ThenInclude in \`$FILE\` ($INCLUDE_COUNT Include, $THEN_INCLUDE_COUNT ThenInclude)\n"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    fi
fi

# Check 4: Inefficient count operations (WARNING - wastes memory)
# Looking for patterns like:
#   var count = users.ToList().Count;
#   var length = items.ToArray().Length;
if grep -q "\.ToList.*\.Count\|\.ToArray.*\.Length" "$FILE" 2>/dev/null; then
    echo -e "${YELLOW}  ⚠ $(basename $FILE): Inefficient count operation${NC}"
    echo "    Use .Count() or .CountAsync() directly"
    TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ PERFORMANCE: Inefficient count operation in \`$FILE\`\n"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi


# If issues found, write to review issues file
if [ $ISSUES_FOUND -gt 0 ]; then
    # Create file with header if it doesn't exist
    if [ ! -f "$REVIEW_ISSUES_FILE" ]; then
        echo "# Code Review Issues" > "$REVIEW_ISSUES_FILE"
        echo "" >> "$REVIEW_ISSUES_FILE"
        echo "This file tracks issues found by automated code review." >> "$REVIEW_ISSUES_FILE"
        echo "" >> "$REVIEW_ISSUES_FILE"
    fi
    # Append the issues
    echo -e "$TEMP_ISSUES" >> "$REVIEW_ISSUES_FILE"
fi

exit $ISSUES_FOUND