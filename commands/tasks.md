---
description: Generate individual TDD task files from specifications
agent: architect
---

# Generate TDD Task Files

Break down the project into individual TDD tasks, creating separate task files for implementation.

## Prerequisites

Before running this command, you should have:
- `.context/prd.md` - Product Requirements Document
- `.context/spec.md` - Technical Specification
- `.context/test.md` - Test Specification
- `.context/agent-spec.md` - Agent Specification

Reference with: `@.context/prd.md`, `@.context/spec.md`, `@.context/test.md`, `@.context/agent-spec.md`

## Requirements

- Create individual task files: `tasks/TDD_001.md`, `tasks/TDD_002.md`, etc.
- Minimum 10 tasks for a typical project (adjust based on scope)
- Each task should be:
  - **Focused** - Single feature or component
  - **Testable** - Clear test scope defined
  - **Ordered** - Logical dependency sequence
  - **Self-contained** - Includes all context needed

## Task File Format

Each task file must have complete frontmatter with implementation guidance:

```markdown
---
title: Brief task description
status: pending
test_scope: |
  - Specific tests to write
  - Expected test coverage
existing_code_context: |
  - What files/modules already exist
  - What to build upon vs create new
dependencies:
  - TDD_001
  - TDD_003
---

# Task: [Descriptive Title]

## Objective
Clear statement of what this task accomplishes.

## Requirements
1. Specific requirement
2. Another requirement
3. Edge cases to handle

## Implementation Guidance

**From research** (see `.context/research.md#implementation-patterns`):

**Approach**: [How this is typically implemented based on research]

**Key Steps**:
1. [Step 1 from research]
2. [Step 2 from research]
3. [Step 3 from research]

**Code Pattern** (from research):
```[language]
// Example pattern from research
[brief code example showing the approach]
```

**Common Gotchas** (from research):
- [Gotcha 1 to avoid]
- [Gotcha 2 to avoid]

## Test-Driven Approach
1. Write failing test for X
2. Implement X to make test pass (following pattern from research)
3. Write test for Y
4. Implement Y (following pattern from research)
5. Refactor

## Acceptance Criteria
- [ ] Specific criterion with test reference
- [ ] Follows implementation pattern from research
- [ ] Another criterion
- [ ] Edge case handled

## Reference Documentation
- See `.context/research.md#[topic]` for implementation patterns
- See `.context/spec/` section X for API design
- See `.context/test/` section Y for test patterns
- See `.context/agent-spec.md` for architectural guidelines
```

## Task Breakdown Strategy

Tasks should follow a logical implementation order:

1. **Foundation** - Core models, database setup
2. **Services** - Business logic layer
3. **API Layer** - Endpoints and validation
4. **Integration** - Component integration
5. **Features** - User-facing features
6. **Polish** - Error handling, edge cases

Example task sequence:
```
TDD_001: Set up database schema and migrations
TDD_002: Implement User model with validation
TDD_003: Create UserRepository with CRUD operations
TDD_004: Implement authentication service
TDD_005: Create login/logout API endpoints
TDD_006: Add JWT token validation middleware
TDD_007: Implement user registration flow
TDD_008: Add email verification
...
```

## Process

### Phase 1: Implementation Research (CRITICAL - Do This Before Creating Tasks)

Before creating task files, research HOW to implement each major component.

#### Step 1.1: Identify Implementation Topics

Based on spec, identify what needs implementation research:
- **For each major feature/component**: How is it typically implemented?
- **For each library mentioned in spec**: What are the implementation patterns?
- **For each integration point**: How do these pieces work together?

**Examples**:
- Spec mentions "JWT authentication" → Research: JWT implementation patterns, token validation
- Spec mentions "WebSocket connections" → Research: WebSocket setup, connection management
- Spec mentions "File upload handling" → Research: Multipart parsing, storage patterns
- Spec mentions "Database migrations" → Research: Migration tools, rollback strategies

#### Step 1.2: Spawn @researcher Agents in Parallel

**IMPORTANT**: Spawn ALL researchers in PARALLEL (single message, multiple Task tool calls).

For each implementation topic, invoke @researcher:
- Prompt: "How to implement [feature] using [library from spec]. Context: [project summary]"
- Focus on: Implementation patterns, code structure, common gotchas
- Each researcher returns 50-150 lines of raw data

**Example research topics**:
- "How to implement JWT authentication with Passport.js in Express"
- "How to set up WebSocket connections with Socket.IO"
- "How to handle file uploads with Multer"
- "How to structure database migrations with Drizzle ORM"

#### Step 1.3: Collect Implementation Guidance

Wait for all researchers to complete.

You'll receive:
- Context7 results (if available)
- Official docs and current patterns
- Common implementation approaches
- Gotchas and best practices

#### Step 1.4: Create Research Files in research/ Directory

Create individual research files in `.context/research/` for each implementation topic.

**For each topic, create `.context/research/[topic-name].md`**:

```markdown
# [Topic] Implementation

**Generated**: [Date]
**Libraries**: [Libraries used]
**Official Docs**: [URLs]

## Overview

[What this is and why it's used in this project]

## Approach

[How this is typically implemented]

## Key Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Code Pattern

```[language]
[Brief example code]
```

## Common Gotchas

1. **[Gotcha 1]**: [Description]
   - Solution: [How to avoid]

## Integration

[How this integrates with other components]

## References

- [URL 1]
- [URL 2]
```

**Update `.context/research/TOC.md`**:

Add entry for each new research file:

```markdown
### Implementation Patterns

- **[jwt-authentication.md](./jwt-authentication.md)** - JWT auth implementation
- **[file-uploads.md](./file-uploads.md)** - File upload handling

[Add all new research files to TOC]
```

### Phase 2: Create Task Files

1. Read all context documents: `@.context/prd.md`, `@.context/spec/`, `@.context/test/`, `@.context/agent-spec.md`
2. Read implementation research from `.context/research/` (check TOC.md for available research)
3. Identify major features from PRD
4. Break down each feature into implementation tasks
5. Order tasks by dependencies
6. Create individual task files with:
   - Complete frontmatter
   - Clear test scope
   - **Implementation guidance from research**
   - **Code patterns from research**
7. Update `.tdd/state.json` with total task count

## State File Update

After creating tasks, update `.tdd/state.json`:

```json
{
  "total_tasks": 15,
  "workflow_phase": "ready",
  "current_task": null
}
```

## Validation

Before finishing, ensure:
- [ ] All major features from PRD have tasks
- [ ] Tasks are ordered by dependencies
- [ ] Each task has complete frontmatter
- [ ] Test scope is specific for each task
- [ ] Tasks are appropriately sized (1-3 hours of work)
- [ ] No task is too large or too vague
- [ ] Dependencies are correctly specified
- [ ] State file is updated with task count

## Output

Create task files in `tasks/` directory:
- `tasks/TDD_001.md`
- `tasks/TDD_002.md`
- `tasks/TDD_003.md`
- ... (as many as needed)

And update `.tdd/state.json` with the total count.

## User Input

$INPUT
