#!/bin/bash

# Code patterns review module
# Checks for code quality and pattern issues
# Usage: check-patterns.sh [file]
# When called from hooks, expects JSON input via stdin

# Check if we have stdin data (hook call) or command line args (manual call)
if [ -t 0 ]; then
    # No stdin, use command line arguments (manual call)
    FILE="$1"
else
    # Read JSON from stdin (hook call)
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

# ====== CRITICAL PATTERN ISSUES ======

# Check 1: Missing await on async calls (CRITICAL - fire-and-forget bugs)
# Looking for patterns like:
#   GetUsersAsync();  // No await - runs in background!
#   _service.ProcessAsync(data);  // Task ignored
# Instead of:
#   await GetUsersAsync();
if grep -q "\..*Async(" "$FILE" 2>/dev/null; then
    # Look for async calls without await (simplified check)
    ASYNC_CALLS=$(grep -n "\..*Async(" "$FILE" 2>/dev/null)
    while IFS= read -r line; do
        if ! echo "$line" | grep -q "await\|Task\.\|return "; then
            LINE_NUM=$(echo "$line" | cut -d: -f1)
            echo -e "${RED}  ⚠ $(basename $FILE):$LINE_NUM: Possible missing 'await'${NC}"
            TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 PATTERN: Possible missing 'await' in \`$FILE:$LINE_NUM\`\n"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
            break  # Only report once per file
        fi
    done <<< "$ASYNC_CALLS"
fi

# Check 2: Sync methods in async context (CRITICAL - thread pool starvation)
# Looking for patterns like:
#   public async Task<List<User>> GetUsers() {
#       return _context.Users.ToList();  // Sync call blocks thread!
#   }
# Instead of:
#   return await _context.Users.ToListAsync();
if [[ "$FILE" =~ (Handler|Query|Queries|Mutation)\.cs$ ]]; then
    if grep -q "async.*Task" "$FILE" 2>/dev/null; then
        # Check for sync EF calls in async methods
        if grep -q "\.ToList()\|\.First()\|\.Single()\|\.Count()" "$FILE" 2>/dev/null; then
            echo -e "${RED}  ⚠ $(basename $FILE): Sync EF methods in async context${NC}"
            echo "    Use ToListAsync(), FirstAsync(), etc."
            TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 PATTERN: Sync EF methods in async context in \`$FILE\`\n"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    fi
fi

# ====== WARNING PATTERN ISSUES ======

# Check 3: GraphQL Input/Payload pattern (WARNING - API consistency)
# Looking for mutations without proper patterns:
#   public class UserMutation {
#       public User CreateUser(string name) { }  // Missing Input/Payload
#   }
# Should be:
#   public CreateUserPayload CreateUser(CreateUserInput input) { }
if [[ "$FILE" =~ Mutation\.cs$ ]]; then
    if grep -q "public.*Mutation\|public.*class.*Mutation" "$FILE" 2>/dev/null; then
        if ! grep -q "Input\|Payload" "$FILE" 2>/dev/null; then
            echo -e "${YELLOW}  ⚠ $(basename $FILE): GraphQL mutation missing Input/Payload pattern${NC}"
            TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ PATTERN: GraphQL mutation missing Input/Payload in \`$FILE\`\n"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    fi
fi

# Check 4: FluentMigrator vs EF migrations (WARNING - migration strategy)
# Looking for EF Core migration patterns:
#   public class AddUserTable : Migration {
#       protected override void Up(MigrationBuilder migrationBuilder) { }
#   }
# Should use FluentMigrator instead:
#   [DateMigration(2025, 01, 08)] 
#   public class AddUserTable : AutoReversingMigration { }
if [[ "$FILE" =~ Migration.*\.cs$ ]]; then
    if grep -q "DbContext\|EntityFramework\|MigrationBuilder" "$FILE" 2>/dev/null; then
        echo -e "${YELLOW}  ⚠ $(basename $FILE): Use FluentMigrator, not EF Core migrations${NC}"
        TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ PATTERN: Use FluentMigrator, not EF Core migrations in \`$FILE\`\n"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

# Check 5: Test attributes (WARNING - tests won't run)
# Looking for test methods without xUnit attributes:
#   public void Should_Create_User_Successfully() { }  // Missing [Fact]!
# Should be:
#   [Fact]
#   public void Should_Create_User_Successfully() { }
if [[ "$FILE" =~ \.Tests.*\.cs$ ]]; then
    # Check for test methods without attributes
    if grep -q "public.*Test\|public.*Should\|public.*When_" "$FILE" 2>/dev/null; then
        TEST_METHODS=$(grep -n "public.*Test\|public.*Should\|public.*When_" "$FILE")
        while IFS= read -r line; do
            LINE_NUM=$(echo "$line" | cut -d: -f1)
            # Check if previous lines have [Fact] or [Theory]
            if [ "$LINE_NUM" -gt 1 ]; then
                PREV_LINE=$((LINE_NUM - 1))
                if ! sed -n "${PREV_LINE}p" "$FILE" | grep -q "\[Fact\]\|\[Theory\]"; then
                    echo -e "${YELLOW}  ⚠ $(basename $FILE):$LINE_NUM: Test missing [Fact] or [Theory]${NC}"
                    TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ PATTERN: Test missing [Fact] or [Theory] in \`$FILE:$LINE_NUM\`\n"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                    break  # Only report once per file
                fi
            fi
        done <<< "$TEST_METHODS"
    fi
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