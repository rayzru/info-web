# Token Efficiency for Agents

**Purpose**: Maximize agent value per token spent through intelligent context management, tool selection, and output optimization.

**Status**: Active (2026-01-09)

**Target**: 15-25% token reduction vs naive implementations while maintaining or improving quality.

---

## Why Token Efficiency Matters

### 1. Cost Impact
- **Sonnet 4.5**: $3/million input tokens, $15/million output tokens
- **Inefficient agent**: 50,000 tokens/task → $0.90/task (input+output)
- **Efficient agent**: 10,000 tokens/task → $0.18/task (input+output)
- **Savings**: 80% cost reduction at scale

### 2. Latency Impact
- Fewer tokens → Faster response times
- Smaller context → Better cache hit rates
- Efficient prompts → Fewer API round-trips

### 3. Context Window Utilization
- Sonnet 4.5: 200k token context window
- Efficient usage → More complex tasks in single conversation
- Token waste → Premature context exhaustion

---

## Token Waste Patterns (From PHX-667 Audit)

### Real-World Waste Examples

#### 1. Duplicate Guidelines (300-500% overhead)
**Found**: `SIMPLE_LOGGING.md` + `MINIMAL_LOGGING.md` (contradictory logging instructions)

**Token Cost**:
- SIMPLE_LOGGING.md: 10,000-25,000 tokens/task
- MINIMAL_LOGGING.md: 50-200 tokens/task
- **Overhead**: 9,950-24,800 tokens/task (98-99% waste)

**Fix**: Deleted SIMPLE_LOGGING.md

**Learning**: Audit for duplicate/contradictory instructions regularly

#### 2. Unused Templates (100% waste)
**Found**:
- `implementation_tracking.md`: 0 instances in project (0% compliance)
- `code_review_report.md`: 0 instances in project (0% compliance)

**Token Cost**: ~2,000 tokens each to read/process (4,000 total waste)

**Fix**: Deleted both templates

**Learning**: Track template usage metrics, delete unused templates

#### 3. Phantom Agent References (Wasted reads)
**Found**: `PLAYWRIGHT_TESTING_GUIDE.md` referenced non-existent `test-coordinator` agent

**Token Cost**: Agent tries to read phantom agent file → error → retry → wasted tokens

**Fix**: Updated workflow to use actual agents

**Learning**: Validate all cross-references during audits

#### 4. Verbose Logging (10-50x overhead)
**Found**: SIMPLE_LOGGING.md required multi-section logs for every task

**Token Cost**:
```markdown
## Task Analysis (500 tokens)
## Research Phase (2,000 tokens)
## Implementation Plan (1,500 tokens)
## Execution Log (3,000 tokens)
## Validation Results (1,000 tokens)
## Lessons Learned (500 tokens)
---
Total: 8,500 tokens/task
```

**Fix**: MINIMAL_LOGGING.md (50-200 tokens/task, only when valuable)

**Learning**: Default to minimal output, log only when it provides value

---

## Token Efficiency Best Practices

### 1. Minimal Logging (Default: Skip)

**Principle**: Logs are overhead unless they provide future value.

✅ **When to log**:
- Complex multi-agent collaboration (helps debug coordination)
- Novel architectural decisions (ADR provides future reference)
- Audit findings (PHX-663, PHX-664, PHX-665 reports)
- Validation results for critical-risk changes

❌ **When to skip**:
- Simple single-agent tasks (user sees output directly)
- Routine CRUD operations
- Obvious bug fixes
- Standard feature implementations

**Token Savings**: 8,000-24,000 tokens/task (95-98% reduction)

**Implementation**:
```markdown
## Default Behavior
DO NOT create logs for standard tasks.

## When to Log
Create .claude/logs/[task-id]_[brief-description].md when:
- Task involves 3+ agent collaborations
- Architectural decision requires ADR
- Audit/validation findings need documentation
- User explicitly requests documentation
```

### 2. Smart Tool Selection

**Principle**: Use the most context-efficient tool for the job.

#### Tool Efficiency Matrix

| Task | Inefficient | Efficient | Token Savings |
|------|-------------|-----------|---------------|
| Find files | `Bash: find . -name "*.ts"` | `Glob: **/*.ts` | 70-90% |
| Search code | `Bash: grep -r "pattern"` | `Grep: pattern=...` | 60-80% |
| Read file | `Bash: cat file.ts` | `Read: file_path=...` | 50-70% |
| Edit file | `Bash: sed/awk` | `Edit: old_string=...` | 40-60% |
| Explore codebase | `Grep` + `Read` x10 | `Task: subagent=Explore` | 30-50% |

**Examples**:

❌ **Inefficient** (2,000 tokens):
```bash
find /Users/arumm/info-web -type f -name "*.ts" | head -20
grep -r "useAuth" /Users/arumm/info-web/src
cat /Users/arumm/info-web/src/hooks/useAuth.ts
```

✅ **Efficient** (400 tokens):
```markdown
Glob: pattern="**/*.ts", head_limit=20
Grep: pattern="useAuth", path="src", output_mode="files_with_matches"
Read: file_path="/Users/arumm/info-web/src/hooks/useAuth.ts"
```

**Token Savings**: 1,600 tokens (80% reduction)

### 3. Parallel Tool Calls

**Principle**: Execute independent operations concurrently to reduce round-trips.

❌ **Sequential** (3 round-trips, 3x latency):
```markdown
1. Read file A → Wait for result
2. Read file B → Wait for result
3. Read file C → Wait for result
```

✅ **Parallel** (1 round-trip, 1x latency):
```markdown
Single message with:
- Read: file_path="A"
- Read: file_path="B"
- Read: file_path="C"
```

**Token Savings**: Primarily latency, but also reduces conversation overhead (fewer "Now let me read..." messages)

### 4. Bounded Exploration

**Principle**: Use limits and filters to avoid reading unnecessary context.

❌ **Unbounded**:
```markdown
Grep: pattern="component", output_mode="content"
→ Returns 10,000 matches, 50,000 tokens
```

✅ **Bounded**:
```markdown
Grep: pattern="component", output_mode="files_with_matches", head_limit=10
→ Returns 10 file paths, 500 tokens
```

**Token Savings**: 49,500 tokens (99% reduction)

**Implementation**:
- Always use `head_limit` for Grep unless you need all results
- Use `output_mode="files_with_matches"` for broad searches
- Use `output_mode="content"` only when you need line content
- Use `offset` + `head_limit` to paginate large results

### 5. Incremental Reading

**Principle**: Read only what you need, when you need it.

❌ **Read everything upfront**:
```markdown
Read all 50 files in /src to understand architecture
→ 100,000 tokens
```

✅ **Incremental reading**:
```markdown
1. Glob: pattern="src/**/*.ts" → Get file list (500 tokens)
2. Read: file_path="src/index.ts" → Entry point (2,000 tokens)
3. Grep: pattern="export.*from" → Find key exports (1,000 tokens)
4. Read: file_path="src/[key-file].ts" → Targeted read (3,000 tokens)
→ Total: 6,500 tokens (93% reduction)
```

### 6. Template Compliance Tracking

**Principle**: Measure template usage to identify waste.

**Metrics**:
- **Compliance rate**: % of eligible artifacts following template
- **Usage rate**: % of created files vs template instances found
- **Token overhead**: Template tokens × (1 - compliance_rate)

**From PHX-664 Audit**:
| Template | Compliance | Usage | Action |
|----------|-----------|-------|--------|
| feature_spec.md | 63% (5/8) | High | Keep, improve compliance |
| implementation_tracking.md | 0% (0/∞) | None | Delete |
| code_review_report.md | 0% (0/∞) | None | Delete |

**Token Savings**: 4,000 tokens (deleted 2 unused templates)

**Implementation**:
```markdown
## Template Audit (Quarterly)
For each template:
1. Grep for instances: pattern="# [Template Title]"
2. Count compliance: instances_found / eligible_artifacts
3. If compliance <20% for 2 quarters → Delete template
4. If compliance >80% → Template is valuable, keep
```

### 7. Reference Validation

**Principle**: Broken references waste tokens on failed reads.

**From PHX-665 Audit**:
- VISUAL_TESTING_PROTOCOL.md referenced deleted `implementation_tracking.md` template
- Agent tries to read template → File not found error → Retry → Wasted tokens

**Fix**: Validate all cross-references during file modifications

**Implementation**:
```markdown
## Before Deleting Files
1. Grep: pattern="[filename]" across all .claude files
2. Update or remove all references
3. Delete file

## During Audits
1. Extract all markdown links: pattern="\[.*\]\(.*\)"
2. Validate each target exists
3. Fix broken references
```

### 8. Efficient Agent Collaboration

**Principle**: Route to specialized agents instead of expanding generalist scope.

❌ **Scope creep** (inefficient):
```markdown
# feature-builder
- Builds feature (10,000 tokens)
- Performs security review (5,000 tokens)
- Writes E2E tests (8,000 tokens)
- Optimizes database queries (4,000 tokens)
→ Total: 27,000 tokens, lower quality across all domains
```

✅ **Specialized routing** (efficient):
```markdown
# feature-builder
- Builds feature (10,000 tokens)
- Routes to @security-expert (2,000 tokens)
- Routes to @e2e-test-specialist (3,000 tokens)
- Routes to @db-expert (2,000 tokens)
→ Total: 17,000 tokens, higher quality per domain
```

**Token Savings**: 10,000 tokens (37% reduction) + quality improvement

**See**: [SOLID_FOR_AGENTS.md](SOLID_FOR_AGENTS.md) - Single Responsibility Principle

---

## Output Optimization

### 1. Concise Communication

**Principle**: Communicate intent clearly with minimal words.

❌ **Verbose**:
```markdown
I am now going to proceed with reading the file at the specified path in order to understand its current contents before making any modifications, as this is a best practice to ensure that we maintain context and avoid making changes that might conflict with existing code.
```
**Token cost**: ~50 tokens

✅ **Concise**:
```markdown
Reading file to understand current implementation.
```
**Token cost**: ~8 tokens

**Token Savings**: 42 tokens (84% reduction)

### 2. Structured Data Over Prose

**Principle**: Use markdown tables, lists, and code blocks instead of paragraphs.

❌ **Prose**:
```markdown
The security-expert agent has six incoming routing connections from other agents. These include the feature-builder agent, the backend-developer agent, the frontend-developer agent, the db-expert agent, the dev-automation agent, and the architect agent. This makes security-expert the most highly connected hub in the agent collaboration graph.
```
**Token cost**: ~70 tokens

✅ **Structured**:
```markdown
**security-expert incoming routes**: 6
- feature-builder
- backend-developer
- frontend-developer
- db-expert
- dev-automation
- architect
```
**Token cost**: ~30 tokens

**Token Savings**: 40 tokens (57% reduction)

### 3. Avoid Redundant Explanations

**Principle**: Don't explain what the code/tool clearly shows.

❌ **Redundant**:
```markdown
I'm going to use the Grep tool to search for the pattern "useAuth" in the src directory. This will help us find all files that use the useAuth hook.

Grep: pattern="useAuth", path="src"

The results show that useAuth is used in 5 files. Let me now read each of these files to understand how the hook is being used.
```
**Token cost**: ~80 tokens

✅ **Concise**:
```markdown
Grep: pattern="useAuth", path="src"

Found 5 files. Reading implementation:
Read: file_path="src/hooks/useAuth.ts"
```
**Token cost**: ~20 tokens

**Token Savings**: 60 tokens (75% reduction)

---

## Context Management Strategies

### 1. Use Task Tool for Exploration

**Principle**: Delegate open-ended exploration to sub-agents to avoid polluting main context.

❌ **Direct exploration** (pollutes context):
```markdown
Grep: pattern="auth" → 200 matches (10,000 tokens)
Grep: pattern="authentication" → 150 matches (8,000 tokens)
Grep: pattern="login" → 100 matches (5,000 tokens)
Read: 20 files (40,000 tokens)
→ Total: 63,000 tokens in main conversation
```

✅ **Delegated exploration** (clean context):
```markdown
Task: subagent=Explore, prompt="Find all authentication-related code"
→ Explore agent consumes 63,000 tokens in subprocess
→ Returns 2,000 token summary to main conversation
```

**Context Savings**: 61,000 tokens (97% reduction in main context)

### 2. Summarize Large Results

**Principle**: Compress verbose outputs into key insights.

❌ **Raw output**:
```markdown
Here are all 50 test files I found:
1. /tests/auth/login.test.ts
2. /tests/auth/logout.test.ts
...
50. /tests/utils/validation.test.ts
```
**Token cost**: ~500 tokens

✅ **Summarized**:
```markdown
Found 50 test files:
- auth: 12 files
- api: 18 files
- components: 15 files
- utils: 5 files
```
**Token cost**: ~40 tokens

**Token Savings**: 460 tokens (92% reduction)

### 3. Reference Files by Path

**Principle**: Link to files instead of quoting large sections.

❌ **Quoted**:
```markdown
The authentication logic is implemented as follows:

[50 lines of code quoted]

As you can see, the implementation uses NextAuth.js...
```
**Token cost**: ~1,500 tokens

✅ **Referenced**:
```markdown
Authentication implementation: [src/lib/auth.ts:15-65](src/lib/auth.ts#L15-L65)

Uses NextAuth.js with custom JWT strategy.
```
**Token cost**: ~30 tokens

**Token Savings**: 1,470 tokens (98% reduction)

---

## Measurement and Monitoring

### Token Efficiency Metrics

#### 1. Task-Level Metrics

**Track per task**:
- Input tokens consumed
- Output tokens generated
- Tools called (count + type)
- Agent collaborations triggered
- Artifacts created (files written)

**Example**:
```markdown
Task: PHX-665 Instructions Audit
- Input: 12,500 tokens
- Output: 3,200 tokens
- Total: 15,700 tokens
- Tools: Grep (3), Read (5), Edit (7), Write (1)
- Value: 7 fixes, 100% instruction usage increase
- Efficiency: 2,243 tokens/fix
```

#### 2. Agent-Level Metrics

**Track per agent** (quarterly):
- Average tokens/task
- Collaboration routing rate
- Output artifact ratio (artifacts created / tasks completed)
- Reusability rate (how often agent outputs are referenced later)

**Example**:
```markdown
feature-planner (Q1 2026):
- Avg tokens/task: 8,500
- Routing rate: 85% (routes to feature-builder)
- Artifact ratio: 1.0 (1 spec per task)
- Reusability: 95% (specs referenced by other agents)
```

#### 3. System-Level Metrics

**Track across all agents**:
- Total tokens/day, /week, /month
- Token waste (duplicate reads, failed operations)
- Context window utilization (avg % of 200k used)
- Cost per feature delivered

**Target**:
- <50% context window utilization (room for complex tasks)
- <5% token waste (failed/duplicate operations)
- 15-25% reduction vs baseline (naive implementation)

### Metrics Collection Implementation

#### Option 1: Manual Log Analysis (Recommended for audits)

**Source**: Conversation transcripts in `~/.claude/projects/*/` (JSONL format)

**Extract token metrics**:
```bash
#!/bin/bash
# Extract token usage from conversation log

LOG_FILE="~/.claude/projects/-Users-arumm-info-web/SESSION_ID.jsonl"

# Total input/output tokens
jq -r '.usage | "\(.input_tokens) \(.output_tokens)"' "$LOG_FILE" | \
  awk '{input+=$1; output+=$2} END {print "Input:", input, "Output:", output, "Total:", input+output}'

# Tool call counts by type
jq -r 'select(.type=="tool_use") | .name' "$LOG_FILE" | \
  sort | uniq -c | sort -rn

# Average tokens per message
jq -r 'select(.usage) | "\(.usage.input_tokens)"' "$LOG_FILE" | \
  awk '{sum+=$1; count++} END {print "Avg tokens/message:", sum/count}'
```

**Example audit script**:
```bash
#!/bin/bash
# Audit browser automation token efficiency

echo "=== Browser Automation Token Analysis ==="

# Find all Playwright MCP tool uses
grep -o '"name":"mcp__playwright__[^"]*"' "$LOG_FILE" | \
  cut -d'"' -f4 | sort | uniq -c | sort -rn

# Measure simple task token usage (navigate + screenshot)
jq -r 'select(.type=="tool_use" and (.name | startswith("mcp__playwright__browser_navigate"))) |
       .input.command' "$LOG_FILE" | wc -l

# Calculate efficiency: operations per task
total_operations=$(jq 'select(.type=="tool_use") | 1' "$LOG_FILE" | wc -l)
total_tasks=$(grep -c "Task complete" "$LOG_FILE" || echo "1")
echo "Avg operations/task: $(($total_operations / $total_tasks))"
```

#### Option 2: Lightweight Logging (Recommended for tracking)

**Create minimal tracking log** (see [MINIMAL_LOGGING.md](MINIMAL_LOGGING.md)):

```markdown
# .claude/logs/token_metrics_Q1_2026.md

## 2026-01-09

### PHX-665: Instructions Audit
- Input: 12,500 tokens
- Output: 3,200 tokens
- Tools: Grep (3), Read (5), Edit (7), Write (1)
- Efficiency: 2,243 tokens/fix (7 fixes)

### PHX-660: Browser Automation Optimization
- Input: 8,000 tokens
- Output: 2,500 tokens
- Tools: Read (6), Edit (3)
- Efficiency: 3,500 tokens/fix (3 fixes)

## Weekly Summary (Jan 6-12, 2026)
- Total tasks: 12
- Avg tokens/task: 10,250
- Target: <12,000 (✅ below target)
- Token waste: 3% (failed reads)
```

**Automation with hooks**:
```bash
# .claude/hooks/post_task_complete.sh
# Auto-log token metrics after task completion

#!/bin/bash

TASK_ID="$1"
TOKENS_INPUT="$2"
TOKENS_OUTPUT="$3"

echo "## Task: $TASK_ID" >> .claude/logs/token_metrics_Q1_2026.md
echo "- Input: $TOKENS_INPUT tokens" >> .claude/logs/token_metrics_Q1_2026.md
echo "- Output: $TOKENS_OUTPUT tokens" >> .claude/logs/token_metrics_Q1_2026.md
echo "- Total: $((TOKENS_INPUT + TOKENS_OUTPUT)) tokens" >> .claude/logs/token_metrics_Q1_2026.md
echo "" >> .claude/logs/token_metrics_Q1_2026.md
```

#### Option 3: Dashboard Tracking (Optional, advanced)

**Create simple spreadsheet tracker**:

| Date | Task | Input | Output | Total | Tools | Efficiency | Notes |
|------|------|-------|--------|-------|-------|------------|-------|
| 2026-01-09 | PHX-665 | 12,500 | 3,200 | 15,700 | 16 | 2,243/fix | Used Explore agent |
| 2026-01-09 | PHX-660 | 8,000 | 2,500 | 10,500 | 9 | 3,500/fix | Browser automation |

**Calculate trends**:
- Week-over-week token reduction
- Most expensive task types
- Tool efficiency ratios
- Agent-specific metrics

#### Practical Collection Workflow

**For each significant task**:
1. Note tokens from Claude Code UI (displayed after completion)
2. Count tool calls (visible in conversation)
3. Measure value (fixes applied, features delivered)
4. Log to `token_metrics_*.md` (lightweight format)

**Quarterly analysis**:
1. Run audit script on conversation logs
2. Aggregate weekly summaries
3. Calculate metrics vs targets
4. Identify inefficiencies and optimization opportunities
5. Document findings in `.claude/logs/token_audit_*.md`

**No collection needed**:
- Simple tasks (<5 tool calls, obvious success)
- Tasks below 5,000 total tokens
- Routine operations without learning value

---

## Token Efficiency Checklist

### Before Every Task

- [ ] Can I use Explore agent instead of direct Grep/Read?
- [ ] Can I use parallel tool calls to reduce round-trips?
- [ ] Can I use `head_limit` to bound results?
- [ ] Do I need `output_mode="content"` or is `files_with_matches` enough?
- [ ] Should I log this task or skip logging?

### After Every Task

- [ ] Did I read any files I didn't use?
- [ ] Did I generate redundant explanations?
- [ ] Could I have used structured data instead of prose?
- [ ] Did I create artifacts that won't be referenced later?

### During Agent Development

- [ ] Does this agent have single responsibility? (SOLID)
- [ ] Does this agent route instead of expanding scope?
- [ ] Does this agent use NFR triggers (not hardcoded features)?
- [ ] Does this agent expose minimal interface?
- [ ] Does this agent depend on abstractions (not concretions)?

### During Quarterly Audits

- [ ] Are there duplicate/contradictory guidelines?
- [ ] Are all templates being used (>20% compliance)?
- [ ] Are all cross-references valid?
- [ ] Are there phantom agent references?
- [ ] Can any verbose guidelines be condensed?

---

## Real-World Token Savings (PHX-667 Audit)

### TIER 2 Audit Results

| Audit | Token Waste Found | Fixes Applied | Savings |
|-------|------------------|---------------|---------|
| PHX-663 (Guidelines) | 10,000-25,000/task | Deleted SIMPLE_LOGGING.md | 98% |
| PHX-664 (Templates) | 4,000 total | Deleted 2 unused templates | 100% |
| PHX-665 (Instructions) | 8,000 (80% unused) | Added agent references | 5x usage |

**Total Impact**:
- **Per-task savings**: 9,950-24,800 tokens/task (SIMPLE_LOGGING removal)
- **One-time savings**: 4,000 tokens (template cleanup)
- **Utilization improvement**: 20% → 100% instruction usage

**Projected Annual Savings**:
- Assumptions: 500 tasks/year, 50/50 simple/complex
- Before: (250 tasks × 25,000) + (250 tasks × 50,000) = 18.75M tokens
- After: (250 tasks × 200) + (250 tasks × 10,000) = 2.55M tokens
- **Savings**: 16.2M tokens/year = 86% reduction
- **Cost savings**: ~$350/year at current API pricing

---

## Anti-Patterns

### 1. Premature Documentation

❌ **Creating docs "just in case"**:
```markdown
Let me create a comprehensive architecture document for this simple bug fix...
```

✅ **Document when valuable**:
```markdown
Bug fix complete. No documentation needed (user sees fix directly).
```

### 2. Defensive Reading

❌ **Reading everything before acting**:
```markdown
Let me read all 20 related files to fully understand the codebase before making this one-line change...
```

✅ **Read incrementally**:
```markdown
Read target file → Make change → Grep for dependencies → Validate
```

### 3. Verbose Status Updates

❌ **Play-by-play narration**:
```markdown
Now I'm going to click on the button. The button has been clicked. I can see that the dialog has opened. Now I'm going to take a screenshot of the dialog that just opened...
```

✅ **Action-oriented**:
```markdown
Opening dialog and capturing screenshot.
```

### 4. Redundant Validation

❌ **Over-validation**:
```markdown
Let me read the file again to make sure my edit was applied correctly...
```

✅ **Trust tool results**:
```markdown
Edit tool returned success → Edit confirmed
```

### 5. Scope Creep

❌ **Expanding beyond request**:
```markdown
While fixing this bug, I noticed the code could be refactored. Let me also add type safety, write tests, update documentation...
```

✅ **Stay focused**:
```markdown
Bug fixed. Refactoring out of scope (user didn't request it).
```

---

## References

- [MINIMAL_LOGGING.md](MINIMAL_LOGGING.md) - When to skip logging (default)
- [SOLID_FOR_AGENTS.md](SOLID_FOR_AGENTS.md) - Single responsibility reduces token waste
- [VALIDATION_PATTERNS.md](VALIDATION_PATTERNS.md) - Risk-based validation (not all tasks need Codex)
- [nfr-matrix.md](../context/nfr-matrix.md) - Abstract routing triggers (avoid feature-specific code)
- [anti-patterns.md](../context/anti-patterns.md) - What NOT to do

---

## Meta

**Created**: 2026-01-09
**Last Updated**: 2026-01-09
**Target**: 15-25% token reduction
**Measured Impact**: 86% reduction in TIER 2 audit scenarios
**Related Guidelines**: MINIMAL_LOGGING.md, SOLID_FOR_AGENTS.md, VALIDATION_PATTERNS.md
