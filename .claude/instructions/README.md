# Instructions Directory

This directory contains **centralized operational instructions** that are shared across multiple agents and workflows.

## Purpose

While **guidelines** define WHAT patterns to follow (technical standards), **instructions** define HOW to perform operations that are common across agents (operational procedures).

## Current Instructions

- **SIMPLE_LOGGING.md** - Standardized logging for agent communications using feature-based naming (`[feature-name]_log_YYYYMMDD-HHMMSS.jsonl`)

## Difference from Other Directories

| Directory | Purpose | Example |
|-----------|---------|---------|
| `/agents` | Individual agent definitions | feature-planner.md (builds specs) |
| `/guidelines` | Domain-specific patterns | GRAPHQL_GUIDELINE.MD (GraphQL patterns) |
| `/instructions` | Operational procedures | SIMPLE_LOGGING.md (how to log) |
| `/contexts` | Work area contexts | backend-context.md (backend overview) |

## When to Create New Instructions

Create a new instruction file when:
1. Multiple agents need the same operational procedure
2. You find yourself copying the same process into multiple agent files
3. There's a cross-cutting concern that affects most/all agents
4. You need to standardize an operational aspect (not a technical pattern)


## Usage

Agents should reference relevant instructions rather than duplicating them:

```markdown
## [Relevant Operation] Requirements

This agent follows the centralized [operation] instructions defined in:
`.claude/instructions/[INSTRUCTION_NAME].md`
```

This keeps agent files focused on their specific responsibilities while ensuring consistent operations across all agents.