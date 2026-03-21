<div align="center">

[![npm version](https://img.shields.io/npm/v/opencode-adversarial-cooperation?style=flat-square&color=cb3837&logo=npm)](https://www.npmjs.com/package/opencode-adversarial-cooperation)
[![npm downloads](https://img.shields.io/npm/dw/opencode-adversarial-cooperation?style=flat-square&color=cb3837)](https://www.npmjs.com/package/opencode-adversarial-cooperation)
[![CI](https://img.shields.io/github/actions/workflow/status/kishb87/opencode-adversarial-cooperation/ci.yml?branch=main&style=flat-square&label=CI&logo=github)](https://github.com/kishb87/opencode-adversarial-cooperation/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org/)

</div>

# OpenCode Adversarial Cooperation

An implementation of [Block AI Research's "Adversarial Cooperation in Code Synthesis"](https://block.xyz/documents/adversarial-cooperation-in-code-synthesis.pdf) for [OpenCode](https://opencode.ai). This plugin brings **dialectical autocoding** to your development workflow -- specialized AI agents that cooperate adversarially to produce validated, tested code.

## Table of Contents

- [Why Adversarial Cooperation?](#why-adversarial-cooperation)
- [The Six Principles](#the-six-principles)
- [How This Plugin Implements It](#how-this-plugin-implements-it)
- [Quick Start](#quick-start)
- [The Agents](#the-agents)
- [The Complete Workflow](#the-complete-workflow)
- [Commands Reference](#commands-reference)
- [Configuration](#configuration)
- [Additional Documentation](#additional-documentation)

## Why Adversarial Cooperation?

Block AI Research's paper (December 2025) identifies a critical failure mode in single-agent AI coding: **premature success declaration**. When a single AI agent both writes and reviews its own code, it tends to:

- Claim completion before requirements are fully met
- Self-assess optimistically rather than critically
- Accumulate context pollution over extended sessions
- Miss security gaps and edge cases
- "Grade its own homework" -- defending its decisions rather than questioning them

The paper's solution is **dialectical autocoding**: a structured adversarial cooperation between specialized agents, inspired by Hegel's thesis-antithesis-synthesis dialectic. One agent implements (thesis), another independently critiques (antithesis), and their iteration produces validated code (synthesis).

**This is not adversarial in the hostile sense.** Both agents share the same goal -- producing correct, tested code. The adversarial structure ensures that the implementer's work is always independently verified, preventing the failure modes that plague single-agent systems.

### Empirical Results

The research demonstrates that adversarial cooperation produces measurably better outcomes:

- **Independent validation catches gaps** that self-assessment misses
- **Fresh context per turn** prevents accumulated bias from earlier mistakes
- **Context pollution is eliminated** because failed attempts don't leak into new ones
- **The system is non-functional without the Critic** (ablation studies confirm the Coach/Critic is essential, not optional)

## The Six Principles

The Block research identifies six core principles for effective adversarial cooperation. This plugin implements all six:

### 1. Dialectical Loop

The Actor implements code (thesis). The Critic independently reviews it (antithesis). Their iteration produces validated code (synthesis). Neither agent can unilaterally declare success.

```
Actor (Thesis)  -->  Critic (Antithesis)  -->  Synthesis (Approved Code)
     ^                                              |
     └──────────── feedback if rejected ────────────┘
```

### 2. Independent Verification

The Critic verifies implementations independently. It does NOT see the Actor's reasoning, conversation, or self-assessment. It runs tests itself and evaluates the actual code, not the Actor's claims about the code.

### 3. Anchoring Prevention

Both agents receive **fresh context** for every invocation. No accumulated assumptions from prior work. No defending previous mistakes. Each turn starts from first principles with only the task requirements and the actual codebase.

### 4. Context Pollution Mitigation

Failed attempts don't pollute new ones. When the Critic rejects work, the Actor receives only the Critic's specific feedback -- not the entire debugging history. The context window is treated as a disposable resource.

### 5. Objective Completion Criteria

Only the Critic can approve work. The Actor cannot declare its own success. The Critic evaluates against objective criteria: do the scoped tests pass? Are requirements met? This prevents premature success declaration.

### 6. Honesty Verification

The Critic is skeptical by design. It doesn't trust the Actor's self-reports. It re-runs tests independently and validates claims against reality. If the Actor says "all tests pass" but they don't, the Critic catches it.

## How This Plugin Implements It

```
┌─────────────────────────────────────────────────────────────────┐
│                    DIALECTICAL LOOP                             │
│                                                                 │
│   ┌──────────┐                              ┌─────────────┐     │
│   │  ACTOR   │         feedback             │  CRITIC     │     │
│   │          │  ─────────────────────────>  │             │     │
│   │ Implement│                              │ Review      │     │
│   │ (Thesis) │  <─────────────────────────  │(Antithesis) │     │
│   │          │         verdict              │             │     │
│   └──────────┘                              └─────────────┘     │
│        ↑                                          ↑             │
│        │              ORCHESTRATOR                │             │
│        │         (Coordinates, manages state)     │             │
│        └──────────────────────────────────────────┘             │
│                                                                 │
│   Fresh context per invocation. No shared reasoning.            │
│   Bounded by: max turns, test scope, task requirements.         │
└─────────────────────────────────────────────────────────────────┘
```

The plugin provides five specialized agents and a two-phase workflow:

**Phase 1 -- Documentation** (Architect + Researcher): Transform requirements into PRD, technical spec, test spec, and individual TDD task files.

**Phase 2 -- Implementation** (Orchestrator + Actor + Critic): Execute the dialectical loop for each task. The Orchestrator coordinates, the Actor implements via TDD (Red-Green-Refactor), and the Critic validates independently. Tasks retry up to 3 times with Critic feedback before escalating.

## Quick Start

Add the plugin to your `opencode.json`:

```json
{
  "plugin": ["opencode-adversarial-cooperation"]
}
```

Then launch OpenCode:

```bash
opencode

# Initialize TDD structure
> /tdd-init

# Generate all documentation at once
> /architect-full "Build a REST API for task management with JWT auth and PostgreSQL"

# Start the adversarial cooperation loop
> /tdd-start

# Check progress anytime
> /tdd-status
```

For a step-by-step approach with review between each phase:

```bash
opencode

# 1. Initialize
> /tdd-init

# 2. Generate and review each document
> /tdd/prd "Build a REST API for task management"
# Review .context/prd.md, make edits if needed

> /tdd/spec
# Review .context/spec/, make edits if needed

> /tdd/test-spec
> /tdd/agent-spec
> /tdd/tasks

# 3. Start the dialectical loop
> /tdd-start
```

## The Agents

### Actor (`@actor`)

**Role**: Implementer (Thesis)
**Mode**: Subagent -- fresh context per invocation
**Temperature**: 0.4

The Actor implements one task per invocation following strict TDD: Red (write failing tests) -> Green (minimal implementation) -> Refactor. It reads the codebase fresh each time -- no memory of previous tasks, no accumulated bias.

**Why fresh context matters**: The Actor can't defend previous mistakes because it doesn't remember them. It approaches each task from first principles, guided only by the task file, existing code, and (on retries) specific Critic feedback.

### Critic (`@critic`)

**Role**: Validator (Antithesis)
**Mode**: Subagent -- fresh context per invocation
**Temperature**: 0.1 (deterministic, skeptical)

The Critic validates the Actor's work with complete independence. It never sees the Actor's reasoning, conversation, or self-assessment. It runs tests itself, reads the actual code, and issues a binary verdict: **APPROVED** or **NOT APPROVED** with specific, actionable feedback.

**Why independence matters**: This is the core of adversarial cooperation. The Critic can't be anchored by the Actor's explanations. It validates based purely on objective evidence: do the tests pass? Does the code meet requirements?

### Orchestrator (`@orchestrator`)

**Role**: Workflow Coordinator
**Mode**: Primary -- maintains conversation with user

The Orchestrator manages the dialectical loop. It prepares context packages for Actor and Critic (ensuring they remain independent), manages state, handles retry logic, and maintains a visible todo list in the UI. It enforces the adversarial structure -- the Actor's reasoning never reaches the Critic.

### Architect (`@architect`)

**Role**: Documentation Generator
**Mode**: Primary -- interactive with user

The Architect transforms requirements into comprehensive foundational documents. It works with the Researcher to generate PRD, technical spec, test spec, agent spec, and individual TDD task files. Uses Socratic method (asks clarifying questions), then generates detailed, production-ready documentation.

### Researcher (`@researcher`)

**Role**: Lightweight Data Fetcher
**Mode**: Subagent -- fast, focused

A 30-60 second agent that fetches raw technical documentation from Context7 and web search. Used by the Architect during documentation generation and by Actor/Critic when they need to look up library APIs or best practices.

## The Complete Workflow

### Phase 1: Documentation Generation

```
User: "Build a REST API for task management"
  |
  v
Architect: Asks clarifying questions
  |
  v
Architect: Identifies libraries, spawns Researchers in parallel
  |
  v
Researchers: Fetch docs for Fastify, JWT, Drizzle ORM, etc. (30-60s each)
  |
  v
Architect: Synthesizes research, generates documents
  |
  v
Output:
  .context/prd.md           -- Product requirements (300-700 lines)
  .context/spec/001-XXX.md  -- Technical specification (1200-15000+ lines)
  .context/test/001-XXX.md  -- Test specification (500-5000+ lines)
  .context/agent-spec.md    -- Abstract architectural principles
  .context/tasks/TDD_001-XXX.md -- Individual TDD tasks (10-50 tasks)
  .context/research/        -- Raw research findings per library
```

### Phase 2: Adversarial Cooperation Loop

```
For each task (TDD_001 -> TDD_XXX):

  Orchestrator: Prepare Actor context (task file + base docs + critic feedback if retry)
       |
       v
  Actor (fresh context): Read codebase -> Write failing tests -> Implement -> Refactor
       |
       v
  Orchestrator: Prepare Critic context (task file + test scope ONLY -- no Actor reasoning)
       |
       v
  Critic (fresh context): Run tests independently -> Evaluate code -> Issue verdict
       |
       v
  APPROVED?
    Yes -> Mark complete, next task
    No  -> Retry with Critic feedback (max 3 attempts)
       |
       v
  All tasks complete -> Working application with tests
```

**What makes this different from a single agent coding loop:**

| Single Agent | Adversarial Cooperation |
|---|---|
| Writes and reviews its own code | Independent reviewer validates code |
| Can declare its own success | Only the Critic can approve |
| Context accumulates and degrades | Fresh context every invocation |
| Self-assessment bias | Objective test-based validation |
| Fails silently on edge cases | Critic specifically checks for gaps |
| "Grades its own homework" | Thesis-antithesis-synthesis dialectic |

## Commands Reference

### Project Setup

| Command | Description |
|---------|-------------|
| `/tdd-init` | Initialize project structure |
| `/tdd-status` | Check workflow progress |

### Documentation Generation

| Command | Description | Agent |
|---------|-------------|-------|
| `/architect-full` | Generate all docs at once | Architect |
| `/tdd/prd` | Generate PRD only | Architect |
| `/tdd/spec` | Generate technical spec | Architect |
| `/tdd/test-spec` | Generate test spec | Architect |
| `/tdd/agent-spec` | Generate agent principles | Architect |
| `/tdd/tasks` | Generate task files | Architect |
| `/tdd/research` | Research a library/technology | Researcher |

### Implementation

| Command | Description | Agent |
|---------|-------------|-------|
| `/tdd-start` | Start/resume adversarial cooperation loop | Orchestrator |
| `@actor` | Invoke Actor directly | Actor |
| `@critic` | Invoke Critic directly | Critic |
| `@researcher` | Invoke Researcher directly | Researcher |

## Configuration

Create `opencode-adversarial-cooperation.json` in your project root:

```json
{
  "models": {
    "actor": "anthropic/claude-sonnet-4-6",
    "critic": "anthropic/claude-opus-4-6",
    "orchestrator": "anthropic/claude-sonnet-4-6",
    "architect": "anthropic/claude-sonnet-4-6",
    "researcher": "anthropic/claude-sonnet-4-6"
  },
  "workflow": {
    "maxRetries": 3,
    "testCommand": "npm test"
  },
  "documents": {
    "minPrdLines": 300,
    "minSpecLines": 1200,
    "minTestLines": 500,
    "minAgentSpecLines": 150
  },
  "features": {
    "architectAgent": true,
    "autoSaveState": true,
    "testTracking": true
  },
  "prompts": {
    "actorAppend": "Additional instructions for Actor...",
    "criticAppend": "Additional instructions for Critic..."
  }
}
```

Config file search order:
1. `{project}/opencode-adversarial-cooperation.json` (highest priority)
2. `{project}/.opencode/opencode-adversarial-cooperation.json`
3. `~/.config/opencode/opencode-adversarial-cooperation.json` (global defaults)

## Additional Documentation

- **[Installation Guide](./docs/INSTALLATION.md)** -- Setup and symlink instructions
- **[Agent Definitions](./docs/AGENTS.md)** -- Detailed agent documentation
- **[Architecture Analysis](./docs/ARCHITECTURE_ANALYSIS.md)** -- System architecture deep dive
- **[Architect Improvements](./docs/ARCHITECT_IMPROVEMENTS.md)** -- Documentation generation design
- **[Multi-File Spec](./docs/MULTI_FILE_SPEC.md)** -- Numbered spec file approach
- **[Multi-File Test](./docs/MULTI_FILE_TEST.md)** -- Numbered test file approach
- **[Researcher Agent](./docs/RESEARCHER_AGENT.md)** -- Researcher agent design
- **[Researcher Design](./docs/RESEARCHER_DESIGN.md)** -- Detailed researcher architecture
- **[Researcher Usage](./docs/RESEARCHER_USAGE_PATTERNS.md)** -- How to use the researcher

## References

- Block AI Research. ["Adversarial Cooperation in Code Synthesis."](https://block.xyz/documents/adversarial-cooperation-in-code-synthesis.pdf) December 2025.
- [g3 -- Block's reference implementation](https://github.com/dhanji/g3)
- [OpenCode Documentation](https://opencode.ai/docs)
- [OpenCode Plugin Development](https://opencode.ai/docs/plugins/)

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT

## Links

- [GitHub Repository](https://github.com/kishb87/opencode-adversarial-cooperation)
- [Issue Tracker](https://github.com/kishb87/opencode-adversarial-cooperation/issues)
