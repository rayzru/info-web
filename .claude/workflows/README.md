# Workflows Directory

**Last Updated**: 2026-02-15

Standard workflows and operational procedures shared across agents.

---

## Available Workflows

### Documentation Workflows

- **[markdown-workflow.md](markdown-workflow.md)** - Markdown writing + Mermaid diagrams
  - Mermaid validation with MCP
  - Link checking
  - Formatting standards

### Testing Workflows

- **[playwright-mcp.md](playwright-mcp.md)** - Browser automation with Playwright MCP
  - E2E testing patterns
  - Session management
  - Token efficiency

- **[visual-testing.md](visual-testing.md)** - Visual testing protocol
  - Figma comparison
  - Screenshot testing
  - Discrepancy reporting

### Release Workflows

- **[release-workflow.md](release-workflow.md)** - Complete release process
  - Versioning
  - Changelog generation
  - Deployment steps

---

## Workflow vs Guideline

**Workflows** (this directory):
- HOW to perform operations
- Step-by-step procedures
- Tool usage instructions
- Shared across agents

**Guidelines** (../guidelines/):
- WHAT patterns to follow
- Technical standards
- Domain-specific rules
- Code quality rules

---

## Creating New Workflows

Create new workflow when:
1. Multiple agents need same procedure
2. Process is complex (>5 steps)
3. Involves specific tool usage
4. Needs standardization

**Template**:
```markdown
# Workflow Name

**Purpose**: One-line description
**Used by**: Agent1, Agent2
**Prerequisites**: Tools/access needed

## Steps

1. Step 1
2. Step 2
...

## Examples

[Concrete examples]

## Troubleshooting

[Common issues]
```

---

## Navigation

- [← Back to .claude/](../)
- [→ Guidelines](../guidelines/)
- [↑ Project Root](../../)
