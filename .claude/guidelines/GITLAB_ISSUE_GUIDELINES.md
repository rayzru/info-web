# GitLab Issue Guidelines

**Purpose**: Guidelines for creating epics, tasks/features, and bug reports in the `intrigma/fenix/fx-issues` GitLab project.

**Version**: 2.3
**Last Updated**: 2025-10-22

---

## Scope & References

This document covers **creating** epics, feature/task issues, and bug reports. For:
- **Repository structure, legacy code, general development rules**: See [CLAUDE.md](../../CLAUDE.md)
- **Backend technical requirements (build, tests, architecture)**: See [src/CLAUDE.md](../../src/CLAUDE.md)
- **Frontend technical requirements (Next.js, components, QA)**: See [front-end.iss-free/CLAUDE.md](../../front-end.iss-free/CLAUDE.md)
- **Documentation formatting, Mermaid diagrams**: See [.claude/instructions/MARKDOWN_WORKFLOW.md](../instructions/MARKDOWN_WORKFLOW.md)
- **MCP usage, pagination, GitLab API**: See [MCP_GUIDE.md](../../MCP_GUIDE.md)

**GitLab Projects**:
- **Issues**: `intrigma/fenix/fx-issues` (All issues, epics, bug reports)
- **Code**: `intrigma/fenix/fx-backend` (Monorepo with backend + frontend)

**Project URLs**:
- Issues: https://gitlab.com/intrigma/fenix/fx-issues/-/issues/
- Epics: https://gitlab.com/groups/intrigma/fenix/-/epics/

---

## Table of Contents

1. [Scope & References](#scope--references)
2. [Creating an Epic](#creating-an-epic)
3. [Creating a Feature/Task](#creating-a-featuretask)
4. [Creating a Bug Report](#creating-a-bug-report)
5. [Attachments & Cross-Linking](#attachments--cross-linking)
6. [Pattern Library](#pattern-library)

---

## Creating an Epic

### What is an Epic?

An **epic** is a container for grouping multiple related issues. Epics represent large features or initiatives spanning multiple screens, components, or architectural layers. **Epics are not user stories** - they organize and track related work.

### Epic Naming

**Format**: `[Feature Name]`

**Examples**: `Employee Management System`, `Shift Planning Wizard`, `Calendar View Redesign`

**Labels**: Epics typically don't need `backend`/`frontend` labels as they contain mixed work.

### Epic Template

```markdown
# [Feature Name]

## Overview

[Brief summary explaining the feature scope and business value]

- **Basis**: [Source requirements, e.g., #XXX]
- **Related tasks**: [Dependencies]

---

## Task Decomposition

### UI Components
- UI Component: [Component Name]
  - Description: [Brief description]
  - Depends on: [Dependencies]

### Backend Infrastructure
- [Infrastructure Name]
  - Description: [Brief description]
  - Depends on: [Dependencies]

### Screens
- [Screen Name] (Frontend)
- [API Endpoint] (Backend)

### Integration
- [Testing/QA work]

---

## References

- GitLab: #XXX
- Figma: [Design link]
```

### Epic Checklist

- [ ] Clear title: `[Feature Name]`
- [ ] Overview with basis, related tasks
- [ ] Task decomposition showing all related issues
- [ ] External references (GitLab issues, Figma links)

**Important**:
- Epics do NOT have acceptance criteria (those belong to individual tasks)
- Epics do NOT need user stories (they are organizational containers)
- Priorities are assigned during planning by the team

---

## Creating a Feature/Task

### Task Naming

**Feature tasks**: `[Component/Area] | [Action] | [Subaction]`
- Examples: `Settings | Shift Types | Create`, `Calendar View | Mismatch with designs`

**Component tasks**: `[Component Name] Component ([Type])`
- Examples: `TextField Component (Refactor)`, `Wizard Header Stepper (New)`

**Labels**: Add `backend` and/or `frontend` as applicable

### Task Template

```markdown
# [Component/Area] | [Action] | [Subaction]

As a _Role_, I want to _action_, so that _benefit_.

---

## Overview

[Brief description - 1-2 paragraphs]

---

## Acceptance Criteria

**Scenario 1: [Name]**
- **Given** _context_, **When** _action_, **Then** _outcome_
- **And** _additional outcome_

**Scenario 2: [Error case]**
- **Given** _error condition_, **When** _action_, **Then** _error message_

---

## Validation Criteria

- Field Name 1: type, required/optional, constraints (e.g., 1-72 symbols)
- Field Name 2: type, required/optional, pattern details

---

## Backend Notes

**GraphQL Contract** (if applicable):

```graphql
# Query example
query getItems {
   ...Item
   relatedField {
      id
   }
}

# Mutation example
mutation createItem(name: String!, description: String) {
   ...Item
}
```

**Additional considerations**:
- [API limits, special handling, etc.]

---

## Frontend Notes

**UI/UX considerations**:
- [Masking, formatting, special behaviors]

---

## Dependencies

**Blocks**: #XXX - [Issue depending on this]
**Depends On**: #YYY - [Issue this depends on]

---

## Components Used

- [Component Name] (#issue) - [Purpose]

---

## References

- Root Issue: #XXX
- Figma: [Design link]
```

### Task Checklist

- [ ] Clear title following naming convention
- [ ] User story (As a / I want / So that)
- [ ] Acceptance criteria (Given/When/Then, multiple scenarios)
- [ ] Validation criteria (if applicable)
- [ ] Backend Notes with GraphQL contract (if backend work required)
- [ ] Frontend Notes with UI/UX considerations (if frontend work required)
- [ ] Dependencies (blocks/depends on)
- [ ] Components used (with issue references)
- [ ] Root Issue reference (parent epic or main feature)
- [ ] Figma reference (if design exists)
- [ ] Label: `backend` and/or `frontend` (as applicable)

**Important**:
- Priorities are assigned during planning by the team
- Include multiple scenarios (happy path AND error cases)
- See [Pattern Library](#pattern-library) for examples

---

## Creating a Bug Report

### Bug Naming

**Standard bugs**: `[Component/Area] | [Symptom]`
- Examples: `Calendar View | Weekday label text differs from design`, `ShiftTypes | No data displayed`

**Labels**:
- Always add `bug-report`, plus `backend` and/or `frontend` as applicable
- Add `~reopen` if bug reappeared after previous fix (requires "Reopened From" link)

### Bug Report Template

```markdown
# [Component/Area] | [Symptom]

---

## Description

[Clear, concise description - 1-2 paragraphs]

---

## Expected Behavior

- [What should happen]

---

## Actual Behavior

- [What actually happens]

---

## Steps to Reproduce

1. [First step]
2. [Second step]
3. [Observe result]

---

## Environment

- **Browser**: [Chrome 120 / Firefox 115 / Safari 17]
- **OS**: [Windows 11 / macOS / Ubuntu]
- **Device**: [Desktop / Mobile / Tablet]

---

## Evidence

![Screenshot](/uploads/xxxxx/image.png)

---

## Design Reference

[Figma link]

---

## Error Messages

```
Error message or stack trace
```

---

## Related Issues

**Original Feature**: #XXX (required - the feature this bug relates to)

**Reopened From**: #YYY (if this bug was introduced after fixing a previous bug)

**Other Relations**:
- Relates to: #ZZZ
- Blocks: #AAA

**Label Rules**:
- If **Original Feature** is provided → Link it in "Original Feature"
- If **Reopened From** is provided → Link it in "Reopened From" AND assign `~reopen` label
```

### Bug Report Checklist

- [ ] Clear, descriptive title following naming convention
- [ ] Description (1-2 paragraphs)
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Steps to reproduce (numbered, clear)
- [ ] Environment (browser, OS, device)
- [ ] Screenshots or videos
- [ ] Design reference (Figma, if applicable)
- [ ] Error messages/logs (if applicable)
- [ ] Label: `bug-report`
- [ ] Label: `backend` and/or `frontend` (as applicable)
- [ ] **Related Issues**: Link to original feature ticket (required)
- [ ] **Related Issues**: Link to previous bug (if reopen case) AND assign `~reopen` label

**Important**:
- **Original Feature link is MANDATORY** - every bug must reference the feature it affects
- **Reopened bugs MUST have `~reopen` label** - if linking to a previous bug fix
- Priorities and severity are assigned during triage by the team
- Visual evidence is critical for UI bugs
- Reproduction steps must be clear enough for others to reproduce

---

## Attachments & Cross-Linking

### Required Links

- **Epics**: Link to related tasks
- **Tasks**: Link to parent epic (Root Issue), related issues, components used
- **Bug Reports**: Link to Original Feature (required), and Reopened From (if applicable)

### Figma References

- Include direct links to screens/components in Figma
- Use side-by-side comparisons for design mismatches

### Merge Request References

- Link MRs to issues in both directions
- Add MR link to issue description or comments

---

## Pattern Library

### Epic Example

**Complete epic structure**:
```markdown
# Employee Management System

## Overview

A comprehensive system for managing employee records, including personal information, contract details, and organizational assignments. This epic covers all screens and backend infrastructure needed for full CRUD operations.

- **Basis**: Business requirements document, legacy ISS migration #145
- **Related tasks**: Calendar integration (#234), Shift Planning (#256)

---

## Task Decomposition

### UI Components
- UI Component: Employee Card
  - Description: Reusable card displaying employee summary information
  - Depends on: Avatar component (#89)

- UI Component: Employee Form
  - Description: Multi-step form for employee creation/editing
  - Depends on: Wizard component (#67), FormValidator (#145)

### Backend Infrastructure
- Employee API Endpoints
  - Description: GraphQL queries/mutations for employee CRUD operations
  - Depends on: Database schema migration (#178)

- Employee Data Validation
  - Description: Server-side validation rules for employee data
  - Depends on: Validation framework (#156)

### Screens
- Employee List Screen (Frontend) - #201
- Employee Details Screen (Frontend) - #202
- Employee Create/Edit Wizard (Frontend) - #203
- Employee API (Backend) - #204

### Integration
- E2E Testing (#205)
- Documentation (#206)

---

## References

- GitLab Epic: &123
- Figma: https://figma.com/design/employee-management
- Business Requirements: #145
```

**Tips for Epics**:
- Break down by layers: UI components → Backend → Screens → Integration
- Link ALL related tasks with issue numbers
- Include dependencies between tasks
- Reference external design/requirements documents
- No acceptance criteria (those belong in individual tasks)

### Acceptance Criteria (Given/When/Then)

Always include multiple scenarios covering happy path and error cases.

**Example - Successful case**:
```markdown
**Scenario: Successful Login**
- **Given** I am on the login page with valid credentials,
  **When** I click "Sign In",
  **Then** I am redirected to the dashboard
- **And** I see a welcome message with my name
```

**Example - Error case**:
```markdown
**Scenario: Invalid Email**
- **Given** I am on the registration page,
  **When** I enter an invalid email (e.g., "notanemail"),
  **Then** I see error "Invalid email format"
- **And** the Continue button remains disabled
```

### Validation Criteria

**List format** (simple validations):
```markdown
- Section Name: text, required, up to 72 symbols long
- Email: text, required, 5-128 symbols, follows aaa@bbb.ccc pattern
- Phone Number: E.164 (international), requires + prefix, 11-15 digits
```

**Table format** (complex validations with error messages):
```markdown
| Field | Required | Type | Length | Pattern | Error Message |
|-------|----------|------|--------|---------|---------------|
| Organization Name | Yes | String | 1-100 | Any | "Organization name is required" |
| Email | Yes | String | 5-320 | RFC 5322 | "Invalid email format" |
| Password | Yes | String | 12+ | See #102 | "Password must be at least 12 characters" |
```

### Backend Notes (GraphQL)

**Query only**:
```markdown
## Backend Notes

**GraphQL Contract**:
```graphql
query sections {
    ...Section
    shiftTypes { id }
}
```

**Additional considerations**:
- We provide Sections Limit via Customer Query
```

**Mutation only**:
```markdown
## Backend Notes

**GraphQL Contract**:
```graphql
mutation createSection(name: String!, abbreviation: String) {
   ...Section
   ...SectionPeriods
}
```

**Additional considerations**:
- Validate name uniqueness within customer scope
```

**Query + Mutation**:
```markdown
## Backend Notes

**GraphQL Contract**:
```graphql
query sections {
    ...Section
    shiftTypes { id }
}

mutation createShiftType(sectionId: ID!, name: String!) {
   ...ShiftType
}
```

**Additional considerations**:
- Cache section list after mutation
```

### Frontend Notes

**UI/UX considerations example**:
```markdown
## Frontend Notes

**UI/UX considerations**:
- Phone Number field uses international format masking (E.164)
- Email field validates on blur, shows inline error below field
- Continue button disabled until all required fields valid
- Success message auto-dismisses after 3 seconds
```

### Components Used

**Component references example**:
```markdown
## Components Used

- TextField (#102) - Email and phone number inputs
- Button (#98) - Continue/Cancel actions
- FormValidator (#145) - Client-side validation
- Toast (#167) - Success/error notifications
```

**Tips**:
- Link each component to its creation issue
- Explain HOW the component is used in this context
- Include both UI components and utility components

### Dependencies

```markdown
## Dependencies

**Blocks**:
- #265 - Wizard Employees Screen (needs this API)
- #271 - E2E Testing (needs all features)

**Depends On**:
- #257 - Database Schema (tables must exist first)
- #258 - Email Service (need to send emails)
```

**Tips**:
- **Blocks**: Issues that cannot start until this issue is complete
- **Depends On**: Issues that must be complete before this issue can start
- Always explain WHY the dependency exists

### Bug Report Related Issues

**Example 1: New bug on existing feature**
```markdown
## Related Issues

**Original Feature**: #17 - Day View (closed)

**Other Relations**:
- Relates to: #45 - Calendar Redesign Epic
```
**Label**: `bug-report`, `frontend` (NO `~reopen`)

---

**Example 2: Bug reappeared after previous fix**
```markdown
## Related Issues

**Original Feature**: #17 - Day View (closed)

**Reopened From**: #290 - Day View alignment fix (closed)

**Other Relations**:
- Blocks: #310 - QA regression testing
```
**Labels**: `bug-report`, `frontend`, `~reopen` (MUST have `~reopen`)

---

**Tips**:
- **Original Feature** is ALWAYS required - every bug relates to some feature
- **Reopened From** is used when bug was introduced AFTER fixing a previous bug
- If **Reopened From** is provided → MUST assign `~reopen` label
- Use "closed" status markers for clarity (e.g., `#17 (closed)`)

---

**End of Guidelines**

For questions or updates, contact project maintainers or create an issue in `intrigma/fenix/fx-issues`.
