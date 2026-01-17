---
description: Start or resume the TDD Actor-Critic workflow
agent: orchestrator
---

Start or resume the TDD workflow.

## Current State
!`cat .tdd/state.json 2>/dev/null || echo '{"workflow_phase": "not_started"}'`

## Task Files
!`ls tasks/TDD_*.md 2>/dev/null | head -20 || echo "No task files found"`

## Instructions

1. Load the current state from `.tdd/state.json`
2. Determine the next task to work on using `tdd_next`
3. Prepare context for the Actor agent
4. Invoke @actor to implement the task
5. Prepare context for the Critic agent (WITHOUT Actor's reasoning)
6. Invoke @critic to validate the implementation
7. Process the verdict:
   - APPROVED: Mark task complete, move to next
   - NOT APPROVED: Retry with feedback (max 3 attempts)
8. Update state and continue until all tasks complete

Begin the workflow now.
