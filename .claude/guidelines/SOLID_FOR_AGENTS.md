# SOLID Principles for Agent Design

**Purpose**: Apply SOLID object-oriented design principles to autonomous agent architecture for maintainability, extensibility, and scalability.

**Status**: Active (2026-01-09)

---

## Overview

Traditional SOLID principles (Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) apply to agent design with agentic-specific adaptations:

- **Agents are classes**: Each agent is a conceptual class with responsibilities, interfaces, and dependencies
- **NFRs are abstractions**: Non-Functional Requirements serve as dependency injection points
- **Routing is polymorphism**: Agent collaboration uses polymorphic routing based on objective triggers

---

## S - Single Responsibility Principle

**Principle**: An agent should have one, and only one, reason to change.

### Application to Agents

Each agent owns **exactly one domain of expertise**:

✅ **Good Examples**:
- `security-expert`: Security analysis, threat modeling, authentication/authorization review
- `db-expert`: Database schema, queries, migrations, performance optimization
- `e2e-test-specialist`: End-to-end testing, Playwright automation, visual testing

❌ **Anti-patterns**:
- `full-stack-expert`: "Handles frontend, backend, database, security, testing" (too broad)
- `bug-fixer`: "Fixes any bug in any domain" (undefined scope)

### Implementation Guidelines

1. **Define clear boundaries** in agent mission statement:
   ```markdown
   ## Mission
   **Domain**: [Single clear domain]
   **Responsibility**: [One sentence describing what this agent does]
   **Out of Scope**: [What this agent does NOT do]
   ```

2. **Use routing for cross-domain concerns**:
   - Don't expand agent scope → Route to specialized agent
   - Example: `frontend-developer` encounters auth bug → Route to `security-expert`

3. **Validate SRP compliance**:
   - Can you describe the agent's job in one sentence?
   - Does the agent have multiple unrelated skills?
   - Would two different types of changes require modifying this agent?

### Real Example

**Before** (SRP violation):
```markdown
# full-stack-developer
- Builds frontend components
- Writes backend APIs
- Designs database schema
- Writes E2E tests
- Reviews security
```

**After** (SRP compliant):
```markdown
# frontend-developer
- Builds React components
- Implements client-side state
- Integrates with tRPC APIs
- Routes to @db-expert for schema
- Routes to @e2e-test-specialist for testing
- Routes to @security-expert for auth
```

---

## O - Open-Closed Principle

**Principle**: Agents should be open for extension, closed for modification.

### Application to Agents

Extend agent capabilities through **NFR-based routing** and **tool composition**, not by editing agent instructions.

✅ **Good Examples**:
- Add new security requirement → Update `nfr-matrix.md` triggers, agent instructions unchanged
- New validation tier → Update `VALIDATION_PATTERNS.md`, agent routing unchanged
- New tool available → Agent uses it via existing tool interface

❌ **Anti-patterns**:
- Editing agent to add "special case" for specific feature
- Hardcoding feature names or project-specific logic in agent
- Modifying agent every time a new requirement appears

### Implementation Guidelines

1. **Use NFR triggers for extensibility**:
   ```markdown
   ## When to Route to @architect
   - System-wide scope (>5 files)
   - Performance critical (>1000 req/s)
   - Multi-tenant isolation changes
   - Data model affects >3 entities
   ```
   *Adding new trigger doesn't modify agent logic*

2. **Tool composition over agent modification**:
   - Agent uses `Read`, `Grep`, `Edit` tools
   - New tool added (e.g., `Refactor`) → Agent automatically gains capability
   - No agent instruction changes needed

3. **Configuration over code**:
   - Store thresholds in `architecture-context.md` and `nfr-matrix.md`
   - Agents reference these files, don't hardcode values

### Real Example

**Before** (OCP violation):
```markdown
# security-expert
Route to validation when:
- User authentication changes
- Billing payment processing  # Hardcoded feature
- Resident data access  # Hardcoded feature
```

**After** (OCP compliant):
```markdown
# security-expert
Route to validation when:
- PHI/PII data access (see nfr-matrix.md)
- Authentication/authorization changes (see nfr-matrix.md)
- External API integration (see nfr-matrix.md)
```

---

## L - Liskov Substitution Principle

**Principle**: Agents should be substitutable within their domain without breaking the workflow.

### Application to Agents

Any agent within a **domain family** should be substitutable without changing upstream agent behavior.

✅ **Good Examples**:
- `e2e-test-specialist` and `unit-test-specialist` both fulfill "testing agent" contract
- `postgres-expert` and `mysql-expert` both fulfill "database agent" contract
- Both agents accept same routing triggers, produce same output format

❌ **Anti-patterns**:
- Agent requires special input format that other domain agents don't support
- Agent produces output incompatible with downstream agents
- Swapping agents breaks the workflow

### Implementation Guidelines

1. **Define domain contracts**:
   ```markdown
   ## Testing Agent Contract
   **Input**: Spec file path, code file paths
   **Output**: Test file path(s), coverage report, validation status
   **Routing triggers**: Test coverage <80%, E2E tests missing, critical user flows
   ```

2. **Standardize output formats**:
   - All test agents produce test files in `/tests/` directory
   - All validation agents produce validation reports in `.claude/logs/`
   - All architectural agents produce ADRs in `/docs/adr/`

3. **Use polymorphic routing**:
   ```markdown
   Route to testing agent when coverage <80%:
   - @e2e-test-specialist for user flow testing
   - @unit-test-specialist for logic testing
   - @integration-test-specialist for API testing
   ```

### Real Example

**Before** (LSP violation):
```markdown
# e2e-test-specialist
Produces: HTML test report in /reports/e2e/

# unit-test-specialist
Produces: JSON coverage in /coverage.json

# integration-test-specialist
Produces: Markdown report in /docs/tests.md
```
*Incompatible outputs, not substitutable*

**After** (LSP compliant):
```markdown
# All testing agents
**Input**: Spec file path, code file paths
**Output**:
- Test files in /tests/[domain]/
- Coverage report in .claude/logs/[task-id]_coverage.md
- Validation status: PASS/FAIL
```

---

## I - Interface Segregation Principle

**Principle**: Agents should not depend on interfaces they don't use.

### Application to Agents

Agents should expose **minimal, focused interfaces** and consume only what they need from other agents.

✅ **Good Examples**:
- `frontend-developer` requests only "API endpoint contract" from `backend-developer`
- `security-expert` provides only "security approval status" to `feature-builder`
- Agents don't force dependencies to produce unused artifacts

❌ **Anti-patterns**:
- Agent requires full 10-page architecture doc when only need API endpoint
- Agent produces 5 artifacts but downstream agent uses only 1
- Agent depends on entire context when only need specific section

### Implementation Guidelines

1. **Minimal output contracts**:
   ```markdown
   ## What @security-expert Provides
   **To feature-builder**: ✅/❌ Security approval + critical issues list
   **To architect**: Threat model summary (not full security audit)
   **To db-expert**: Data classification (PHI/PII/public)
   ```

2. **Focused input requirements**:
   ```markdown
   ## What @frontend-developer Needs
   From @backend-developer: tRPC procedure signatures, input/output types
   ❌ Does NOT need: Implementation details, database queries, business logic
   ```

3. **Avoid fat interfaces**:
   - Don't force all agents to produce ADRs (only architect)
   - Don't force all agents to run Codex validation (only per risk matrix)
   - Don't force all agents to create visual tests (only UI agents with Figma)

### Real Example

**Before** (ISP violation):
```markdown
# backend-developer → frontend-developer
Provides:
- Full API implementation code (500 lines)
- Database schema (not needed by frontend)
- Business logic documentation (not needed)
- tRPC types (needed)
- Authentication middleware (not needed)
```

**After** (ISP compliant):
```markdown
# backend-developer → frontend-developer
Provides:
- tRPC procedure signatures
- Input validation schemas (Zod types)
- Output type definitions
- Error codes and messages

Location: Auto-generated via tRPC type inference
```

---

## D - Dependency Inversion Principle

**Principle**: Agents should depend on abstractions, not concretions.

### Application to Agents

Agents depend on **NFR triggers** (abstractions) rather than hardcoded feature names or specific implementations.

✅ **Good Examples**:
- Agent routes based on "PHI/PII data access" (abstraction) not "billing feature" (concrete)
- Agent validates when "performance critical >1000 req/s" (abstraction) not "scheduler endpoint" (concrete)
- Agent collaborates via "testing agent" interface (abstraction) not "e2e-test-specialist" (concrete)

❌ **Anti-patterns**:
- "Route to security-expert for payment processing" (concrete feature)
- "Use Playwright for scheduler UI testing" (concrete tool)
- "Validate with Codex-high if feature is authentication" (concrete feature)

### Implementation Guidelines

1. **Abstract routing triggers** (nfr-matrix.md):
   ```markdown
   ## Security Routing (Abstraction)
   Route to @security-expert when:
   - PHI/PII data access
   - Authentication/authorization changes
   - External API integration
   - Cryptographic operations

   ❌ NOT:
   - Route for "login feature"
   - Route for "billing system"
   ```

2. **Abstract validation criteria** (VALIDATION_PATTERNS.md):
   ```markdown
   ## Critical Risk (Abstraction)
   Codex validation required when:
   - Security impact: PHI/PII exposure risk
   - Scale impact: >1000 req/s, >100k records
   - Multi-tenant impact: Cross-tenant data leakage risk

   ❌ NOT:
   - "Validate authentication feature"
   - "Validate resident dashboard"
   ```

3. **Abstract tool selection**:
   ```markdown
   Use visual testing when:
   - UI component with Figma design exists
   - Visual regression risk identified

   ❌ NOT:
   - "Use Playwright for scheduler"
   - "Use Chrome DevTools for settings dialog"
   ```

### Real Example

**Before** (DIP violation):
```markdown
# feature-builder
Route to @security-expert for these features:
- Login system
- User registration
- Password reset
- Billing payment
- Resident data display
```
*Depends on concrete feature names, breaks when new features added*

**After** (DIP compliant):
```markdown
# feature-builder
Route to @security-expert when:
- Authentication/authorization logic changes
- PHI/PII data access (see architecture-context.md)
- External payment API integration
- Cryptographic operations
```
*Depends on abstract security characteristics, extensible*

---

## SOLID Compliance Checklist

### When Creating New Agent

- [ ] **SRP**: Agent has single, well-defined domain in mission statement?
- [ ] **SRP**: "Out of Scope" section prevents scope creep?
- [ ] **OCP**: Agent uses NFR triggers from nfr-matrix.md (not hardcoded)?
- [ ] **OCP**: Agent routing is configuration-driven?
- [ ] **LSP**: Agent output format matches domain contract?
- [ ] **LSP**: Agent is substitutable with other agents in same domain?
- [ ] **ISP**: Agent exposes minimal interface (only what downstream needs)?
- [ ] **ISP**: Agent requests minimal input (only what it needs)?
- [ ] **DIP**: Agent depends on abstract triggers (not concrete features)?
- [ ] **DIP**: Agent collaborates via domain abstractions (not specific agents)?

### When Modifying Existing Agent

- [ ] **OCP**: Did you add NFR trigger instead of hardcoding logic?
- [ ] **SRP**: Does change stay within agent's single responsibility?
- [ ] **ISP**: Did you avoid adding bloated output/input requirements?
- [ ] **DIP**: Did you use abstractions from architecture-context.md/nfr-matrix.md?

### When Adding Agent Collaboration

- [ ] **LSP**: Do both agents follow same domain contract?
- [ ] **ISP**: Is interface between agents minimal?
- [ ] **DIP**: Is collaboration trigger abstract (not feature-specific)?

---

## Anti-Pattern Examples

### 1. God Agent (SRP + ISP violation)

```markdown
# master-developer
Handles:
- Frontend React components
- Backend tRPC procedures
- Database migrations
- Security reviews
- E2E testing
- Performance optimization
- Architecture decisions
```

**Fix**: Split into focused agents (frontend-developer, backend-developer, db-expert, security-expert, etc.)

### 2. Hardcoded Features (OCP + DIP violation)

```markdown
Route to @security-expert for:
- Login feature
- Registration feature
- Billing feature
- Admin panel feature
```

**Fix**: Use abstract NFR triggers:
```markdown
Route to @security-expert when:
- Authentication/authorization changes
- PHI/PII data access
- External API integration
```

### 3. Inconsistent Output (LSP violation)

```markdown
# e2e-test-specialist → Creates /tests/e2e/*.spec.ts
# unit-test-specialist → Creates /src/**/*.test.ts
# integration-test-specialist → Creates /api-tests/*.test.js
```

**Fix**: Standardize all test agents to domain-specific directories with consistent naming

### 4. Fat Interface (ISP violation)

```markdown
All agents must produce:
- Full implementation
- ADR document
- Test coverage report
- Performance benchmark
- Security audit
- Visual test screenshots
```

**Fix**: Each agent produces only what its domain requires

### 5. Tight Coupling (DIP violation)

```markdown
# feature-builder
When implementing authentication:
1. Call @security-expert
2. Use NextAuth.js library
3. Create /app/api/auth/[...nextauth]/route.ts
4. Validate with Codex-high
```

**Fix**: Depend on abstractions:
```markdown
When implementing authentication changes:
1. Route to @security-expert (NFR: auth changes)
2. Follow security requirements from security-expert
3. Validate per risk matrix (Critical tier)
```

---

## Migrating Non-SOLID Agents

**When to use this guide**: Refactoring existing agents that violate SOLID principles.

### Step 1: Identify SOLID Violations

**Run SOLID audit on existing agent**:

| Check | Question | Tool |
|-------|----------|------|
| **SRP** | Can I describe this agent in one sentence? | Read agent mission |
| **SRP** | Does agent have >3 unrelated responsibilities? | Count distinct domains |
| **OCP** | Does agent hardcode feature names? | Grep for specific features |
| **LSP** | Is output format unique to this agent? | Compare with domain peers |
| **ISP** | Does agent produce unused artifacts? | Check downstream usage |
| **DIP** | Does agent use concrete triggers? | Grep for hardcoded conditions |

**Example audit**:
```bash
# Check for hardcoded features (DIP violation)
grep -E "login|billing|resident|admin" .claude/agents/full-stack-developer.md

# Check for multiple responsibilities (SRP violation)
grep -E "frontend|backend|database|security|testing" .claude/agents/full-stack-developer.md

# Count distinct tool categories (ISP indicator)
grep -E "Read|Write|Bash|mcp__" .claude/agents/full-stack-developer.md | wc -l
```

### Step 2: Apply Refactoring Strategy

#### SRP Refactoring: Split God Agent

**Before**:
```markdown
# full-stack-developer.md
## Mission
Build complete features from database to UI

## Responsibilities
- Design database schema
- Write tRPC procedures
- Create React components
- Write E2E tests
- Review security
```

**Refactoring steps**:
1. Identify distinct domains: Database, Backend API, Frontend UI, Testing, Security
2. Create specialized agents for each domain
3. Define routing triggers between agents
4. Migrate relevant instructions to each agent

**After**:
```markdown
# frontend-developer.md
## Mission
Build React components and client-side features

## Responsibilities
- Create React components using shadcn/ui
- Implement tRPC client queries/mutations
- Handle client-side state
- Route to @backend-developer for API contracts
- Route to @e2e-test-specialist for testing

# backend-developer.md
## Mission
Build tRPC API procedures and business logic

## Responsibilities
- Define tRPC routers and procedures
- Implement business logic
- Route to @db-expert for schema changes
- Route to @security-expert for auth/PHI changes

# db-expert.md
## Mission
Design database schema and optimize queries

## Responsibilities
- Design Drizzle schema
- Write migrations
- Optimize queries
- Route to @security-expert for data classification
```

#### OCP Refactoring: Replace Hardcoded Features with NFR Triggers

**Before**:
```markdown
Route to @security-expert for:
- Login feature
- User registration
- Password reset
- Billing payment processing
```

**Refactoring steps**:
1. Extract abstract characteristics from concrete features
2. Map to NFR categories in [nfr-matrix.md](../context/nfr-matrix.md)
3. Replace hardcoded list with NFR references

**After**:
```markdown
Route to @security-expert when (see nfr-matrix.md):
- Authentication/authorization changes
- PHI/PII data access
- External payment API integration
- Cryptographic operations
```

#### LSP Refactoring: Standardize Output Contracts

**Before**:
```markdown
# e2e-test-specialist
Output: /reports/e2e/test-results.html

# unit-test-specialist
Output: /coverage/coverage.json

# integration-test-specialist
Output: /docs/api-test-report.md
```

**Refactoring steps**:
1. Define domain contract (Testing Agent Contract)
2. Standardize output locations and formats
3. Update all agents in domain to follow contract

**After**:
```markdown
# Testing Agent Contract (all testing agents)
**Input**: Spec file path, code file paths
**Output**:
- Test files: /tests/[domain]/
- Coverage report: .claude/logs/[task-id]_coverage.md
- Status: PASS/FAIL

# e2e-test-specialist (LSP compliant)
**Output**:
- /tests/e2e/*.spec.ts
- .claude/logs/PHX-XXX_coverage.md
- Status: PASS

# unit-test-specialist (LSP compliant)
**Output**:
- /tests/unit/*.test.ts
- .claude/logs/PHX-XXX_coverage.md
- Status: PASS
```

#### ISP Refactoring: Minimize Interfaces

**Before**:
```markdown
# backend-developer → frontend-developer
Provides:
- Full API implementation (500 lines)
- Database schema
- Business logic docs
- tRPC types
- Authentication middleware
```

**Refactoring steps**:
1. Identify what downstream agent actually uses
2. Remove unnecessary artifacts
3. Define minimal interface

**After**:
```markdown
# backend-developer → frontend-developer
Provides:
- tRPC procedure signatures (auto-generated)
- Input validation schemas (Zod types)
- Output type definitions
- Error codes

Location: /src/server/api/routers/*.ts (types auto-inferred)
```

#### DIP Refactoring: Abstract Dependencies

**Before**:
```markdown
# feature-builder
When implementing scheduler feature:
1. Use Drizzle ORM
2. Create shifts table
3. Use tRPC for API
4. Validate with Codex-high
```

**Refactoring steps**:
1. Replace concrete tools with abstract requirements
2. Reference architecture-context.md for tech choices
3. Use NFR triggers for validation decisions

**After**:
```markdown
# feature-builder
When implementing features:
1. Follow architecture-context.md tech stack
2. Route to @db-expert for data modeling
3. Route to @backend-developer for API design
4. Validate per VALIDATION_PATTERNS.md risk matrix
```

### Step 3: Validate Migration

**Post-migration checklist**:

```markdown
## SRP Validation
- [ ] Each agent has single domain in mission statement
- [ ] Agent can be described in one sentence
- [ ] No cross-domain responsibilities remain

## OCP Validation
- [ ] No hardcoded feature names in routing triggers
- [ ] All triggers reference nfr-matrix.md or architecture-context.md
- [ ] Agent can handle new features without modification

## LSP Validation
- [ ] Agent output matches domain contract
- [ ] Agent is substitutable with peers in same domain
- [ ] Swapping agents doesn't break workflow

## ISP Validation
- [ ] Agent produces only what downstream needs
- [ ] No bloated interfaces or unused artifacts
- [ ] Input requirements are minimal

## DIP Validation
- [ ] Agent depends on abstract NFR triggers
- [ ] No concrete feature names or tool hardcoding
- [ ] Collaboration uses domain abstractions
```

### Step 4: Test Migration

**Validation scenarios**:

1. **SRP Test**: Ask agent to perform out-of-scope task
   - Expected: Agent routes to appropriate specialist
   - ❌ Fail: Agent attempts task outside domain

2. **OCP Test**: Add new feature with existing NFR characteristics
   - Expected: Agent handles without modification
   - ❌ Fail: Agent needs editing for new feature

3. **LSP Test**: Swap agent with peer in same domain
   - Expected: Workflow completes successfully
   - ❌ Fail: Output incompatible with downstream

4. **ISP Test**: Check downstream agent uses all artifacts
   - Expected: All outputs consumed
   - ❌ Fail: Unused artifacts produced

5. **DIP Test**: Change concrete implementation (e.g., Drizzle → Prisma)
   - Expected: Agent references architecture-context.md, no changes needed
   - ❌ Fail: Agent instructions hardcode Drizzle

### Real Migration Example

**Scenario**: Migrate `full-stack-developer.md` (God Agent) to SOLID-compliant architecture.

**Before** (1 God Agent):
```markdown
# full-stack-developer.md (600 lines)
Mission: Build complete features end-to-end

Handles:
- Database schema design
- tRPC API implementation
- React component creation
- E2E test writing
- Security review
```

**After** (5 Specialized Agents):
```markdown
# db-expert.md (150 lines)
Mission: Database schema and query optimization
Routes to: @security-expert (data classification)

# backend-developer.md (180 lines)
Mission: tRPC API procedures
Routes to: @db-expert (schema), @security-expert (auth)

# frontend-developer.md (200 lines)
Mission: React components and client state
Routes to: @backend-developer (API), @e2e-test-specialist (testing)

# e2e-test-specialist.md (120 lines)
Mission: End-to-end testing with Playwright
Routes to: @test-analyzer (>3 failures)

# security-expert.md (160 lines)
Mission: Security analysis and threat modeling
Routes to: @architect (system-wide security)
```

**Token efficiency gain**:
- Before: Agent reads 600 lines for every task (regardless of domain)
- After: Agent reads 120-200 lines for domain-specific task
- Savings: 67-80% token reduction per task

**Maintainability gain**:
- Before: 1 agent modified for any change (high conflict risk)
- After: 5 agents modified independently (low conflict risk)
- Benefits: Parallel development, clear ownership, easier debugging

---

## Benefits of SOLID Agents

1. **Maintainability**: Single responsibility makes agents easier to understand and modify
2. **Extensibility**: NFR-based routing enables adding requirements without changing agents
3. **Substitutability**: Domain contracts enable swapping specialized agents
4. **Minimal Coupling**: Interface segregation reduces unnecessary dependencies
5. **Flexibility**: Dependency inversion allows changing concrete implementations
6. **Token Efficiency**: Focused agents consume 67-80% fewer tokens per task
7. **Parallel Development**: Independent agents enable concurrent work without conflicts

---

## References

- [architecture-context.md](../context/architecture-context.md) - Project architecture and NFR thresholds
- [nfr-matrix.md](../context/nfr-matrix.md) - Abstract routing triggers
- [agent-collaboration-graph.md](../context/agent-collaboration-graph.md) - Agent interaction patterns
- [VALIDATION_PATTERNS.md](../guidelines/VALIDATION_PATTERNS.md) - Risk-based validation abstractions
- [anti-patterns.md](../context/anti-patterns.md) - What NOT to do

---

## Meta

**Created**: 2026-01-09
**Last Updated**: 2026-01-09
**Related Guidelines**: VALIDATION_PATTERNS.md, MINIMAL_LOGGING.md, TOKEN_EFFICIENCY.md
**Related Context**: architecture-context.md, nfr-matrix.md, anti-patterns.md
