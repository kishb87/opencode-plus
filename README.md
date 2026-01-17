# opencode-tdd

TDD Actor-Critic workflow system for [OpenCode](https://opencode.ai) - structured test-driven development with AI agents.

## Overview

This plugin provides a complete TDD (Test-Driven Development) workflow using an Actor-Critic multi-agent system:

- **Actor**: Implements tasks following Red→Green→Refactor methodology
- **Critic**: Validates implementations with fresh context and scoped validation
- **Orchestrator**: Coordinates the workflow, manages state, handles retries
- **Architect**: Generates comprehensive foundational documents (PRD, spec, tests, tasks)

## Installation

```bash
# Using bun (recommended)
bun add opencode-tdd

# Using npm
npm install opencode-tdd

# Using pnpm
pnpm add opencode-tdd
```

Add to your `opencode.json`:

```json
{
  "plugin": ["opencode-tdd"]
}
```

## Quick Start

```bash
# 1. Initialize TDD structure
opencode
> /tdd-init

# 2. Generate foundational documents
> /architect-full "Build a REST API for task management with user authentication"

# 3. Start TDD workflow
> /tdd-start

# 4. Check progress anytime
> /tdd-status
```

## What's Included

### Agents

| Agent | Description | Invoke with |
|-------|-------------|-------------|
| **Actor** | TDD implementer (Red→Green→Refactor) | `@actor` |
| **Critic** | TDD validator (fresh context, scoped validation) | `@critic` |
| **Orchestrator** | Workflow coordinator | `@orchestrator` |
| **Architect** | Document generator | `@architect` |

### Tools

| Tool | Description |
|------|-------------|
| `tdd_init` | Initialize project structure |
| `tdd_status` | Check workflow progress |
| `tdd_next` | Get next task to work on |
| `tdd_state` | Read/update workflow state |

### Commands

| Command | Description |
|---------|-------------|
| `/tdd-init` | Initialize TDD project |
| `/tdd-start` | Start/resume TDD workflow |
| `/tdd-status` | Check progress |
| `/architect-full` | Generate all foundational docs |
| `/architect-prd` | Generate PRD only |

## Project Structure

After initialization, your project will have:

```
your-project/
├── .context/           # Foundational documents
│   ├── prd.md         # Product requirements
│   ├── spec.md        # Technical specification
│   ├── test.md        # Test specification
│   └── agent-spec.md  # Abstract principles for AI
├── .tdd/              # Workflow state (gitignored)
│   ├── state.json     # Current progress
│   └── test-mapping.json
├── tasks/             # Individual TDD task files
│   ├── TDD_1.md
│   ├── TDD_2.md
│   └── ...
└── ...
```

## How It Works

### The Actor-Critic Loop

```
┌─────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR                            │
│              (Coordinates workflow, manages state)           │
└─────────────────────────────────────────────────────────────┘
                          ↓                    ↓
            ┌─────────────────────┐  ┌─────────────────────┐
            │    ACTOR AGENT      │  │    CRITIC AGENT     │
            │  (Implements TDD)   │  │ (Validates work)    │
            ├─────────────────────┤  ├─────────────────────┤
            │ • Fresh context     │  │ • Fresh context     │
            │ • Reads task file   │  │ • Sees ONLY outputs │
            │ • Red→Green→Refactor│  │ • No Actor reasoning│
            │ • Runs tests        │  │ • Binary verdict    │
            └─────────────────────┘  └─────────────────────┘
```

### Key Design Decisions

1. **Fresh Context**: Both Actor and Critic receive fresh context per invocation - no accumulated bias
2. **Scoped Validation**: Critic only validates tests in scope for current task
3. **Independent Validation**: Critic doesn't see Actor's reasoning - validates based on results only
4. **Binary Verdicts**: APPROVED or NOT APPROVED - no ambiguity

## Configuration

Create `opencode-tdd.json` in your project root:

```json
{
  "models": {
    "actor": "anthropic/claude-sonnet-4-20250514",
    "critic": "anthropic/claude-sonnet-4-20250514",
    "orchestrator": "anthropic/claude-sonnet-4-20250514",
    "architect": "anthropic/claude-sonnet-4-20250514"
  },
  "workflow": {
    "maxRetries": 3,
    "testCommand": "npm test"
  },
  "documents": {
    "minPrdLines": 200,
    "minSpecLines": 500
  },
  "features": {
    "architectAgent": true,
    "autoSaveState": true,
    "testTracking": true
  }
}
```

## Task File Format

Each task file (`tasks/TDD_*.md`) has this structure:

```yaml
---
task_id: "TDD_4"
title: "Implement Auth Service"
test_scope:
  owns:
    - "tests/unit/auth/auth.service.test.ts"
  must_pass:
    - "tests/unit/shared/errors.test.ts"
    - "tests/unit/auth/auth.service.test.ts"
  expected_to_fail:
    - "tests/integration/auth/auth.api.test.ts"
existing_code_context:
  relevant_files:
    - path: "src/utils/jwt.ts"
      description: "JWT utilities to use"
---

## Description
[Task description]

## Requirements
[Specific requirements]

## Test Cases
[Test examples]
```

## Documentation

- [Agent Definitions](./AGENTS.md)
- [Configuration Schema](./src/config/schema.ts)
- [OpenCode Plugin Docs](https://opencode.ai/docs/plugins/)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT
