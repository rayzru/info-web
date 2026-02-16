#!/bin/bash
# Setup Git hooks for Git Flow enforcement

set -e

HOOKS_DIR=".git/hooks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Setting up Git Flow protection hooks ==="

# Create pre-push hook
cat > "$HOOKS_DIR/pre-push" << 'EOF'
#!/bin/bash
# Git Flow protection: Prevent direct push to main/development

protected_branches="main development"
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

# Check if pushing to protected branch
while read local_ref local_sha remote_ref remote_sha; do
    remote_branch=$(echo $remote_ref | sed -e 's,.*/\(.*\),\1,')

    for protected in $protected_branches; do
        if [ "$remote_branch" = "$protected" ]; then
            echo ""
            echo "❌ BLOCKED: Direct push to '$protected' branch"
            echo ""
            echo "Git Flow requires:"
            echo "  1. Create feature branch from development"
            echo "  2. Push feature branch: git push origin $current_branch"
            echo "  3. Create PR via GitHub: $current_branch → development"
            echo ""
            echo "To force push (ONLY if you know what you're doing):"
            echo "  git push --no-verify"
            echo ""
            exit 1
        fi
    done
done

exit 0
EOF

chmod +x "$HOOKS_DIR/pre-push"
echo "✅ pre-push hook installed"

# Create prepare-commit-msg hook for co-author
cat > "$HOOKS_DIR/prepare-commit-msg" << 'EOF'
#!/bin/bash
# Auto-add co-author for AI-assisted commits

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

# Only add co-author for regular commits (not merge/squash/amend)
if [ -z "$COMMIT_SOURCE" ]; then
    # Check if co-author already present
    if ! grep -q "Co-Authored-By: Claude" "$COMMIT_MSG_FILE"; then
        echo "" >> "$COMMIT_MSG_FILE"
        echo "Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>" >> "$COMMIT_MSG_FILE"
    fi
fi
EOF

chmod +x "$HOOKS_DIR/prepare-commit-msg"
echo "✅ prepare-commit-msg hook installed"

# Create post-checkout hook for branch name guidance
cat > "$HOOKS_DIR/post-checkout" << 'EOF'
#!/bin/bash
# Show Git Flow guidance when creating new branch

prev_head=$1
new_head=$2
branch_switch=$3

# Only on branch switch (not file checkout)
if [ "$branch_switch" = "1" ]; then
    current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

    # Check if on main or development
    if [ "$current_branch" = "main" ] || [ "$current_branch" = "development" ]; then
        echo ""
        echo "📋 Git Flow Reminder:"
        echo "  Current branch: $current_branch"
        echo ""
        echo "To create a new feature branch:"
        echo "  git checkout development"
        echo "  git pull origin development"
        echo "  git checkout -b feature/my-feature"
        echo ""
    fi

    # Warn about incorrect branch names
    valid_prefixes="feature/ fix/ hotfix/ docs/ chore/ refactor/ test/ ci/"
    has_valid_prefix=false

    for prefix in $valid_prefixes; do
        if [[ "$current_branch" == $prefix* ]]; then
            has_valid_prefix=true
            break
        fi
    done

    if [ "$current_branch" != "main" ] && [ "$current_branch" != "development" ] && [ "$has_valid_prefix" = false ]; then
        echo ""
        echo "⚠️  Branch name '$current_branch' doesn't follow convention"
        echo "    Recommended: feature/name, fix/name, docs/name, etc."
        echo ""
    fi
fi
EOF

chmod +x "$HOOKS_DIR/post-checkout"
echo "✅ post-checkout hook installed"

echo ""
echo "✅ Git hooks installed successfully!"
echo ""
echo "Hooks installed:"
echo "  - pre-push: Prevents direct push to main/development"
echo "  - prepare-commit-msg: Auto-adds Claude co-author"
echo "  - post-checkout: Shows Git Flow guidance"
echo ""
echo "To bypass hooks (use carefully):"
echo "  git push --no-verify"
echo "  git commit --no-verify"
echo ""
