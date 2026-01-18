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

Each task file must have complete frontmatter:

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

## Test-Driven Approach
1. Write failing test for X
2. Implement X to make test pass
3. Write test for Y
4. Implement Y
5. Refactor

## Acceptance Criteria
- [ ] Specific criterion with test reference
- [ ] Another criterion
- [ ] Edge case handled

## Reference Documentation
- See `.context/spec.md` section X for API design
- See `.context/test.md` section Y for test patterns
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

1. Read all context documents: `@.context/prd.md`, `@.context/spec.md`, `@.context/test.md`, `@.context/agent-spec.md`
2. Identify major features from PRD
3. Break down each feature into implementation tasks
4. Order tasks by dependencies
5. Create individual task files with complete frontmatter
6. Ensure each task has clear test scope
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
