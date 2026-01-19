# Agent Documentation

This document describes the AI agents provided by opencode-tdd.

## Architecture Overview

```
opencode-tdd/
├── src/
│   ├── agents/           # Agent configurations
│   │   ├── actor.ts      # TDD implementer
│   │   ├── critic.ts     # TDD validator
│   │   ├── orchestrator.ts # Workflow coordinator
│   │   └── architect.ts  # Document generator
│   ├── tools/            # Custom tools
│   ├── hooks/            # Event hooks
│   └── config/           # Configuration schema
└── commands/             # Slash commands
```

## Agents

### Actor (`@actor`)

**Purpose**: Implements TDD tasks following Red→Green→Refactor methodology.

**Mode**: Subagent (fresh context per invocation)

**Key Characteristics**:
- Receives fresh context for each task (no memory of previous work)
- Reads codebase as needed using tools
- Follows strict TDD phases: Red → Green → Refactor
- Addresses Critic feedback on retry attempts

**Tools Available**:
- `bash`: Run tests, install dependencies
- `read`: Examine existing code
- `write`: Create new files
- `edit`: Modify existing files

**Invocation**: Used by Orchestrator via Task tool, or directly with `@actor`

---

### Critic (`@critic`)

**Purpose**: Validates implementations using scoped validation.

**Mode**: Subagent (fresh context per invocation)

**Key Characteristics**:
- Fresh context (doesn't see Actor's reasoning)
- Only validates tests in `must_pass` scope
- Ignores `expected_to_fail` tests (future work)
- Provides binary verdict: APPROVED or NOT APPROVED
- Gives specific, actionable feedback on failures

**Tools Available**:
- `bash`: Run test commands
- `read`: Examine code and test files

**Tools Denied**:
- `write`: Cannot modify files
- `edit`: Cannot modify files

**Invocation**: Used by Orchestrator via Task tool, or directly with `@critic`

---

### Orchestrator (`@orchestrator`)

**Purpose**: Coordinates the TDD workflow between Actor and Critic.

**Mode**: Primary (maintains conversation with user)

**Key Characteristics**:
- Manages task progression through backlog
- Prepares context packages for Actor and Critic
- Tracks state in `.tdd/state.json`
- Handles retry logic (max 3 attempts by default)
- Controls workflow phases

**Tools Available**:
- All tools (bash, read, write, edit)
- Task tool for invoking subagents

**State Management**:
```json
{
  "workflow_phase": "in_progress",
  "current_task": "TDD_4",
  "current_attempt": 1,
  "completed_tasks": ["TDD_1", "TDD_2", "TDD_3"],
  "last_critic_feedback": "..."
}
```

---

### Architect (`@architect`)

**Purpose**: Generates comprehensive foundational documents.

**Mode**: Primary (interactive with user)

**Key Characteristics**:
- Uses Socratic method (asks questions before generating)
- Multi-phase generation (outline → expand → validate)
- Anti-brevity instructions (overrides default minimalism)
- Creates complete, production-ready documents

**Documents Generated**:
| Document | Location | Min Lines |
|----------|----------|-----------|
| PRD | `.context/prd.md` | 200 |
| Technical Spec | `.context/spec.md` | 500 |
| Test Spec | `.context/test.md` | 300 |
| Agent Spec | `.context/agent-spec.md` | 100 |
| Tasks | `tasks/TDD_*.md` | 500 total |

---

## Design Principles

### Fresh Context

Both Actor and Critic receive fresh context per invocation. This aligns with "Adversarial Cooperation" research findings:

1. **No accumulated bias**: Each invocation starts clean
2. **No context bloat**: Context size stays constant across many tasks
3. **Self-contained tasks**: Task files must contain all needed information
4. **Read over remember**: Agents read codebase instead of relying on memory

### Scoped Validation

The Critic only validates tests that are in scope:

```yaml
test_scope:
  owns:
    - "tests/unit/auth/session.test.ts"    # Actor created these
  must_pass:
    - "tests/unit/shared/errors.test.ts"   # Must still pass
    - "tests/unit/auth/session.test.ts"    # Must pass after work
  expected_to_fail:
    - "tests/e2e/auth.e2e.test.ts"         # Future work - IGNORE
```

This prevents false failures from tests that are expected to fail until future tasks implement them.

### Independent Validation

The Critic doesn't receive:
- Actor's conversation history
- Actor's self-assessment
- Actor's explanation of changes

This ensures unbiased validation based purely on objective test results.

---

## Customization

### Model Overrides

```json
{
  "models": {
    "actor": "google/gemini-2.0-flash",
    "critic": "anthropic/claude-sonnet-4-20250514"
  }
}
```

### Prompt Customization

```json
{
  "prompts": {
    "actorAppend": "Always use TypeScript strict mode.",
    "criticAppend": "Pay special attention to error handling."
  }
}
```

---

## Workflow Phases

```
not_started → in_progress → actor_working → critic_validating → in_progress → ... → completed
                                  ↑                                    |
                                  └────────────── (retry) ─────────────┘
```

| Phase | Description |
|-------|-------------|
| `not_started` | No tasks begun |
| `in_progress` | Working through tasks |
| `actor_working` | Actor is implementing current task |
| `critic_validating` | Critic is reviewing implementation |
| `completed` | All tasks finished |
| `blocked` | Max retries exceeded, needs human intervention |
