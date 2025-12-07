# Technical Specification: Project Modernization Plan

## Metadata
**Project:** info-web (T3 Stack Application)
**Created:** 2025-11-07
**Author:** Feature Planner (Adapted)
**Status:** Draft - Awaiting Codex Validation
**Complexity:** High

## Executive Summary

This specification outlines a comprehensive modernization plan for the info-web project, a T3 Stack application that has been upgraded to Next.js 16 and React 19. The project requires:
1. Verification of Next.js 16/React 19 compatibility
2. Comprehensive codebase structure analysis and documentation
3. Adaptation of documentation from a .NET/GraphQL project to T3 Stack
4. Configuration of GitHub Actions deployment pipeline
5. Database initialization and seeding strategy

## Current State Analysis

### Technology Stack (Verified)
```yaml
Frontend Framework:
  NextJS: 16.0.1 (latest, successfully upgraded)
  React: 19.2.0 (latest)
  TypeScript: 5.9.3

Backend Integration:
  tRPC: 11.7.1 (type-safe API)
  TanStack Query: 5.90.7 (data fetching)

Database:
  ORM: Drizzle 0.44.7
  Database: PostgreSQL (via Docker)
  Adapter: DrizzleAdapter for NextAuth

Authentication:
  NextAuth: 5.0.0-beta.25
  Provider: Yandex OAuth (not Discord)

Styling:
  TailwindCSS: 4.1.17 (latest v4)
  Radix UI: Latest versions (primitives)
  Geist Font: 1.5.1

Development Tools:
  Package Manager: NOT npm/yarn (check package-lock presence)
  TypeScript: Strict mode enabled
  ESLint: 9.39.1
  Prettier: 3.6.2
```

### Project Structure (T3 Stack Convention)
```
info-web/
├── src/
│   ├── app/                    # Next.js 15+ App Router
│   │   ├── page.tsx           # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── login/             # Auth pages
│   │   ├── my/                # User area
│   │   │   └── property/      # Property management
│   │   ├── community/         # Community features
│   │   └── api/               # API routes
│   │       ├── auth/[...nextauth]/  # NextAuth endpoint
│   │       └── trpc/[trpc]/        # tRPC endpoint
│   ├── components/            # React components
│   │   ├── ui/               # Radix UI primitives
│   │   └── social-icons/     # Icon components
│   ├── server/               # Backend logic
│   │   ├── api/              # tRPC routers
│   │   │   ├── root.ts       # Main router
│   │   │   └── routers/      # Feature routers
│   │   ├── auth/             # NextAuth config
│   │   │   ├── index.ts
│   │   │   └── config.ts
│   │   └── db/               # Database
│   │       ├── schema.ts     # Main schema export
│   │       ├── schemas/      # Individual schemas
│   │       │   ├── users.ts
│   │       │   ├── buildings.ts
│   │       │   ├── organizations.ts
│   │       │   ├── parkings.ts
│   │       │   └── posts.ts
│   │       └── models/       # Type-safe models
│   ├── trpc/                 # tRPC client
│   │   ├── react.tsx        # React Query integration
│   │   ├── server.ts        # Server-side caller
│   │   └── query-client.ts  # Query client config
│   ├── lib/                  # Utility functions
│   ├── styles/               # Global styles
│   └── env.js                # Environment validation
├── drizzle/                  # Migrations
│   ├── 0000_tense_white_queen.sql  # Initial schema
│   ├── 0001_seed-data.sql          # Seed data
│   └── meta/                        # Migration metadata
├── public/                   # Static assets
├── .claude/                  # AI agent configuration
│   ├── agents/              # Agent definitions
│   ├── contexts/            # Context files
│   ├── guidelines/          # Development guidelines
│   └── instructions/        # Workflow instructions
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
├── docker-compose.yml       # PostgreSQL container
├── drizzle.config.ts        # Drizzle configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Environment template
└── package.json             # Dependencies
```

### Database Schema (Current)
```yaml
Entities:
  users:
    Purpose: NextAuth user accounts
    Relations: accounts, sessions, userRoles, userProfiles

  userRoles:
    Purpose: Role-based access control
    Enum: Root, SuperAdmin, Admin, ApartmentOwner, ApartmentResident, ParkingOwner, ParkingResident, Editor, Moderator, Guest, BuildingChairman, ComplexChairman, ComplexRepresenative, StoreOwner, StoreRepresenative

  userProfiles:
    Purpose: Extended user information
    Fields: firstName, lastName, middleName, displayName, phone, avatar, dateOfBirth, gender

  buildings:
    Purpose: Residential complex buildings
    Relations: entrances, floors, apartments

  organizations:
    Purpose: Community organizations

  parkings:
    Purpose: Parking space management

  posts:
    Purpose: Community posts/announcements

  contacts:
    Purpose: Contact information

Migrations:
  - 0000_tense_white_queen.sql: Initial schema
  - 0001_seed-data.sql: Sample buildings, entrances, floors, apartments
```

### Existing Documentation Issues

**Files from .NET/GraphQL Project** (Need Adaptation):
```yaml
MCP_GUIDE.md:
  Issues:
    - References GitLab MCP (not needed)
    - References CodeRabbit CLI (backend-focused)
    - References Codex High/Medium (OpenAI, may not be available)
    - References Gemini CLI (Google Workspace integration)
    - References Figma MCP (may be useful)
    - References Chrome DevTools MCP (useful for Next.js)
    - References Playwright MCP (useful for Next.js)
    - References Context7 (useful for documentation)
  Needed Actions:
    - Remove GitLab-specific sections
    - Evaluate which MCPs are actually needed
    - Add T3-specific MCPs if available
    - Update examples for Next.js/tRPC

AGENT_LIST.md:
  Issues:
    - Heavy focus on backend/.NET agents
    - References GraphQL architect (not using GraphQL)
    - References .NET specialist (not needed)
    - References backend-specific workflow agents
    - References GitLab integration
  Needed Actions:
    - Remove .NET/GraphQL specific agents
    - Keep universal agents (code-reviewer, debugger, etc.)
    - Add/keep frontend agents (if applicable)
    - Update agent workflows for T3 Stack
    - Remove GitLab-specific workflows

CLAUDE.md:
  Issues:
    - References both /src (backend) and /front-end.iss-free (frontend)
    - Backend instructions for .NET/GraphQL
    - GitLab issue tracking references
    - Multi-repository structure
  Needed Actions:
    - Simplify to single Next.js project structure
    - Remove backend-specific rules
    - Update to reflect T3 Stack patterns
    - Remove GitLab references
    - Add T3-specific development rules

CLAUDE-FRONT.md:
  Issues:
    - References /front-end.iss-free working directory
    - References Fenix backend GraphQL API
    - Apollo Client for GraphQL
    - Bun package manager (current project uses npm/yarn)
    - Storybook requirements
    - References backend API connection
  Needed Actions:
    - Update working directory to root
    - Change GraphQL references to tRPC
    - Verify package manager (check package-lock.json)
    - Remove Storybook if not used
    - Update API integration examples
```

### Deployment Configuration
```yaml
Current Setup (.github/workflows/deploy.yml):
  Build:
    - Installs dependencies with Bun (may need to change)
    - Builds Next.js standalone output
    - Configured environment variables reference wrong project

  Issues:
    - References wrong environment variables (MYSQL instead of PostgreSQL)
    - Environment validation might fail
    - Build configuration may need updates for Next.js 16
    - Database sync strategy not defined

  Required Actions:
    - Update environment variables to match .env.example
    - Update database connection (PostgreSQL, not MySQL)
    - Add database migration step
    - Configure proper secrets in GitHub
    - Test deployment process
```

## Requirements

### Primary Objectives

**OBJ-1: Next.js 16 & React 19 Compatibility**
- Verify all packages work with Next.js 16
- Check for breaking changes in dependencies
- Ensure build completes successfully
- Test development server
- Validate production build

**OBJ-2: Project Documentation**
- Create comprehensive architecture documentation
- Document T3 Stack patterns used
- Update all AI agent instructions
- Create developer onboarding guide

**OBJ-3: CI/CD Pipeline**
- Configure GitHub Actions for deployment
- Set up environment variables
- Implement database migration strategy
- Configure production secrets

**OBJ-4: Database Management**
- Implement database initialization strategy
- Configure seeding for fresh installations
- Document migration workflow
- Set up backup/restore procedures

### Functional Requirements

**FR-1: Compatibility Verification**
```yaml
Action: Run comprehensive compatibility checks
Steps:
  1. Execute TypeScript compiler (tsc --noEmit)
  2. Run ESLint checks
  3. Execute build process (next build)
  4. Test development server
  5. Check for deprecated API usage
  6. Verify all npm scripts work
Success Criteria:
  - Zero TypeScript errors
  - Zero ESLint errors
  - Successful production build
  - All scripts execute without errors
```

**FR-2: Documentation Adaptation**
```yaml
Action: Update all documentation for T3 Stack
Components:
  - CLAUDE.md: Main development guidelines
  - MCP_GUIDE.md: MCP server configuration
  - AGENT_LIST.md: AI agent definitions
  - README.md: Project overview (create if missing)

Adaptation Rules:
  - Remove all .NET/C#/GraphQL references
  - Update to Next.js/tRPC/Drizzle patterns
  - Keep universal best practices
  - Add T3-specific patterns
  - Update examples to match current stack
```

**FR-3: Deployment Pipeline**
```yaml
Action: Configure working CI/CD pipeline
Requirements:
  - Automated builds on push to main
  - Environment variable management
  - Database migration execution
  - Health checks post-deployment
  - Rollback capability
Steps:
  1. Update environment variables in workflow
  2. Add database migration step
  3. Configure GitHub secrets
  4. Test deployment to staging
  5. Document deployment process
```

**FR-4: Database Initialization**
```yaml
Action: Implement reliable database setup
Components:
  - Initial schema migration
  - Seed data loading
  - Migration rollback capability
  - Documentation of process
Strategy:
  - Use Drizzle migrations exclusively
  - Store seed data in versioned SQL files
  - Automate via npm scripts
  - Document manual recovery procedures
```

## Technical Design

### Phase 1: Compatibility Verification

#### Component: Build Validation
```yaml
Purpose: Ensure Next.js 16 compatibility
Location: Root directory
Dependencies: All package.json dependencies

Checks:
  TypeScript:
    Command: bunx tsc --noEmit
    Expected: Zero errors

  ESLint:
    Command: npm run lint
    Expected: Zero errors or only warnings

  Production Build:
    Command: npm run build
    Expected: Successful build, .next directory created

  Development Server:
    Command: npm run dev
    Expected: Server starts on port 3000

Known Issues to Check:
  - Next.js 16 async request APIs
  - React 19 server components changes
  - NextAuth v5 beta compatibility
  - Drizzle PostgreSQL adapter
  - tRPC v11 with Next.js 16
```

#### Component: Dependency Analysis
```yaml
Purpose: Identify outdated or incompatible packages
Process:
  1. Run npm outdated
  2. Check for security vulnerabilities (npm audit)
  3. Review peer dependency warnings
  4. Check for deprecated packages
  5. Document any incompatibilities

Critical Dependencies:
  - next@^16.0.1
  - react@^19.2.0
  - @trpc/server@^11.7.1
  - drizzle-orm@^0.44.7
  - next-auth@5.0.0-beta.25
```

### Phase 2: Architecture Documentation

#### Component: System Architecture Document
```yaml
Purpose: Comprehensive system documentation
Location: /docs/architecture.md (create)
Content:
  - Technology stack overview
  - Directory structure
  - Data flow diagrams
  - Authentication flow
  - Database schema visualization
  - API structure
  - Deployment architecture
```

Architecture Diagram (High-Level):
```mermaid
graph TD
    Client[Browser Client] --> Next[Next.js 16 App Router]
    Next --> tRPC[tRPC API Layer]
    Next --> Auth[NextAuth v5]

    tRPC --> Drizzle[Drizzle ORM]
    Auth --> Drizzle

    Drizzle --> PG[(PostgreSQL DB)]

    Auth --> Yandex[Yandex OAuth]

    Next --> Static[Static Assets]

    style Next fill:#0070f3,color:#fff
    style tRPC fill:#398ccb,color:#fff
    style Auth fill:#9333ea,color:#fff
    style Drizzle fill:#c5f74f,color:#000
    style PG fill:#336791,color:#fff
```

Authentication Flow:
```mermaid
sequenceDiagram
    participant User
    participant Next as Next.js App
    participant NextAuth
    participant Yandex as Yandex OAuth
    participant DB as PostgreSQL

    User->>Next: Access Protected Page
    Next->>NextAuth: Check Session
    NextAuth->>DB: Query Session Token

    alt No Valid Session
        NextAuth-->>Next: Redirect to /login
        User->>Next: Click "Sign in with Yandex"
        Next->>NextAuth: Initiate OAuth
        NextAuth->>Yandex: OAuth Authorization
        Yandex-->>User: Authorization Prompt
        User->>Yandex: Grant Access
        Yandex-->>NextAuth: Auth Code
        NextAuth->>Yandex: Exchange for Tokens
        Yandex-->>NextAuth: Access Token
        NextAuth->>DB: Create User/Session
        DB-->>NextAuth: Session Created
    end

    NextAuth-->>Next: Session Valid
    Next-->>User: Render Protected Content
```

#### Component: Database Schema Documentation
```yaml
Purpose: Visual database schema documentation
Location: /docs/database-schema.md (create)
Content:
  - Entity-Relationship diagrams
  - Table descriptions
  - Relationship documentation
  - Migration history
  - Seed data documentation
```

Database ER Diagram:
```mermaid
erDiagram
    users ||--o{ accounts : "has"
    users ||--o{ sessions : "has"
    users ||--o{ userRoles : "has"
    users ||--o| userProfiles : "has"
    users ||--o{ usersProperty : "owns"

    buildings ||--o{ entrance : "contains"
    entrance ||--o{ floor : "contains"
    floor ||--o{ apartment : "contains"

    apartment ||--o{ usersProperty : "linked to"

    organizations ||--o{ posts : "publishes"

    users {
        varchar id PK
        varchar name
        varchar email UK
        timestamp emailVerified
        varchar image
    }

    userRoles {
        varchar userId FK
        enum role
    }

    userProfiles {
        varchar id PK
        varchar userId FK
        varchar firstName
        varchar lastName
        varchar phone
        enum gender
    }

    buildings {
        uuid id PK
        int number
        varchar title
        varchar liter
        boolean active
    }
```

### Phase 3: Documentation Adaptation

#### Component: CLAUDE.md Rewrite
```yaml
Purpose: Main development guidelines for T3 Stack
Structure:
  1. Project Overview
     - T3 Stack introduction
     - Technology choices rationale
     - Project structure

  2. Development Setup
     - Prerequisites
     - Installation steps
     - Environment configuration
     - Database setup

  3. Development Workflow
     - Feature development process
     - Code standards
     - Testing requirements
     - Commit conventions

  4. Technology-Specific Guidelines
     - Next.js App Router patterns
     - tRPC best practices
     - Drizzle ORM usage
     - NextAuth configuration

  5. Deployment
     - Build process
     - Environment variables
     - Database migrations
     - CI/CD pipeline

Key Changes from Original:
  - Remove backend/frontend split
  - Remove GraphQL references
  - Remove .NET/C# content
  - Remove GitLab references
  - Add T3 Stack specifics
  - Simplify to single codebase
```

#### Component: MCP_GUIDE.md Update
```yaml
Purpose: MCP server configuration for T3 Stack development

Relevant MCPs to Keep:
  1. Chrome DevTools MCP:
     Purpose: Frontend performance analysis
     Use Cases:
       - Performance profiling
       - Network analysis
       - DOM inspection
       - Debugging

  2. Playwright MCP:
     Purpose: E2E testing automation
     Use Cases:
       - Automated testing
       - Visual regression testing
       - User flow validation

  3. Context7 MCP:
     Purpose: Documentation access
     Use Cases:
       - Next.js documentation
       - React documentation
       - tRPC documentation
       - Drizzle ORM documentation

MCPs to Remove:
  - GitLab MCP (not using GitLab)
  - CodeRabbit CLI (backend-focused)
  - Figma MCP (if not doing design work)
  - Gemini CLI (if not using Google Workspace)
  - Mermaid Generator/Validator (unless needed)

MCPs to Evaluate:
  - Codex High/Medium (check if available/useful)
  - Storybook MCP (check if using Storybook)

New Structure:
  1. Prerequisites
  2. Essential MCPs for T3 Stack
  3. Optional MCPs
  4. Setup Instructions
  5. Usage Examples
  6. Troubleshooting
```

#### Component: AGENT_LIST.md Simplification
```yaml
Purpose: AI agents for T3 Stack development

Agents to Keep:
  Universal Agents:
    - code-reviewer: Code quality review
    - debugger: Problem solving
    - security-expert: Security audits
    - prompt-engineer: Documentation optimization

  Frontend Agents:
    - frontend-developer: React/Next.js development
    - component-standardization: UI component patterns
    - design-system-coordinator: Design system management

  Testing Agents:
    - test-coordinator: Test orchestration
    - test-writer: Unit/integration tests
    - e2e-test-specialist: E2E testing with Playwright
    - test-analyzer: Test failure analysis

Agents to Remove:
  - All .NET/backend agents
  - graphql-architect
  - dotnet-specialist
  - performance-profiler (backend-focused)
  - review-precommit (GitLab-focused)
  - feature-planner (GitLab-focused)
  - feature-builder (can be adapted)
  - review-comment-analyzer (GitLab MR focused)
  - review-fix-executor (GitLab MR focused)
  - architect (can be kept but adapted)

Agents to Adapt:
  - architect: Remove GitLab references, focus on system design
  - feature-builder: Remove GitLab workflow, adapt for GitHub

New Agent Organization:
  1. Workflow Agents (GitHub-based)
  2. Universal Agents
  3. Frontend Agents
  4. Testing Agents
  5. Agent Selection Guide
```

### Phase 4: Deployment Configuration

#### Component: Environment Variables Update
```yaml
Purpose: Configure correct environment for deployment
Location: .github/workflows/deploy.yml

Current Issues:
  - References MySQL (should be PostgreSQL)
  - Uses Bun (verify package manager)
  - Wrong database environment variables
  - Missing database migration step

Required Changes:
  Database Variables:
    OLD: DATABASE_URL: "mysql://..."
    NEW: DATABASE_URL: "postgresql://..."

    OLD: MYSQL_* variables
    NEW: POSTGRES_* variables (if using Docker on server)

  Auth Variables:
    Update AUTH_SECRET
    Update YANDEX_CLIENT_ID
    Update YANDEX_CLIENT_SECRET
    Add NEXTAUTH_URL

  Additional:
    NODE_ENV: production
    Verify all required variables from .env.example
```

#### Component: Database Migration Strategy
```yaml
Purpose: Automated database migrations on deployment
Implementation:
  Pre-Deploy:
    - Backup current database

  Deploy:
    1. Upload new code
    2. Run database migrations (drizzle-kit migrate)
    3. Restart application
    4. Health check

  Post-Deploy:
    - Verify migrations applied
    - Monitor for errors
    - Keep backup for 7 days

Workflow Addition:
  - name: Run Database Migrations
    run: |
      cd $TARGET/current
      npm run db:migrate
```

#### Component: GitHub Secrets Configuration
```yaml
Purpose: Secure secrets management
Required Secrets:
  Deployment:
    - SSH_PRIVATE_KEY: SSH key for server access
    - SSH_USER: Server username
    - SSH_HOST: Server hostname
    - SSH_TARGET_DIR: Deployment directory
    - KNOWN_HOSTS: SSH known hosts (optional)

  Application:
    - AUTH_SECRET: NextAuth secret
    - NEXTAUTH_SECRET: NextAuth secret (v5)
    - NEXTAUTH_URL: Production URL
    - YANDEX_CLIENT_ID: OAuth client ID
    - YANDEX_CLIENT_SECRET: OAuth client secret

  Database:
    - DATABASE_URL: PostgreSQL connection string
    - DATABASE_NAME: Database name
    - POSTGRES_PASSWORD: Database password (if Docker)
    - POSTGRES_USER: Database user (if Docker)

Documentation:
  - Document each secret's purpose
  - Provide generation instructions
  - List security requirements
```

### Phase 5: Database Initialization

#### Component: Fresh Install Strategy
```yaml
Purpose: Reliable database setup from scratch
Process:
  1. Start PostgreSQL container:
     Command: docker-compose up -d database

  2. Wait for database ready:
     Check: pg_isready command

  3. Run migrations:
     Command: npm run db:migrate

  4. Load seed data:
     Method: Already in migration 0001_seed-data.sql
     Alternative: npm run db:seed (create script)

  5. Verify:
     - Check tables created
     - Verify seed data loaded
     - Test application connection

Automation:
  Create npm script:
    "db:init": "npm run db:migrate && npm run db:seed"

  Document process:
    Location: /docs/database-setup.md
```

#### Component: Migration Management
```yaml
Purpose: Safe database evolution
Best Practices:
  - Never modify existing migrations
  - Always test migrations locally first
  - Keep migrations atomic
  - Document breaking changes
  - Provide rollback procedures

Workflow:
  Development:
    1. Modify schema in src/server/db/schemas/
    2. Generate migration: npm run db:generate
    3. Review generated SQL
    4. Test locally: npm run db:migrate
    5. Commit migration file

  Production:
    1. Backup database
    2. Run migration: npm run db:migrate
    3. Verify application works
    4. Monitor for errors

Rollback Strategy:
  - Keep database backups
  - Document manual rollback steps
  - Consider migration down scripts
```

#### Component: Seed Data Management
```yaml
Purpose: Consistent initial data across environments
Current State:
  - Seed data in 0001_seed-data.sql
  - Contains sample buildings, entrances, floors, apartments

Requirements:
  - Idempotent seed scripts (can run multiple times)
  - Separate seed data by environment (dev/staging/prod)
  - Version control all seed data
  - Document what data is seeded

Improvements:
  Create separate seed scripts:
    - 0001_seed-data-required.sql (must have)
    - 0001_seed-data-development.sql (dev only)
    - 0001_seed-data-staging.sql (staging only)

  Or use TypeScript seed scripts:
    Location: /src/server/db/seed/
    Advantage: Type-safe, can use Drizzle API
```

## Implementation Guidance

### Development Phases

**Phase 1: Verification (Priority: CRITICAL)**
```yaml
Duration: Assessment phase
Tasks:
  1. Run all compatibility checks
  2. Document any errors found
  3. Fix critical issues
  4. Verify build succeeds
Success Criteria:
  - Clean TypeScript compilation
  - Successful production build
  - Dev server runs without errors
```

**Phase 2: Architecture Documentation (Priority: HIGH)**
```yaml
Duration: Documentation phase
Tasks:
  1. Create /docs directory
  2. Write architecture.md
  3. Write database-schema.md
  4. Create diagrams
  5. Document deployment architecture
Success Criteria:
  - Comprehensive architecture documentation
  - Visual diagrams for key flows
  - Clear database schema documentation
```

**Phase 3: Documentation Adaptation (Priority: HIGH)**
```yaml
Duration: Documentation rewrite
Tasks:
  1. Rewrite CLAUDE.md for T3 Stack
  2. Update MCP_GUIDE.md
  3. Simplify AGENT_LIST.md
  4. Create or update README.md
Success Criteria:
  - All documentation reflects current stack
  - No .NET/GraphQL references
  - Clear development guidelines
  - Accurate MCP setup instructions
```

**Phase 4: Deployment Configuration (Priority: MEDIUM)**
```yaml
Duration: CI/CD setup
Tasks:
  1. Update deploy.yml environment variables
  2. Add database migration step
  3. Configure GitHub secrets
  4. Test deployment pipeline
Success Criteria:
  - Deployment workflow runs successfully
  - Database migrations execute
  - Application starts correctly
  - Health checks pass
```

**Phase 5: Database Management (Priority: MEDIUM)**
```yaml
Duration: Database setup automation
Tasks:
  1. Create db:init script
  2. Document setup process
  3. Implement backup strategy
  4. Create rollback procedures
Success Criteria:
  - Fresh install works reliably
  - Migrations are atomic
  - Seed data loads correctly
  - Recovery process documented
```

### Testing Approach

**Compatibility Testing:**
```yaml
Tests:
  - TypeScript compilation
  - ESLint checks
  - Production build
  - Development server
  - All npm scripts
Tools:
  - TypeScript compiler
  - ESLint
  - Next.js build
```

**Documentation Testing:**
```yaml
Tests:
  - Follow setup instructions
  - Verify all links work
  - Check code examples
  - Test MCP setup steps
Method:
  - Fresh clone walkthrough
  - New developer onboarding test
```

**Deployment Testing:**
```yaml
Tests:
  - Workflow syntax validation
  - Test deployment to staging
  - Verify environment variables
  - Check database migrations
  - Validate application health
Tools:
  - GitHub Actions
  - SSH access to server
  - Database client
```

**Database Testing:**
```yaml
Tests:
  - Fresh database initialization
  - Migration execution
  - Seed data loading
  - Rollback procedures
  - Backup/restore
Tools:
  - Docker Compose
  - Drizzle Kit
  - PostgreSQL client
```

## Risks and Mitigations

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Next.js 16 breaking changes | High | Medium | Thorough compatibility testing, review migration guide |
| React 19 breaking changes | High | Medium | Test all components, check server component usage |
| NextAuth v5 beta instability | Medium | Low | Monitor for issues, have rollback plan |
| Deployment pipeline failures | High | Medium | Test thoroughly, have manual deployment procedure |
| Database migration failures | Critical | Low | Always backup before migrations, test rollback |
| Documentation inaccuracies | Medium | Medium | Have developers test documentation, iterate |

### Process Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Incomplete documentation | Medium | High | Systematic review, test with fresh eyes |
| Missing secrets in deployment | High | Medium | Document all required secrets, validation checks |
| Incorrect architecture assumptions | Medium | Medium | Codex validation, peer review |
| Overlooked dependencies | Low | Low | Run dependency audit, check outdated packages |

## Success Metrics

### Phase 1: Verification
- ✅ Zero TypeScript errors
- ✅ Zero critical ESLint errors
- ✅ Successful production build
- ✅ Clean npm audit (no critical vulnerabilities)

### Phase 2: Documentation
- ✅ Architecture diagram created
- ✅ Database schema documented
- ✅ All major flows documented
- ✅ Deployment architecture clear

### Phase 3: Adaptation
- ✅ CLAUDE.md reflects T3 Stack
- ✅ MCP_GUIDE.md accurate
- ✅ AGENT_LIST.md simplified
- ✅ No .NET/GraphQL references

### Phase 4: Deployment
- ✅ Workflow syntax valid
- ✅ Successful test deployment
- ✅ All secrets configured
- ✅ Migrations execute successfully

### Phase 5: Database
- ✅ Fresh install works
- ✅ Migrations are atomic
- ✅ Seed data loads correctly
- ✅ Backup/restore tested

## Validation Strategy

### Codex Validation Points

**Validation 1: Architecture Design**
```yaml
Question: Is the documented T3 Stack architecture sound?
Areas:
  - Next.js App Router usage
  - tRPC API layer design
  - Drizzle ORM integration
  - NextAuth configuration
  - State management approach
```

**Validation 2: Documentation Structure**
```yaml
Question: Is the documentation comprehensive and accurate?
Areas:
  - Completeness of guidelines
  - Accuracy of technical details
  - Clarity of instructions
  - Usefulness for onboarding
```

**Validation 3: Deployment Strategy**
```yaml
Question: Is the deployment pipeline robust?
Areas:
  - Environment variable management
  - Database migration approach
  - Error handling
  - Rollback capability
```

**Validation 4: Database Management**
```yaml
Question: Is the database initialization strategy reliable?
Areas:
  - Migration workflow
  - Seed data approach
  - Backup strategy
  - Recovery procedures
```

## Next Steps

1. **Validate Plan with Codex**
   - Submit this specification for review
   - Iterate on feedback
   - Get approval on approach

2. **Execute Phase 1** (Verification)
   - Run compatibility checks
   - Fix any errors
   - Document findings

3. **Execute Phase 2** (Architecture Docs)
   - Create documentation structure
   - Write architecture overview
   - Create diagrams

4. **Execute Phase 3** (Documentation Adaptation)
   - Rewrite CLAUDE.md
   - Update MCP_GUIDE.md
   - Simplify AGENT_LIST.md

5. **Execute Phase 4** (Deployment)
   - Update workflow file
   - Configure secrets
   - Test deployment

6. **Execute Phase 5** (Database)
   - Create initialization scripts
   - Document procedures
   - Test recovery

7. **Final Review**
   - Complete testing
   - Documentation review
   - Deploy to production

## Appendices

### A. Package Manager Investigation

**Question:** Does this project use npm, yarn, pnpm, or bun?

**Evidence to Check:**
```yaml
Indicators:
  npm:
    - package-lock.json exists
    - npm scripts in package.json

  yarn:
    - yarn.lock exists
    - .yarnrc.yml exists

  pnpm:
    - pnpm-lock.yaml exists
    - .npmrc with pnpm config

  bun:
    - bun.lockb exists
    - bunfig.toml exists

Current Assessment:
  - Check for lock files
  - Check scripts in package.json
  - Check deploy.yml (currently uses Bun)
```

### B. Storybook Investigation

**Question:** Does this project use Storybook?

**Evidence to Check:**
```yaml
Indicators:
  - .storybook/ directory exists
  - storybook scripts in package.json
  - @storybook/* dependencies

Current Assessment:
  - No references in package.json
  - CLAUDE-FRONT.md mentions it (from other project)
  - Likely not used in this project

Action:
  - Remove Storybook references from documentation
  - Or add Storybook if desired
```

### C. Decision Log

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|---------|-----------|
| Documentation approach | Minimal, Comprehensive | Comprehensive | New project needs thorough docs |
| MCP retention | Keep all, Evaluate, Remove all | Evaluate | Keep useful, remove irrelevant |
| Agent simplification | Keep all, Simplify, Remove | Simplify | T3 stack doesn't need .NET agents |
| Deployment approach | Manual, Automated | Automated | CI/CD best practice |
| Database strategy | Manual setup, Automated | Automated | Reliability and consistency |

### D. Environment Variables Reference

**Required for Development:**
```bash
# .env
AUTH_SECRET="generate-with-npx-auth-secret"
YANDEX_CLIENT_ID="your-yandex-oauth-client-id"
YANDEX_CLIENT_SECRET="your-yandex-oauth-client-secret"
DATABASE_URL="postgresql://postgres:password@localhost:5432/sr2-t3"
DATABASE_NAME="sr2-t3"
NODE_ENV="development"
```

**Required for Production:**
```bash
# GitHub Secrets
AUTH_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
YANDEX_CLIENT_ID
YANDEX_CLIENT_SECRET
DATABASE_URL
DATABASE_NAME
SSH_PRIVATE_KEY
SSH_USER
SSH_HOST
SSH_TARGET_DIR
```

### E. Useful Commands Reference

**Development:**
```bash
# Install dependencies
npm install

# Generate Drizzle types
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

**Database:**
```bash
# Start PostgreSQL container
docker-compose up -d database

# Stop PostgreSQL container
docker-compose down

# Fresh database (destroy and recreate)
docker-compose down -v
docker-compose up -d database
npm run db:migrate
```

**Quality Checks:**
```bash
# Full check
npm run check

# Format check
npm run format:check

# Format write
npm run format:write
```

---

**Status:** Ready for Codex validation
**Next:** Submit to codex-high for architectural review and feedback
