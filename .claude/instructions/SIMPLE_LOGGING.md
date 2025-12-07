# Simplified Agent Logging

## MANDATORY FOR ALL AGENTS

**EVERY agent in `.claude/agents/` MUST log their activities with FULL CONTENT**

This applies to ALL agents including but not limited to:
- feature-planner
- feature-builder
- code-reviewer
- test-writer
- test-analyzer
- graphql-architect
- dotnet-specialist
- security-expert
- performance-profiler
- review-comment-analyzer
- review-fix-executor
- architect
- debugger
- frontend-developer
- prompt-engineer
- test-coordinator

## How to Log (For AI Agents)

When executing ANY agent task, append JSON lines to a log file using the Write or Edit tools.

### CRITICAL: Log FULL CONTENT, Not Summaries

**❌ WRONG - Summary only:**
```json
{"content":"Validate architecture for Request Panel"}
```

**✅ CORRECT - Full content:**
```json
{"content":{"summary":"Validate architecture","full":"Validate this architectural approach for Request Panel GraphQL query:\n\n## Requirements\n- GraphQL query to fetch employee requests...[COMPLETE CONTENT]"}}
```

### 1. Start of Task
Create a new log file matching the feature/task name:
```
.claude/logs/[feature-name]_log_YYYYMMDD-HHMMSS.jsonl
```

**Naming Convention**:
- Use kebab-case feature name matching the spec file (e.g., `request-panel-view-requests`)
- Append `_log_` followed by timestamp
- Use `.jsonl` extension to indicate JSON Lines format
- Example: `request-panel-view-requests_log_20240115-100000.jsonl`

First entry:
```json
{"timestamp":"2024-01-15T10:00:00Z","agent":"feature-planner","action":"start","issue_id":"72","title":"Full issue title here","log_file":"request-panel-view-requests_log_20240115-100000.jsonl"}
```

### 2. During Task
Append each significant action with FULL CONTENT:

**GitLab API calls:**
```json
{
  "timestamp":"2024-01-15T10:00:01Z",
  "agent":"feature-planner",
  "action":"gitlab",
  "tool":"get_issue",
  "request":{"issue_iid":"72","project_id":"intrigma/fenix/fx-issues"},
  "response":{"title":"Request Panel | View Requests","description":"[FULL DESCRIPTION]","labels":["backend","frontend"]},
  "status":"success"
}
```

**Codex dialogues (MUST include full prompts and responses):**
```json
{
  "timestamp":"2024-01-15T10:00:10Z",
  "agent":"feature-planner",
  "action":"codex",
  "exchange":1,
  "type":"request",
  "content":{
    "summary":"Validate Repository pattern architecture",
    "full_prompt":"[COMPLETE MULTI-PARAGRAPH PROMPT WITH ALL TECHNICAL DETAILS]",
    "key_points":["Repository pattern","DataLoader","Tenant isolation"],
    "size_bytes":4567
  }
}
```

```json
{
  "timestamp":"2024-01-15T10:00:11Z",
  "agent":"feature-planner",
  "action":"codex",
  "exchange":1,
  "type":"response",
  "content":{
    "summary":"Approved with cursor encoding feedback",
    "full_response":"[COMPLETE CODEX RESPONSE WITH ALL RECOMMENDATIONS]",
    "key_feedback":["Add ID tiebreaker","Persist computed columns","Check collation"],
    "size_bytes":2345
  }
}
```

**CodeRabbit scans (MUST include full command and output):**
```json
{
  "timestamp":"2024-01-15T10:00:15Z",
  "agent":"code-reviewer",
  "action":"coderabbit",
  "type":"scan",
  "content":{
    "summary":"Automated code review scan",
    "full_command":"coderabbit review --plain --type uncommitted --base develop --config CLAUDE.md --config .coderabbit.yaml --no-color",
    "full_output":"[COMPLETE CODERABBIT OUTPUT - NOT TRUNCATED]",
    "findings_count":12,
    "execution_time_ms":45678,
    "exit_code":0
  }
}
```

**Tool unavailability (log when tools fail or timeout):**
```json
{
  "timestamp":"2024-01-15T10:00:20Z",
  "agent":"code-reviewer",
  "action":"tool_unavailable",
  "tool":"coderabbit",
  "reason":"timeout",
  "content":{
    "summary":"CodeRabbit scan timed out after 60 seconds",
    "attempted_command":"coderabbit review --plain --type uncommitted --base develop",
    "timeout_ms":60000,
    "fallback":"Continuing with Claude's guideline-based review"
  }
}
```

```json
{
  "timestamp":"2024-01-15T10:00:25Z",
  "agent":"feature-builder",
  "action":"tool_unavailable",
  "tool":"codex",
  "reason":"authentication_error",
  "content":{
    "summary":"Codex unavailable - authentication failed",
    "error_message":"Error: Codex not authenticated",
    "fallback":"Proceeding with Claude's guideline-based implementation"
  }
}
```

**Guidelines checked:**
```json
{
  "timestamp":"2024-01-15T10:00:20Z",
  "agent":"feature-planner",
  "action":"guideline",
  "file":"BACKEND_GUIDELINE.MD",
  "patterns_found":["Repository","DataLoader","Clean Architecture"],
  "sections_referenced":["Section 3.2: QueryFilter","Section 5.1: Tenant Isolation"],
  "applied":true
}
```

**Files created/modified:**
```json
{
  "timestamp":"2024-01-15T10:00:30Z",
  "agent":"feature-planner",
  "action":"file",
  "operation":"create",
  "path":"/specs/feature_spec.md",
  "size_bytes":24435,
  "sections":["Requirements","Technical Design","Implementation"]
}

```

### 3. End of Task
```json
{"timestamp":"2024-01-15T10:00:40Z","agent":"feature-planner","action":"complete","status":"success","artifacts":["/specs/feature_spec.md"]}
```

## Content Logging Rules

### MANDATORY: Always Log Full Content

1. **Codex Dialogues**:
   - MUST include complete prompts (even if 500+ lines)
   - MUST include complete responses
   - Include structured format with summary AND full content
   - Log each exchange (request + response)

2. **CodeRabbit Scans**:
   - MUST include complete command executed
   - MUST include complete output (NOT truncated or summarized)
   - Include execution time, exit code, findings count
   - Log parsed findings structure

3. **Tool Unavailability** (NEW):
   - MUST log when tools fail, timeout, or are unavailable
   - Include tool name, reason (timeout/auth error/not installed/etc.)
   - Document fallback action taken
   - Examples: CodeRabbit timeout, Codex authentication failure, GitLab API error

4. **GitLab API Responses**:
   - Include full issue descriptions
   - Include all metadata (labels, assignees, etc.)
   - Don't abbreviate or summarize

5. **Why Full Content Matters**:
   - **Audit Trail**: Need exact record of decisions and tool interactions
   - **Debugging**: Can't debug from summaries
   - **Training Data**: These logs may train future models
   - **Knowledge Transfer**: Next person needs full context
   - **Reliability Tracking**: Tool unavailability patterns help improve workflow

6. **Structure for Large Content**:
   ```json
   {
     "content": {
       "summary": "1-line description",
       "full": "Complete content here...",
       "key_points": ["point1", "point2"],
       "size_bytes": 12345
     }
   }
   ```

## Agent-Specific Logging Requirements

### Feature Planning/Building Agents
**Agents**: feature-planner, feature-builder, architect

**Must Log**:
- Complete Codex dialogues (full prompts and responses)
- GitLab API interactions with full issue content
- Guideline consultations with sections referenced
- Files created/modified with sizes
- Complete specifications and implementations

### Review/Analysis Agents
**Agents**: code-reviewer, review-comment-analyzer, review-fix-executor

**Must Log**:

1. **CodeRabbit scans** (when available):
```json
{
  "action": "coderabbit",
  "type": "scan",
  "content": {
    "summary": "Automated code review scan",
    "full_command": "coderabbit review --plain --type uncommitted --base develop --config CLAUDE.md",
    "full_output": "[COMPLETE OUTPUT - NOT TRUNCATED]",
    "findings_count": 8,
    "execution_time_ms": 45000,
    "exit_code": 0
  }
}
```

2. **CodeRabbit unavailability** (when timeout/error):
```json
{
  "action": "tool_unavailable",
  "tool": "coderabbit",
  "reason": "timeout",
  "content": {
    "summary": "CodeRabbit timed out after 60 seconds",
    "attempted_command": "coderabbit review --plain --type uncommitted --base develop",
    "timeout_ms": 60000,
    "fallback": "Continuing with Claude's guideline-based review"
  }
}
```

3. **Codex consultations** (when used):
```json
{
  "action": "codex",
  "exchange": 1,
  "type": "request",
  "content": {
    "summary": "Consult Codex on security finding",
    "full_prompt": "[COMPLETE CONSULTATION REQUEST]",
    "size_bytes": 5432
  }
}
```

4. **Claude's reviews** (always):
```json
{
  "action": "review",
  "type": "submission",
  "content": {
    "summary": "Claude's review of feature X",
    "full_feedback": "[COMPLETE REVIEW TEXT WITH ALL COMMENTS]",
    "issues_found": ["issue1", "issue2"],
    "approval_status": "Changes Required",
    "guideline_violations": ["BACKEND_GUIDELINE.MD - Section 3.2"],
    "assistant_confirmations": {
      "coderabbit": "2 issues also flagged by CodeRabbit",
      "codex": "1 issue confirmed by Codex consultation"
    }
  }
}
```

### Testing Agents
**Agents**: test-writer, test-coordinator, test-analyzer, e2e-test-specialist

**What Test Coordinator MUST Log**:
1. **Start**: Testing request received from feature-builder with scope
2. **Risk assessment**: Risk level determination (HIGH/MEDIUM/LOW)
3. **Routing decisions**: Which specialist(s) assigned and why (with full justification)
4. **Codex-medium dialogues**: Quick coordination decision validations (full prompts/responses)
5. **Quality gates**: Coverage thresholds checked, pass/fail status with metrics
6. **Aggregate results**: Combined results from all specialists (full reports)
7. **Complete**: Final report to feature-builder with all metrics

**What Test Writer MUST Log**:
1. **Start**: Feature/component being tested with full scope
2. **Risk categorization**: Test scenarios categorized by risk level (HIGH/MEDIUM/LOW)
3. **Codex-medium dialogues**: Quick pattern validation exchanges (full content)
4. **Codex-high validation**: Single strategy validation in Phase 2 (full prompt and response)
5. **Test execution**: Full test runs with complete pass/fail results and stack traces
6. **Test-analyzer calls**: When multiple failures (>3) trigger analysis request (full request)
7. **Coverage metrics**: Line/branch coverage results with detailed breakdown
8. **Complete**: Final status reported to test-coordinator

**What Test Analyzer MUST Log**:
1. **Start**: Failure analysis request with test framework (xUnit/Jest/Playwright)
2. **Failure collection**: All failure data collected (complete error messages and stack traces)
3. **Codex-medium dialogues**: Pattern recognition validations (full content)
4. **Root cause analysis**: Complete analysis with failure groupings
5. **Phase 7 feedback**: Refinement requests from specialists with responses (max 2 rounds)
6. **Complete**: Final analysis report with structured failure groups

**What E2E Test Specialist MUST Log**:
1. **Start**: Feature/journey being tested with full scope
2. **Risk assessment**: Complete risk analysis with justification (HIGH/MEDIUM/LOW criteria)
3. **Test strategy**: Full E2E test plan with all scenarios and browser/device matrix
4. **Codex validations**: Both codex-medium (quick checks) and codex-high (full strategy validation)
5. **Test execution**: E2E runs with complete Playwright logs, screenshots, traces
6. **Accessibility results**: axe-core violation reports + manual testing findings (NVDA/JAWS)
7. **Test-analyzer calls**: When multiple E2E failures trigger analysis (full E2E context)
8. **Coverage verification**: By risk level with detailed metrics (HIGH/MEDIUM/LOW requirements)
9. **Complete**: Final report to test-coordinator with all coverage metrics and accessibility results

### Specialist Agents
**Agents**: graphql-architect, dotnet-specialist, security-expert, performance-profiler

**Must Log**:
```json
{
  "action": "consultation",
  "agent": "graphql-architect",
  "content": {
    "summary": "DataLoader design review",
    "full_consultation": "[COMPLETE TECHNICAL DISCUSSION]",
    "recommendations": ["rec1", "rec2"],
    "patterns_applied": ["GRAPHQL_GUIDELINE.MD - DataLoader pattern"]
  }
}
```

### Debug/Analysis Agents
**Agents**: debugger, prompt-engineer

**Must Log**:
- Complete error traces
- Full debugging sessions
- Solution attempts with results

## Inter-Agent Communication Logging

**CRITICAL**: When agents communicate with each other, log BOTH sides:

```json
// Agent A calling Agent B
{
  "action": "agent_call",
  "from": "feature-builder",
  "to": "code-reviewer",
  "content": {
    "summary": "Request code review",
    "full_request": "[COMPLETE SUBMISSION INCLUDING CODE]",
    "artifacts": ["/specs/feature_impl.md"]
  }
}

// Agent B responding
{
  "action": "agent_response",
  "from": "code-reviewer",
  "to": "feature-builder",
  "content": {
    "summary": "Review complete",
    "full_response": "[COMPLETE REVIEW WITH ALL FEEDBACK]",
    "status": "Changes Required"
  }
}
```

## Simple Implementation

For AI agents (Claude), just use the Append operation:

```python
# At start - create log file (matching feature name)
Write: .claude/logs/request-panel-view-requests_log_20240115-100000.jsonl
Content: {"timestamp":"...","agent":"feature-planner","action":"start",...}

# During execution - append entries
Edit: .claude/logs/request-panel-view-requests_log_20240115-100000.jsonl
(append new JSON lines at end of file)
```

## What to Log

### Essential (Always Log):
- Task start/end
- External tool calls (GitLab, Codex)
- Files created/modified
- Agent handoffs

### Optional (If Relevant):
- Guideline consultations
- Major decisions
- Errors or retries

## Keep It Simple

- One JSON object per line (JSONL format)
- Don't worry about complex structures
- Focus on traceability, not perfection
- If you forget to log something, continue (don't go back)

## Example Session

Here's what a real session log might look like:

**File**: `.claude/logs/request-panel-view-requests_log_20240115-100000.jsonl`
```json
{"timestamp":"2024-01-15T10:00:00Z","agent":"feature-planner","action":"start","issue":"72","feature":"request-panel-view-requests"}
{"timestamp":"2024-01-15T10:00:01Z","agent":"feature-planner","action":"gitlab","tool":"get_issue","status":"success"}
{"timestamp":"2024-01-15T10:00:10Z","agent":"feature-planner","action":"codex","exchange":1,"type":"request"}
{"timestamp":"2024-01-15T10:00:11Z","agent":"feature-planner","action":"codex","exchange":1,"type":"response"}
{"timestamp":"2024-01-15T10:00:20Z","agent":"feature-planner","action":"file","operation":"create","path":"/specs/request-panel-view-requests_spec.md"}
{"timestamp":"2024-01-15T10:00:21Z","agent":"feature-planner","action":"complete","status":"success"}
```

## Reading Logs

To view logs later:
```bash
# Latest log
ls -t .claude/logs/*.jsonl | head -1 | xargs cat | jq '.'

# Specific agent actions
grep '"agent":"feature-planner"' .claude/logs/*.jsonl | jq '.'

# Count actions
cat .claude/logs/*.jsonl | jq -r '.action' | sort | uniq -c

# View logs for specific feature
cat .claude/logs/request-panel-view-requests_log_*.jsonl | jq '.'
```

## Complete Multi-Agent Example

**Note**: Example log files will be created in `.claude/logs/` directory as agents complete their workflows. A typical multi-agent example would show:
- Feature-planner creating a spec with full Codex dialogues
- Feature-builder implementing with component validation
- Code-reviewer providing detailed feedback
- Test-writer generating and running tests
- All inter-agent communications with full content

## Summary: What EVERY Agent Must Log

1. **Starting work**: Agent name, task, inputs
2. **External calls**: GitLab, Codex, file operations - with FULL responses
3. **Agent-to-agent**: Both request AND response with FULL content
4. **Decisions made**: What was chosen and why
5. **Files created/modified**: Paths and sizes
6. **Completion**: Status, artifacts, next steps

## Log File Naming

**Pattern**: `[feature-name]_log_YYYYMMDD-HHMMSS.jsonl`

- **feature-name**: Kebab-case name matching the spec file (e.g., `shift-sorting-rules`)
- **_log_**: Fixed separator to identify log files
- **YYYYMMDD-HHMMSS**: Timestamp when log was created
- **.jsonl**: JSON Lines format extension

**Examples**:
- `request-panel-view-requests_log_20240115-143000.jsonl`
- `shift-sorting-rules_log_20240116-091500.jsonl`
- `employee-validation_log_20240117-110000.jsonl`

## Remember

- **MANDATORY for ALL agents** - Not optional
- **FULL CONTENT always** - Never summaries
- **Include structured data** - summary + full content
- **Log inter-agent comms** - Both directions
- **Use feature-based naming** - Match spec file names
- **One log per feature/task** - Not per session