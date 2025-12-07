#!/bin/bash

# Security review module
# Checks for security issues in C# code
# Usage: check-security.sh [file]
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

# Review issues file (consolidated with other checks)
REVIEW_ISSUES_FILE=".claude/REVIEW_ISSUES.md"

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Skip if no file provided
[ -z "$FILE" ] && exit 0
[ ! -f "$FILE" ] && exit 0

# Only check C# files
[[ ! "$FILE" =~ \.cs$ ]] && exit 0

TEMP_ISSUES=""

# ====== CRITICAL SECURITY ISSUES ======

# Check 1: Hardcoded passwords and secrets (CRITICAL - immediate security risk)
# Looking for patterns like:
#   string password = "MySecretPass123";
#   const string Password = "admin";
#   var password = "hardcoded";
if grep -qi 'password\s*=\s*"[^"]\+"' "$FILE" 2>/dev/null; then
    echo -e "${RED}🔒 Security: Hardcoded password in $(basename $FILE)${NC}"
    TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 SECURITY: Hardcoded password in \`$FILE\`\n"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check 2: API keys (CRITICAL - exposed credentials)
# Looking for patterns like:
#   string apiKey = "sk-1234567890abcdef";
#   const string ApiKey = "AKIAIOSFODNN7EXAMPLE";
if grep -qi 'apikey\s*=\s*"[^"]\+"' "$FILE" 2>/dev/null; then
    echo -e "${RED}🔒 Security: Hardcoded API key in $(basename $FILE)${NC}"
    TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 SECURITY: Hardcoded API key in \`$FILE\`\n"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check 3: Connection strings (CRITICAL - database access exposed)
# Looking for patterns like:
#   string connectionString = "Server=myServer;Database=myDB;User Id=sa;Password=pass";
#   const string ConnectionString = "Data Source=...;Initial Catalog=...";
if grep -qi 'connectionstring\s*=\s*"[^"]\+"' "$FILE" 2>/dev/null; then
    echo -e "${RED}🔒 Security: Hardcoded connection string in $(basename $FILE)${NC}"
    TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 SECURITY: Hardcoded connection string in \`$FILE\`\n"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check 4: SQL injection risks (CRITICAL when concatenation found)
# Looking for dangerous patterns like:
#   _context.Database.ExecuteSqlRaw("SELECT * FROM Users WHERE Id = " + userId);
#   FromSqlRaw($"DELETE FROM Orders WHERE CustomerId = {customerId}");
if grep -q "FromSqlRaw\|ExecuteSqlRaw\|ExecuteSqlCommand" "$FILE" 2>/dev/null; then
    if grep -B2 -A2 "FromSqlRaw\|ExecuteSqlRaw" "$FILE" 2>/dev/null | grep -q "+ *\"\|\\\$\"" 2>/dev/null; then
        echo -e "${RED}🔒 Security: SQL injection risk in $(basename $FILE)${NC}"
        TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 SECURITY: SQL injection risk in \`$FILE\`\n"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        # Raw SQL without obvious concatenation - still risky
        echo -e "${YELLOW}⚠️ Security: Raw SQL usage in $(basename $FILE)${NC}"
        TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ SECURITY: Raw SQL usage in \`$FILE\`\n"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

# Check 5: Logging sensitive data (CRITICAL - PII/PHI exposure)
# Looking for patterns like:
#   _logger.LogInformation($"User password: {password}");
#   Log.Debug("Credit card: " + creditCardNumber);
#   _logger.LogError($"SSN: {socialSecurityNumber}");
if grep -q "_logger\.\|Log\." "$FILE" 2>/dev/null; then
    if grep -B1 -A1 "_logger\.\|Log\." "$FILE" 2>/dev/null | grep -qi "password\|token\|ssn\|creditcard"; then
        echo -e "${RED}🔒 Security: Potentially logging sensitive data in $(basename $FILE)${NC}"
        TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** 🔴 SECURITY: Logging sensitive data in \`$FILE\`\n"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

# ====== WARNING SECURITY ISSUES ======

# Check 6: Unsafe deserialization (WARNING - potential RCE)
# Looking for patterns like:
#   JsonConvert.DeserializeObject<dynamic>(untrustedInput);
#   new XmlSerializer(typeof(object)).Deserialize(stream);
if grep -q "JsonConvert\.DeserializeObject<dynamic>\|XmlSerializer" "$FILE" 2>/dev/null; then
    echo -e "${YELLOW}⚠️ Security: Potentially unsafe deserialization in $(basename $FILE)${NC}"
    TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ SECURITY: Unsafe deserialization in \`$FILE\`\n"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check 7: Missing authorization checks (WARNING - access control)
# Looking for mutation/query handlers without authorization:
#   public async Task<User> DeleteUser(int id) // No [Authorize] attribute
#   {
#       // No _currentUser or authorization check
#       return await _context.Users.Delete(id);
#   }
if [[ "$FILE" =~ (Mutation|Query|Handler)\.cs$ ]]; then
    if ! grep -q "Authorize\|IsAuthenticated\|RequireRole\|_currentUser" "$FILE" 2>/dev/null; then
        if grep -q "Delete\|Update\|Create\|Remove" "$FILE" 2>/dev/null; then
            echo -e "${YELLOW}⚠️ Security: No authorization check found in $(basename $FILE)${NC}"
            TEMP_ISSUES="${TEMP_ISSUES}- **[$(date '+%Y-%m-%d %H:%M:%S')]** ⚠️ SECURITY: Missing authorization in \`$FILE\`\n"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
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