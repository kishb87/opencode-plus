---
description: Generate Agent Specification with abstract principles
agent: architect
---

# Generate Agent Specification

Generate an abstract specification for AI agents implementing this project.

## Prerequisites

Before running this command, you should have:
- `.context/prd.md` - Product Requirements Document
- `.context/spec.md` - Technical Specification
- `.context/test.md` - Test Specification

Reference with: `@.context/prd.md`, `@.context/spec.md`, `@.context/test.md`

## Purpose

The Agent Spec provides **abstract architectural principles** that guide AI agents during implementation. It focuses on:
- Design patterns and conventions
- Code organization philosophy
- Error handling strategies
- Architectural constraints
- Quality standards

**Important:** This should be **abstract**, not specific code paths or implementations.

## Requirements

- Minimum 100 lines (target 150-250)
- Abstract principles only (no specific implementations)
- Patterns and conventions to follow
- Architectural guardrails
- Quality and consistency guidelines
- Error handling philosophy
- Testing approach at a conceptual level

## Output Location

Write to: `.context/agent-spec.md`

## Process

1. Read and synthesize `@.context/prd.md`, `@.context/spec.md`, `@.context/test.md`
2. Identify key architectural patterns from the spec
3. Extract design principles and conventions
4. Document abstract guidelines (not specific code)
5. Focus on "how to think" not "what to do"

## Format

```markdown
# Agent Specification

## 1. Architectural Principles
[Core design principles: modularity, separation of concerns, etc.]

## 2. Code Organization
[How code should be structured: layering, modules, dependencies]

## 3. Design Patterns
[Patterns to use: repository, factory, strategy, etc.]

## 4. Error Handling Philosophy
[How to handle errors: fail-fast, graceful degradation, etc.]

## 5. Data Flow & State Management
[How data moves through the system abstractly]

## 6. Testing Philosophy
[Test pyramid, coverage expectations, TDD approach]

## 7. Code Quality Standards
[Naming conventions, documentation, simplicity]

## 8. Security Principles
[Defense in depth, input validation, auth patterns]

## 9. Performance Considerations
[Optimization approach, caching strategy, scalability]
```

## Good vs Bad Examples

**Bad (too specific):**
```markdown
## Authentication
- Use JWT tokens stored in localStorage
- Implement login endpoint at POST /api/auth/login
- Token expires in 24 hours
```

**Good (abstract principles):**
```markdown
## Authentication
- Use stateless token-based authentication
- Implement server-side session validation
- Follow principle of least privilege
- Separate authentication from authorization
- Store sensitive tokens securely (never in client storage)
```

**Bad (specific implementation):**
```markdown
## Database Access
- Use TypeORM with PostgreSQL
- Create UserRepository in src/repositories/user.ts
```

**Good (abstract pattern):**
```markdown
## Database Access
- Use repository pattern to abstract data access
- Keep business logic separate from persistence
- Favor composition over inheritance
- Handle database errors at repository boundary
```

## Validation

Before finishing, ensure:
- [ ] All principles are abstract, not specific implementations
- [ ] Covers architectural patterns from the spec
- [ ] Provides guidance without being prescriptive about exact code
- [ ] Focuses on "why" and "how to think", not "what"
- [ ] No file paths, function names, or specific libraries mentioned
- [ ] Reusable across different implementations of the same architecture

## User Input

$INPUT
