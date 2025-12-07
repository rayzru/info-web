#!/bin/bash

# Claude Code Review Script - Simplified Orchestrator
# Delegates to .claude/agents/review-precommit.md agent

set -e

# Parse command line arguments
QUICK_MODE=false
HOOK_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --quick) QUICK_MODE=true; shift ;;
        --hook) HOOK_MODE=true; shift ;;
        *) echo "Usage: $0 [--quick] [--hook]"; exit 1 ;;
    esac
done

# Output header
if [ "$HOOK_MODE" = true ]; then
    echo "🤖 Claude Code Review"
else
    echo "🤖 Claude Code Pre-Commit Review"
    echo "===================================="
fi

# Initialize environment - ensure we're in repo root
cd "$(git rev-parse --show-toplevel)"
CURRENT_BRANCH=$(git branch --show-current)

# Get changed files
CHANGED_FILES=$(git diff origin/develop...HEAD --name-only 2>/dev/null || git diff develop...HEAD --name-only 2>/dev/null || git diff --cached --name-only)
if [ -z "$CHANGED_FILES" ]; then
    echo "ℹ️  No changes detected to review."
    exit 0
fi

# Detect scope using patterns
FRONTEND_CHANGES=$(echo "$CHANGED_FILES" | grep "^front-end\.iss-free/" || true)
BACKEND_CHANGES=$(echo "$CHANGED_FILES" | grep "^src/" || true)

# Determine scope
if [ -n "$FRONTEND_CHANGES" ] && [ -n "$BACKEND_CHANGES" ]; then
    SCOPE="fullstack"
elif [ -n "$FRONTEND_CHANGES" ]; then
    SCOPE="frontend"
elif [ -n "$BACKEND_CHANGES" ]; then
    SCOPE="backend"
else
    SCOPE="infrastructure"
fi

# Display info (unless in hook mode)
if [ "$HOOK_MODE" = false ]; then
    echo "📊 Branch: $CURRENT_BRANCH"
    echo "📊 Scope: $SCOPE"
    echo "📁 Files: $(echo "$CHANGED_FILES" | wc -l | tr -d ' ') changed"
    echo ""
fi

# Quick mode - basic review without Claude
if [ "$QUICK_MODE" = true ]; then
    echo "📝 Quick mode: Running basic analysis..."
    echo ""
    echo "Branch: $CURRENT_BRANCH"
    echo "Scope: $SCOPE"
    echo "Files changed: $(echo "$CHANGED_FILES" | wc -l | tr -d ' ')"
    echo ""
    echo "Run './.claude/review/precommit-review.sh' for full analysis."
    exit 0
fi

# Check if Claude CLI is available
if ! command -v claude &> /dev/null; then
    echo "⚠️  Claude Code CLI not found."
    echo "Install: https://docs.anthropic.com/claude/docs/claude-cli"
    exit 1
fi

# Get agent file path
AGENT_FILE="$(git rev-parse --show-toplevel)/.claude/agents/review-precommit.md"

if [ ! -f "$AGENT_FILE" ]; then
    echo "❌ Agent file not found: $AGENT_FILE"
    exit 1
fi

# Build prompt for review-precommit agent
REVIEW_PROMPT="I need a comprehensive pre-commit code review using the review-precommit agent.

**Context:**
- Branch: $CURRENT_BRANCH
- Detected Scope: $SCOPE
- Files Changed: $(echo "$CHANGED_FILES" | wc -l | tr -d ' ')

**Changed Files:**
\`\`\`
$CHANGED_FILES
\`\`\`

Follow the review-precommit agent workflow from $AGENT_FILE:
1. Create review.md IMMEDIATELY
2. Load and check ALL applicable guidelines
3. Perform multi-perspective review based on scope
4. Validate critical/high findings with Codex
5. Assess severity and determine verdict
6. Post findings to GitLab MR if exists
7. Finalize comprehensive review report

Proceed with the mandatory workflow."

# Run Claude with timeout
TIMEOUT_DURATION=600  # 10 minutes

if [ "$HOOK_MODE" = true ]; then
    echo "⏳ Running analysis (may take up to 10 minutes)..."
else
    echo "🚀 Starting comprehensive review process..."
    echo ""
fi

# Execute with timeout
if command -v timeout >/dev/null 2>&1; then
    TIMEOUT_CMD="timeout $TIMEOUT_DURATION"
elif command -v gtimeout >/dev/null 2>&1; then
    TIMEOUT_CMD="gtimeout $TIMEOUT_DURATION"
else
    echo "⚠️  No timeout command available (install coreutils)"
    TIMEOUT_CMD=""
fi

# Run Claude via review-precommit agent
if [ -n "$TIMEOUT_CMD" ]; then
    $TIMEOUT_CMD claude -p --dangerously-skip-permissions "$REVIEW_PROMPT" 2>&1
    EXIT_CODE=$?
else
    claude -p --dangerously-skip-permissions "$REVIEW_PROMPT" 2>&1
    EXIT_CODE=$?
fi

# Handle result
if [ $EXIT_CODE -eq 0 ]; then
    if [ "$HOOK_MODE" = true ]; then
        echo "🎉 Review completed!"
    else
        echo ""
        echo "✅ Review process completed!"
    fi
    exit 0
elif [ $EXIT_CODE -eq 124 ] || [ $EXIT_CODE -eq 143 ]; then
    echo ""
    echo "⏱️  Review timed out after 10 minutes."
    echo "Run './.claude/review/precommit-review.sh' manually in interactive mode."
    exit 1
else
    echo ""
    echo "⚠️  Review failed (exit code $EXIT_CODE)"
    exit $EXIT_CODE
fi
