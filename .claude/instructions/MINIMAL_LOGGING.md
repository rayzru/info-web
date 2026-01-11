# Minimal Logging (Optional)

**Version**: 2.0 - Token-Efficient
**Last Updated**: 2026-01-09

## Philosophy

**Logging is optional, not mandatory.**

Default: **NO logging** for standard tasks.
Log only when:
- Debugging specific issue
- Critical risk task (security, auth, PHI/PII)
- User explicitly requests audit trail

## When to Log

### ✅ Log These (Optional)

**Critical Risk Tasks**:
- Authentication/authorization changes
- PHI/PII data handling
- Security-critical operations
- Production data migrations
- Multi-tenant isolation changes

**When Debugging**:
- Task fails repeatedly
- Unexpected behavior
- Need to reproduce issue

**User Request**:
- User asks for detailed log
- Compliance/audit requirement

### ❌ Don't Log These (Default)

- Standard feature implementation
- UI components
- API endpoints (non-critical)
- Code reviews
- Tests
- Documentation updates

**Why**: Token overhead (300-500%+) with zero value unless actively debugging.

## What to Log (Minimal Format)

**Keep it SHORT** - One line per task:

```jsonl
{"task":"create-listing-endpoint","agent":"feature-builder","status":"success","duration":"12min"}
{"task":"security-review","agent":"security-expert","status":"complete","findings":2,"severity":"medium"}
{"task":"password-reset-impl","agent":"security-expert","status":"complete","codex_exchanges":5,"validated":true}
```

### Required Fields

- `task`: Task name (kebab-case)
- `agent`: Which agent
- `status`: success | failed | in_progress
- `duration`: Approximate (optional)

### Optional Fields (Only If Relevant)

- `findings`: Issue count (for reviews)
- `severity`: critical | high | medium | low
- `codex_exchanges`: Number of Codex validations
- `error`: Brief error message (if failed)

## File Location

**File**: `.claude/logs/[task-name]_log_YYYYMMDD.jsonl`

**One file per task** (not per action).

## Examples

### Example 1: Standard Feature (NO LOG)

```markdown
Task: Implement listing card component

Logging: SKIP (not critical, not debugging)
```

### Example 2: Critical Security Task (LOG)

```markdown
Task: Implement password reset flow

Risk: CRITICAL (credential handling, session management)

Log:
{"task":"password-reset","agent":"security-expert","status":"complete","codex_exchanges":5,"validated":true,"duration":"45min"}
```

### Example 3: Debugging Failed Task (LOG)

```markdown
Task: Fix broken authentication (3rd attempt)

Logging: YES (debugging why it keeps failing)

Log (detailed for debugging):
{"task":"auth-fix-attempt-3","agent":"debugger","status":"in_progress","previous_attempts":2}
{"action":"identified_issue","description":"Missing tenant filter in session query"}
{"action":"applied_fix","file":"src/server/auth/config.ts:42"}
{"task":"auth-fix-attempt-3","status":"success","duration":"20min"}
```

## Codex Validation Logging (Future)

**When Codex validation is implemented** (Issue #1), log validation for Critical tasks:

```jsonl
{"task":"multi-tenant-query","codex_exchanges":5,"alternatives_considered":3,"decision":"approach_B","rationale":"Better performance with tenant filter"}
```

**Purpose**: Prove validation happened, track effectiveness.

## Migration from Old SIMPLE_LOGGING.md

**Old approach** (SIMPLE_LOGGING.md):
- MANDATORY logging for ALL agents
- Full Codex dialogues (thousands of tokens)
- Full API responses
- Every tool call

**Token overhead**: 10,000-25,000 tokens per task

**New approach** (MINIMAL_LOGGING.md):
- OPTIONAL logging (default: skip)
- Minimal format (one line)
- Only critical or debugging tasks

**Token overhead**: 50-200 tokens per task (when logging)

**Savings**: **98%+ reduction** in logging token overhead!

## Guidelines for Agents

**Default behavior**: Don't log.

**When agent encounters Critical risk**:
1. Check if task is Critical (see VALIDATION_PATTERNS.md)
2. If yes, create minimal log entry
3. Continue work (logging takes <100 tokens)

**When debugging**:
1. User requests detailed log
2. Create log file
3. Log key actions (not everything)
4. Keep entries brief

## Comparison: Old vs New

### Old (SIMPLE_LOGGING.md)

```json
// 20-50 entries like this:
{
  "timestamp":"2024-01-15T10:00:10Z",
  "agent":"feature-planner",
  "action":"codex",
  "exchange":1,
  "type":"request",
  "content":{
    "summary":"Validate Repository pattern architecture",
    "full_prompt":"[4000 character complete prompt with all technical details]",
    "key_points":["Repository pattern","DataLoader","Tenant isolation"],
    "size_bytes":4567
  }
}
```

**Token cost per task**: ~15,000 tokens

### New (MINIMAL_LOGGING.md)

```json
// 1 entry:
{"task":"feature-planning","agent":"feature-planner","status":"success","codex_exchanges":3,"duration":"25min"}
```

**Token cost per task**: ~100 tokens

**Savings**: **99.3%** reduction!

## Decision: Keep Old or New?

**Recommendation**: Replace SIMPLE_LOGGING.md with MINIMAL_LOGGING.md.

**Rationale**:
- No processes currently use detailed logs
- Token overhead unsustainable
- Can add back detailed logging IF we build processes that use it
- Better to under-log than over-log (can always add more later)

## Future: When to Add Back Detailed Logging

**Add back IF**:
- We build automated log analysis tools
- Compliance requires detailed audit trail
- We implement agent effectiveness metrics (needs detailed data)
- Debugging workflow requires detailed history

**Until then**: Keep it minimal.

---

**Version Control**: Update this document when:
- Logging processes are built
- Metrics require more detail
- Compliance needs change
