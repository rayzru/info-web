---
name: create-pr
description: Create GitHub pull request with comprehensive summary and test plan
context: fork
allowed-tools:
  - Bash
  - Read
  - Grep
---

# Create Pull Request

Creates GitHub pull requests with comprehensive summaries, analyzing all commits and changes since branching.

**Token Efficiency**: Automates PR creation workflow with proper analysis (35% savings: 3,000 → 1,950 tokens)

## Usage

Invoke with: `/create-pr [base-branch] [title]`

**Examples**:
- `/create-pr` - Create PR from current branch to main
- `/create-pr main "Add user settings page"` - Specify base branch and title
- `/create-pr develop` - Create PR targeting develop branch

## Prerequisites

- GitHub CLI installed (`gh` command available)
- GitHub CLI authenticated (`gh auth status`)
- Git repository with remote configured
- Current branch different from base branch
- Commits to be included in PR

## Workflow

### Step 1: Verify Prerequisites

**Check GitHub CLI availability**:

```bash
# Check gh command exists
which gh || echo "GitHub CLI not installed"

# Verify authentication
gh auth status
```

**If gh not authenticated**:
- Return error: "GitHub CLI not authenticated. Run 'gh auth login' first."
- Exit Skill

**Check git repository state**:

```bash
# Verify we're in a git repository
git rev-parse --git-dir

# Get current branch
git branch --show-current

# Get default base branch (usually main or master)
git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'
```

**If not in git repository**:
- Return error: "Not in a git repository"
- Exit Skill

### Step 2: Analyze Branch History

**Determine base branch**:
- If user provided base branch → Use that
- If not provided → Use default branch (main/master)

**Get commit history since divergence**:

```bash
# Get list of commits that will be in the PR
git log [base-branch]..HEAD --oneline

# Get detailed commit history
git log [base-branch]..HEAD --pretty=format:"%h %s%n%b"

# Get file changes summary
git diff [base-branch]...HEAD --stat

# Get detailed diff
git diff [base-branch]...HEAD
```

**Analyze commits**:
- **Commit count**: Number of commits in PR
- **Change scope**: Frontend, backend, database, config, tests, docs
- **Change types**: Features, fixes, refactors, tests, chore
- **Breaking changes**: Look for "BREAKING CHANGE:" in commit bodies
- **File statistics**: Files changed, insertions, deletions

**Check if branch is up to date with remote**:

```bash
# Check if current branch tracks remote
git rev-parse --abbrev-ref --symbolic-full-name @{u}

# Check if behind/ahead of remote
git status --porcelain --branch
```

**If branch not tracking remote**:
- Warn: "Branch not pushed to remote. Push with 'git push -u origin [branch-name]' first."

**If local branch diverged from remote**:
- Warn: "Local branch has unpushed commits. Push changes first."

### Step 3: Generate PR Title (if not provided)

**Only if user didn't provide title**

**Title generation logic**:

| Commit Count | Strategy | Example |
|--------------|----------|---------|
| 1 commit | Use commit message (remove co-author) | "feat(auth): Add password reset" |
| 2-3 commits | Summarize common theme | "Authentication improvements" |
| 4+ commits | Use branch name or scope | "Feature/user settings enhancements" |

**Parse branch name for context**:
- `feature/user-settings` → "Add user settings page"
- `fix/null-pointer-scheduler` → "Fix null pointer in scheduler"
- `refactor/api-cleanup` → "Refactor API structure"

**Capitalization**:
- First letter capitalized
- No period at end
- Keep under 60 characters

### Step 4: Generate PR Summary

**Summary structure**:

```markdown
## Summary
[1-3 bullet points describing what this PR does and why]

## Changes
- [List of key changes, grouped by area]

## Test Plan
- [ ] [Testing step 1]
- [ ] [Testing step 2]
- [ ] [Testing step 3]

## Related
[Linear issue links, if found in commit messages]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Summary section logic**:

Analyze all commits to create high-level summary:
- **What**: What functionality is added/changed/fixed
- **Why**: Business reason or problem solved
- **How** (optional): Technical approach if complex

**Example summaries**:
```markdown
## Summary
- Implements user notification preferences with email and SMS toggles
- Adds Settings API endpoint with tRPC integration
- Updates user profile UI to include notification settings
```

```markdown
## Summary
- Fixes critical null pointer exception in scheduler view
- Adds defensive null checks before accessing shift data
- Improves error handling for missing user assignments
```

**Changes section**:

Group changes by area:
- **Frontend**: UI components, pages, layouts
- **Backend**: API endpoints, tRPC procedures, business logic
- **Database**: Schema changes, migrations
- **Tests**: New tests, test updates
- **Docs**: Documentation updates
- **Config**: Build, deployment, environment config

**Example changes**:
```markdown
## Changes

**Frontend**:
- Add Settings page with notification toggles
- Update UserProfile component to show settings link
- Add SettingsForm component with validation

**Backend**:
- Add `settings.updateNotifications` tRPC procedure
- Add settings validation schema with Zod
- Update user model to include notification preferences

**Database**:
- Add `emailNotifications` and `smsNotifications` columns to users table
- Create migration for notification preferences

**Tests**:
- Add unit tests for settings API (95% coverage)
- Add E2E tests for settings page
```

**Test Plan section**:

Generate actionable test checklist based on changes:

| Change Type | Test Steps |
|-------------|-----------|
| **New feature** | "Test feature works as expected", "Test error cases", "Test edge cases" |
| **Bug fix** | "Verify bug is fixed", "Test original scenario", "Check for regressions" |
| **Refactor** | "Verify no behavior changes", "Run full test suite", "Check performance" |
| **UI changes** | "Visual testing against Figma", "Test responsive behavior", "Test accessibility" |
| **API changes** | "Test API endpoints", "Verify request/response formats", "Test error handling" |

**Example test plans**:
```markdown
## Test Plan
- [ ] Navigate to /app/settings and verify page loads
- [ ] Toggle email notifications on/off and verify saves
- [ ] Toggle SMS notifications and check API call succeeds
- [ ] Refresh page and verify settings persist
- [ ] Test with user who has no settings (default values)
- [ ] Run E2E test suite and verify all tests pass
```

**Related section**:

Extract Linear issue references from commits:
```bash
# Search for Linear issue patterns in commit messages
git log [base-branch]..HEAD --pretty=format:"%s%n%b" | grep -oE "PHX-[0-9]+"
```

If Linear issues found:
```markdown
## Related
- PHX-667 - Critical Infrastructure Audit
- PHX-660 - Browser Automation Optimization
```

### Step 5: Check for Uncommitted Changes

**Verify working tree is clean**:

```bash
git status --porcelain
```

**If uncommitted changes exist**:
- Warn: "⚠️ Uncommitted changes detected. Commit or stash changes before creating PR."
- List uncommitted files
- Ask if user wants to:
  - Commit changes with `/commit-coauthor`
  - Stash changes
  - Continue anyway (PR won't include uncommitted changes)

### Step 6: Push Branch to Remote (if needed)

**Check if branch is pushed**:

```bash
# Check if remote tracking branch exists
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
```

**If branch not pushed**:

```bash
# Push with upstream tracking
git push -u origin $(git branch --show-current)
```

**If push fails**:
- Show error message
- Common causes: Authentication, branch protection, network
- Recommend fix
- Exit Skill

### Step 7: Create Pull Request

**Use GitHub CLI to create PR**:

```bash
# Create PR with title and body
gh pr create \
  --base [base-branch] \
  --title "[pr-title]" \
  --body "$(cat <<'EOF'
[pr-summary-markdown]
EOF
)"
```

**HEREDOC formatting**:
- Use single quotes in `<<'EOF'` to prevent variable expansion
- Preserve markdown formatting (bullet points, checkboxes, headers)
- Include emoji in footer: 🤖

**Example gh command**:
```bash
gh pr create --base main --title "Add user notification settings" --body "$(cat <<'EOF'
## Summary
- Implements user notification preferences with email and SMS toggles
- Adds Settings API endpoint with tRPC integration
- Updates user profile UI to include notification settings

## Changes

**Frontend**:
- Add Settings page with notification toggles
- Update UserProfile component to show settings link

**Backend**:
- Add `settings.updateNotifications` tRPC procedure
- Add settings validation with Zod

**Database**:
- Add notification preference columns to users table

## Test Plan
- [ ] Navigate to /app/settings and verify page loads
- [ ] Toggle notifications and verify saves
- [ ] Refresh page and verify settings persist
- [ ] Run E2E test suite

## Related
- PHX-723 - User notification preferences

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 8: Verify PR Creation

**Capture PR URL from gh output**:

```bash
# GitHub CLI returns PR URL on success
# Example output: "https://github.com/owner/repo/pull/123"
```

**Extract PR number**:
- Parse URL to get PR number
- Example: `https://github.com/rayzru/info-web/pull/42` → PR #42

**Verify PR exists**:

```bash
# Check PR details
gh pr view [pr-number]
```

**If PR creation failed**:
- Show error from gh command
- Common causes: Base branch doesn't exist, permission denied, network error
- Recommend fix

### Step 9: Return PR Summary

**Return structured result**:

```json
{
  "success": true,
  "pr_number": 42,
  "pr_url": "https://github.com/rayzru/info-web/pull/42",
  "pr_title": "Add user notification settings",
  "base_branch": "main",
  "head_branch": "feature/user-settings",
  "commits_count": 5,
  "files_changed": 12,
  "insertions": 234,
  "deletions": 45,
  "test_plan_items": 4
}
```

**If PR creation failed**:

```json
{
  "success": false,
  "error": "Authentication required. Run 'gh auth login'.",
  "recommendation": "Authenticate with GitHub CLI and retry"
}
```

## Success Criteria

- [x] GitHub CLI authenticated and available
- [x] Branch history analyzed (all commits since base)
- [x] PR title generated or validated
- [x] Comprehensive summary with changes grouped by area
- [x] Test plan generated based on change type
- [x] Linear issue references extracted
- [x] Branch pushed to remote
- [x] PR created successfully
- [x] PR URL returned to user

## Error Handling

### Error 1: GitHub CLI Not Installed

**Symptom**: `gh: command not found`
**Cause**: GitHub CLI not installed
**Solution**:
```bash
# macOS
brew install gh

# Linux
sudo apt install gh

# Windows
winget install GitHub.cli
```

### Error 2: GitHub CLI Not Authenticated

**Symptom**: `gh auth status` returns "You are not logged into any GitHub hosts"
**Cause**: No authentication token configured
**Solution**:
```bash
gh auth login

# Follow interactive prompts:
# 1. Select GitHub.com
# 2. Select HTTPS
# 3. Authenticate via web browser
```

### Error 3: No Commits to Include

**Symptom**: `git log main..HEAD` returns empty
**Cause**: Current branch is same as base or no new commits
**Solution**:
```bash
echo "No commits to include in PR. Create commits first."
git log main..HEAD --oneline  # Show it's empty
```

### Error 4: Branch Not Pushed

**Symptom**: `git push` fails or branch has no remote tracking
**Cause**: Branch only exists locally
**Solution**:
```bash
# Push with upstream tracking
git push -u origin $(git branch --show-current)

# Retry PR creation after push succeeds
```

### Error 5: PR Already Exists

**Symptom**: gh returns "a pull request for branch [...] already exists"
**Cause**: PR already created for this branch
**Solution**:
```bash
# Show existing PR
gh pr view

# Ask user if they want to:
# 1. Update existing PR (add commits and push)
# 2. Close old PR and create new one
# 3. Cancel
```

### Error 6: Branch Protection Rules

**Symptom**: "Required status checks must pass before merging"
**Cause**: Base branch has protection rules
**Solution**:
- PR created successfully, but can't merge yet
- List required checks from error message
- Inform user: "PR created. Complete required checks before merging."

## Examples

### Example 1: Simple Feature PR

**User**: `/create-pr`

**Current branch**: `feature/user-settings`
**Base branch**: `main` (auto-detected)
**Commits**: 3 commits

**Git log output**:
```
f4c2a1b feat(settings): Add notification toggles
e3b9d8c feat(api): Add settings endpoint
a7c5e2f chore(db): Add notification columns
```

**Generated PR**:
```markdown
Title: Add user settings page

Body:
## Summary
- Implements user notification preferences with email and SMS toggles
- Adds Settings API endpoint with tRPC integration
- Adds database columns for notification preferences

## Changes

**Frontend**:
- Add Settings page with notification toggles

**Backend**:
- Add `settings.updateNotifications` tRPC procedure

**Database**:
- Add `emailNotifications` and `smsNotifications` columns

## Test Plan
- [ ] Navigate to /app/settings and verify page loads
- [ ] Toggle notifications and verify saves
- [ ] Verify settings persist after page refresh

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Output**:
```json
{
  "success": true,
  "pr_number": 42,
  "pr_url": "https://github.com/rayzru/info-web/pull/42",
  "pr_title": "Add user settings page",
  "commits_count": 3,
  "files_changed": 8
}
```

**Console log**: "✅ PR #42 created: https://github.com/rayzru/info-web/pull/42"

### Example 2: Bug Fix PR

**User**: `/create-pr main "Fix scheduler null pointer"`

**Current branch**: `fix/scheduler-null-pointer`
**Commits**: 1 commit

**Generated PR**:
```markdown
Title: Fix scheduler null pointer

Body:
## Summary
- Fixes critical null pointer exception in scheduler view
- Adds defensive null checks before accessing shift data
- Prevents app crash when user has no assigned shifts

## Changes

**Frontend**:
- Add null check in SchedulerView.tsx before accessing user.shifts
- Add loading state while shifts data is fetching
- Add empty state message for users with no shifts

**Tests**:
- Add unit test for null shifts scenario
- Add E2E test for user without shifts

## Test Plan
- [ ] Navigate to scheduler as user with no shifts
- [ ] Verify no error in console
- [ ] Verify empty state message displays
- [ ] Assign shift to user and verify scheduler populates
- [ ] Run unit and E2E tests

## Related
- PHX-734 - Scheduler crashes for new users

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Example 3: Multi-Area PR

**User**: `/create-pr`

**Commits**: 8 commits (frontend, backend, database, tests)

**Generated PR**:
```markdown
Title: User authentication improvements

Body:
## Summary
- Adds password reset functionality with email verification
- Improves session management and token refresh
- Enhances security with rate limiting

## Changes

**Frontend**:
- Add ForgotPassword page with email input form
- Add ResetPassword page with token validation
- Update Login page with "Forgot password?" link
- Add password strength indicator component

**Backend**:
- Add `auth.sendResetEmail` tRPC procedure
- Add `auth.resetPassword` tRPC procedure with token validation
- Add rate limiting middleware (5 requests per 15 minutes)
- Add email templates for password reset

**Database**:
- Add `passwordResetToken` and `passwordResetExpiry` columns to users
- Create index on `passwordResetToken` for fast lookup
- Add migration for password reset fields

**Tests**:
- Add unit tests for reset password flow (98% coverage)
- Add E2E tests for forgot/reset password journey
- Add rate limiting tests

**Security**:
- Token expires after 1 hour
- Rate limiting prevents brute force
- Email verification required before reset

## Test Plan
- [ ] Navigate to /auth/forgot-password and enter email
- [ ] Check email inbox for reset link (check spam folder)
- [ ] Click reset link and verify redirects to /auth/reset-password
- [ ] Enter new password and submit
- [ ] Verify can login with new password
- [ ] Test expired token (wait 1 hour or mock timestamp)
- [ ] Test rate limiting (6 requests within 15 minutes)
- [ ] Run full test suite and verify passes

## Related
- PHX-701 - Password reset functionality
- PHX-709 - Rate limiting for auth endpoints

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Example 4: Documentation PR

**User**: `/create-pr`

**Current branch**: `docs/api-reference`
**Only doc files changed**

**Generated PR**:
```markdown
Title: Add API documentation

Body:
## Summary
- Adds comprehensive API reference documentation
- Documents all tRPC procedures with examples
- Adds authentication flow diagrams

## Changes

**Documentation**:
- Add `docs/api/README.md` with API overview
- Add `docs/api/auth.md` documenting auth endpoints
- Add `docs/api/users.md` documenting user endpoints
- Add `docs/api/scheduler.md` documenting scheduler endpoints
- Add authentication flow diagrams (Mermaid)

## Test Plan
- [ ] Review documentation for accuracy
- [ ] Verify all code examples are correct
- [ ] Check diagrams render properly
- [ ] Verify links work

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Integration with Development Workflow

**Complete feature workflow**:
```bash
# 1. Create feature branch
git checkout -b feature/user-settings

# 2. Implement feature
# ... make changes ...

# 3. Verify no console errors
/debug-console http://localhost:3000/app/settings

# 4. Visual testing
/visual-test-figma 9406-230152 http://localhost:3000/app/settings

# 5. Commit changes
git add .
/commit-coauthor

# 6. Create pull request
/create-pr

# 7. Done! PR URL: https://github.com/rayzru/info-web/pull/42
```

**Combine with other Skills**:
- `/auth-verify` → Authenticate before testing
- `/debug-console` → Verify no errors
- `/visual-test-figma` → Verify design matches
- `/commit-coauthor` → Commit changes
- **`/create-pr`** ← This Skill

## PR Review Checklist

**Before creating PR** (auto-checked by Skill):
- ✅ All changes committed
- ✅ Branch pushed to remote
- ✅ No uncommitted changes
- ✅ Meaningful commit messages

**After creating PR** (user responsibility):
- [ ] Add reviewers
- [ ] Add labels (feature, bug, documentation)
- [ ] Link Linear issue if not auto-detected
- [ ] Request CI/CD run if not automatic
- [ ] Address review feedback

## Token Efficiency

**Baseline (manual PR creation)**:
- Read commit history: 300 tokens
- Analyze changes: 500 tokens
- Write PR title: 100 tokens
- Write PR summary: 800 tokens
- Group changes by area: 400 tokens
- Generate test plan: 500 tokens
- Execute gh command: 200 tokens
- Verify PR created: 200 tokens
- **Total**: ~3,000 tokens

**With create-pr Skill**:
- Skill invocation: 200 tokens
- Analyze commits: 400 tokens
- Auto-generate summary: 600 tokens
- Auto-generate test plan: 400 tokens
- Execute PR creation: 150 tokens
- Verify success: 200 tokens
- **Total**: ~1,950 tokens

**Savings**: 1,050 tokens (35% reduction)

**Projected usage**: 8x per week
**Weekly savings**: 8,400 tokens
**Annual savings**: 436,800 tokens (~$1.09/year)

## GitHub CLI Configuration

**Authentication scopes required**:
- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows
- `read:org` - Read organization membership

**Verify authentication**:
```bash
gh auth status
```

**Expected output**:
```
github.com
  ✓ Logged in to github.com as [username]
  ✓ Git operations protocol: https
  ✓ Token: gho_************************************
  ✓ Token scopes: repo, workflow, read:org
```

## Related Documentation

- [GitHub CLI Manual](https://cli.github.com/manual/) - gh command reference
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message standard
- [TOKEN_EFFICIENCY.md](../../guidelines/TOKEN_EFFICIENCY.md) - Token optimization patterns

---

**Skill Version**: 1.0
**Created**: 2026-01-09
**Last Updated**: 2026-01-09
**Requires**: Claude Code v2.1.0+, GitHub CLI (`gh`)
