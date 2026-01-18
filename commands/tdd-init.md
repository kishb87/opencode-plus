---
description: Initialize TDD project structure with .context/, .tdd/, and tasks/ directories
---

Initialize the TDD workflow for this project.

Use the `tdd_init` tool to create the project structure:
- `.context/` - Foundational documents (PRD, spec, test spec, agent spec)
- `.tdd/` - Workflow state (gitignored)
- `tasks/` - Individual TDD task files

## Next Steps

After initialization, generate foundational documents:

**Option 1: Iterative (Recommended)**
Review and refine each document before moving to the next:
1. `/tdd/prd "Your project description"` - Generate PRD → Review & refine
2. `/tdd/spec` - Generate technical spec → Review & refine
3. `/tdd/test-spec` - Generate test spec → Review & refine
4. `/tdd/agent-spec` - Generate agent principles → Review & refine
5. `/tdd/tasks` - Generate task files → Review & refine
6. `/tdd/start` - Begin implementation

**Option 2: All at Once**
Generate all documents in one session:
- `/tdd/architect-full "Your project description"` - Generates everything

**Option 3: Manual**
Create documents yourself and place them in `.context/` and `tasks/`.
