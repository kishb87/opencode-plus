# Architecture Analysis: Agent Handoff Patterns

**Date**: 2026-01-18
**Purpose**: Analyze handoff mechanisms in opencode-handoff and opencode-ralph-wiggum, compare to our opencode-tdd implementation, and make architectural recommendations.

---

## Executive Summary

After analyzing both plugins, **our current architecture is sound and aligns with industry best practices**. Our "fresh context" approach mirrors the Ralph Wiggum philosophy, and our use of OpenCode's native Task tool for subagent invocation is the correct pattern.

**Key Recommendations**:
1. ✅ **Keep** our current Actor-Critic handoff mechanism (via Orchestrator + Task tool)
2. ✅ **Keep** our fresh context philosophy for both agents
3. 💡 **Consider** adopting progress.md pattern for better visibility
4. 💡 **Consider** synthetic file injection for performance optimization (optional)

---

## Plugin Comparison Matrix

| Aspect | opencode-handoff | opencode-ralph-wiggum | opencode-tdd (Ours) |
|--------|------------------|----------------------|---------------------|
| **Primary Problem** | Session-to-session continuity | Autonomous iteration loops | TDD Actor-Critic workflow |
| **Handoff Scope** | Between separate sessions | No handoffs (filesystem state) | Within-session subagents |
| **Context Philosophy** | Frontload files + on-demand transcript | Fresh context per iteration | Fresh context per invocation |
| **State Management** | Session metadata + file refs | Filesystem + Git + progress.md | .tdd/state.json + filesystem |
| **Agent Communication** | Multi-channel (refs, files, prompts) | None (filesystem IS state) | Orchestrator mediates via prompts |
| **Complexity** | Medium (synthetic parts, hooks) | Simple (for loop + git) | Medium (orchestrator + subagents) |

---

## 1. opencode-handoff Plugin

### What It Does
Enables **session-to-session handoffs** by analyzing conversations, extracting relevant files, and creating new sessions with pre-loaded context.

### Handoff Mechanism
**Three-phase process**:
1. **Analysis**: `/handoff` command → AI extracts 8-15 relevant files + context
2. **Session Creation**: Creates new session with draft message containing:
   - Session reference: `Continuing from session sess_ABC...`
   - File annotations: `@src/foo.ts @src/bar.ts`
   - Handoff prompt: Key decisions, goals, context
3. **Auto-injection**: When draft is sent, `chat.message` hook:
   - Parses `@file` references
   - Injects files as synthetic parts (mimics Read tool output)
   - New session starts with files pre-loaded

### Key Innovation: Synthetic Part Injection
```typescript
// Injects files WITHOUT user seeing Read tool calls
await client.session.prompt({
  noReply: true,
  parts: [
    { type: "text", synthetic: true, text: "Called Read tool..." },
    { type: "text", synthetic: true, text: "<file>...</file>" }
  ]
})
```

This makes files appear in context as if manually read, eliminating "file archaeology" in new sessions.

### Philosophy
> "When an AI assistant starts a fresh session, it spends significant time exploring the codebase... This 'file archaeology' is wasteful when the previous session already discovered what matters."

**Generous context frontloading** - better to include extra files than miss critical ones.

### Two-Tier Context
- **Tier 1**: Handoff summary (immediate start)
- **Tier 2**: `read_session(sessionID)` tool (full transcript on demand)

---

## 2. opencode-ralph-wiggum Plugin

### What It Does
Implements **autonomous iteration loops** where the same static prompt is repeatedly executed until task completion.

### "Handoff" Mechanism (Radical Simplification)
**There are no handoffs.** Instead:

```bash
while true; do
  claude -p "$(cat PROMPT.md)"
done
```

Each iteration:
1. Starts with fresh context (no memory of previous attempts)
2. Reads `progress.txt/progress.md` to see what prior iterations accomplished
3. Reads Git history to understand work done
4. Continues the task
5. Updates progress file for next iteration
6. Commits work to Git

### Philosophy
> "No handoffs, no coordination, no state management between agents - **the filesystem IS the state and Git IS the memory**."

This is the **"for loop as orchestration strategy"** approach.

### Key Patterns

**Progress File Pattern**:
```markdown
# Progress

## Completed
- ✅ Implemented user authentication
- ✅ Added unit tests for auth service

## In Progress
- 🔄 Building product catalog API

## Next
- Add search functionality to catalog
- Write integration tests

## Blockers
- Need to decide on pagination strategy
```

Each iteration reads this, updates it, and commits.

**Fresh Context = Reliability**:
- Each iteration starts clean
- Prevents "context pollution" from failed attempts
- Disposable plans - regeneration costs one iteration
- Avoids cumulative hallucination

**Context Rotation**:
When context fills up:
1. Commit current work
2. Terminate agent
3. Spawn fresh agent
4. Read progress file + Git history
5. Continue

This is described as solving the "malloc/free problem" - treating context windows as disposable resources.

### Advanced Implementations

**Multi-Agent Ralph (alfredolopez80)**: 14 specialized agents in 12-step pipeline
**Ralph Orchestrator (mikeyobrien)**: Event-driven "hats" system with typed events
**But core pattern remains**: Static prompt + iteration + filesystem state

---

## 3. Our Current Implementation (opencode-tdd)

### What We Do
Implement a **TDD Actor-Critic workflow** where:
- **Orchestrator** coordinates the workflow (primary agent)
- **Actor** implements tasks following TDD (subagent, fresh context)
- **Critic** validates implementations (subagent, fresh context)

### Handoff Mechanism

**Architecture**:
```
Orchestrator (Primary Agent)
    ↓
    Prepares context package with @file references
    ↓
Invokes Actor via Task tool (Subagent)
    ↓
Actor implements task, returns result
    ↓
Orchestrator prepares validation context
    ↓
Invokes Critic via Task tool (Subagent)
    ↓
Critic validates, returns verdict
    ↓
Orchestrator processes verdict, updates state
    ↓
Loop or escalate
```

**Actor Context Package**:
```markdown
## Actor Context Package

### Base Context
@.context/prd.md
@.context/agent-spec.md
@tasks/TDD_4.md

### Current Task
Implement authentication service

### Existing Code Context
- src/utils/jwt.ts - JWT utilities
- src/modules/users/user.repository.ts - User data access

[If retry: Critic feedback from previous attempt]
```

**Critic Context Package**:
```markdown
## Critic Context Package

### Base Context
@.context/prd.md
@.context/agent-spec.md
@tasks/TDD_4.md (test_scope section only)

### What to Validate
Run tests in test_scope:
- tests/unit/auth/auth.service.test.ts (owns)
- tests/unit/shared/errors.test.ts (must_pass)
```

**State Management**: `.tdd/state.json`
```json
{
  "workflow_phase": "in_progress",
  "current_task": "TDD_4",
  "current_attempt": 2,
  "completed_tasks": ["TDD_1", "TDD_2", "TDD_3"],
  "last_critic_feedback": "2 tests failing..."
}
```

### Our Philosophy
**Fresh Context for Both Agents**:
> "Both Actor and Critic receive fresh context each invocation. This aligns with 'Adversarial Cooperation' research:
> - No accumulated bias
> - No context bloat over many tasks
> - Tasks must be self-contained"

This is nearly identical to Ralph Wiggum's philosophy!

### How We Handle Handoffs
1. **Orchestrator → Actor**: Via Task tool with context package in prompt
2. **Actor → Orchestrator**: Actor returns, Orchestrator reads filesystem changes
3. **Orchestrator → Critic**: Via Task tool with validation context in prompt
4. **Critic → Orchestrator**: Critic returns verdict in response

**No direct Actor-Critic communication** - Orchestrator mediates everything.

---

## Architectural Analysis

### Our Approach vs Ralph Wiggum

**Similarities** (validates our design):
- ✅ Fresh context per invocation
- ✅ Filesystem as state (we use .tdd/state.json + task files)
- ✅ Git history as memory
- ✅ No persistent agent memory across invocations
- ✅ Self-contained task definitions

**Differences**:
- **We use**: Orchestrator mediating between Actor/Critic
- **Ralph uses**: Single agent iterating on static prompt
- **We have**: Explicit validation step (Critic)
- **Ralph has**: Implicit validation (tests passing = done)

**Why we need an Orchestrator**:
- Ralph's pattern works for **single-agent autonomous loops**
- We have **two agents with different roles** (implement vs validate)
- Orchestrator provides **separation of concerns** (implementation vs validation)
- This prevents Actor from "grading its own homework"

### Our Approach vs opencode-handoff

**Key Difference**: Different problem spaces
- **Handoff solves**: Session-to-session continuity (temporal handoff)
- **We solve**: Within-session role handoff (architectural handoff)

**Handoff's innovations not applicable to us**:
- Synthetic part injection: Optimizes **new session startup**, but we're already in an active session
- Session references: Links **separate sessions**, but our agents are in the same session
- read_session tool: Retrieves **past session transcripts**, but we have state.json

**What we could borrow**:
- **Generous file inclusion philosophy**: Their "8-15 files, cost is low" thinking
- **Synthetic parts for pre-loading**: Could inject files into Actor/Critic context before invocation (performance optimization)

### Is Our Handoff Mechanism Correct?

**Yes. Here's why**:

1. **Uses OpenCode's Native Pattern**
   We use the Task tool with `subagent_type` - this is OpenCode's official way to invoke subagents.

2. **Follows Fresh Context Best Practices**
   Both Ralph and Handoff emphasize fresh context. We do this correctly.

3. **Proper Separation of Concerns**
   Actor = implement, Critic = validate, Orchestrator = coordinate. Clean architecture.

4. **State Management Aligns with Ralph Philosophy**
   We use filesystem (.tdd/state.json, task files) + Git, not agent memory.

5. **Context Passing Matches OpenCode Patterns**
   Using `@file` references in prompts is OpenCode's native syntax, used by Handoff plugin too.

---

## Recommendations

### ✅ KEEP (No Changes Needed)

1. **Orchestrator-Actor-Critic Architecture**
   This is the right pattern for our use case. Ralph's single-agent loop wouldn't provide independent validation.

2. **Fresh Context Philosophy**
   Validated by both plugins. Keep our "fresh context per invocation" design.

3. **Task Tool for Subagent Invocation**
   This is OpenCode's official mechanism. Correct approach.

4. **State in .tdd/state.json**
   Aligns with Ralph's "filesystem is state" philosophy. Good design.

5. **Context Packages with @file References**
   Uses OpenCode's native syntax. Clean and maintainable.

### 💡 CONSIDER (Optional Enhancements)

#### 1. Add `progress.md` Pattern (Inspired by Ralph)

**Current**: State is in .tdd/state.json (machine-readable)
**Proposal**: Add .tdd/progress.md (human-readable)

```markdown
# TDD Workflow Progress

**Phase**: In Progress
**Current Task**: TDD_4 - Implement Auth Service
**Attempt**: 2/3

## Completed Tasks
- ✅ TDD_1: Shared error types
- ✅ TDD_2: User repository
- ✅ TDD_3: JWT utilities

## Current Work
- 🔄 TDD_4: Auth service implementation
  - Last attempt failed: 2 tests failing in auth.service.test.ts
  - Critic feedback: "Password hashing not implemented correctly"

## Upcoming
- TDD_5: Auth controller
- TDD_6: Auth routes
- ...

## Learnings
- Use bcrypt.hash with salt rounds = 10
- JWT tokens should expire in 1 hour
```

**Benefits**:
- Human-readable progress tracking
- Better debugging (can read progress.md directly)
- Aligns with Ralph's "visibility through filesystem" principle
- Orchestrator could read this instead of just state.json for better context

**Implementation**:
- Update Orchestrator to write progress.md after each task
- Include progress.md in Actor/Critic context packages
- Keep state.json for machine state, progress.md for human/AI narrative

#### 2. Synthetic File Pre-loading (Inspired by Handoff)

**Current**: Actor/Critic receive `@file` references, read them on-demand
**Proposal**: Orchestrator pre-injects files before invoking subagents

**Potential benefits**:
- Faster subagent startup (files already loaded)
- Guaranteed context (files can't be skipped)

**Potential downsides**:
- More complex implementation
- May not be necessary (OpenCode handles @file efficiently)
- Could waste tokens if agent doesn't need all files

**Verdict**: Not recommended unless we see performance issues.

#### 3. Enhanced Context Preparation Hook

Add a `chat.params` hook to inject TDD context into all agents automatically:

```typescript
"chat.params": async (input, output) => {
  if (input.agent === "actor" || input.agent === "critic") {
    // Auto-inject TDD context without Orchestrator manually including it
  }
}
```

**Benefit**: DRY - don't repeat context prep in Orchestrator prompts
**Downside**: Less explicit, harder to debug
**Verdict**: Current explicit approach is clearer.

### ❌ DO NOT CHANGE

1. **Don't adopt Ralph's single-agent loop**
   We need Actor-Critic separation for independent validation.

2. **Don't eliminate the Orchestrator**
   It provides essential coordination and retry logic.

3. **Don't switch to session-to-session handoffs**
   Our workflow is within-session by design.

4. **Don't use static prompts like Ralph**
   Our prompts need to adapt (retry context, different tasks, etc.).

---

## Conclusion

**Our architecture is sound.** The analysis of handoff and ralph-wiggum plugins validates our design decisions:

1. ✅ **Fresh context** - Best practice, we do it correctly
2. ✅ **Filesystem state** - Aligns with Ralph philosophy
3. ✅ **Task tool invocation** - OpenCode's official pattern
4. ✅ **Orchestrator mediation** - Necessary for multi-agent roles
5. ✅ **@file references** - Native OpenCode syntax

**Optional enhancement**: Add `progress.md` for better visibility and human readability, inspired by Ralph Wiggum's progress tracking pattern.

**No breaking changes needed.** The handoff mechanisms in both studied plugins solve different problems than ours, and our approach is already aligned with industry best practices.

---

## References

- [joshuadavidthomas/opencode-handoff](https://github.com/joshuadavidthomas/opencode-handoff) - Session-to-session handoff plugin
- [Th0rgal/opencode-ralph-wiggum](https://github.com/Th0rgal/opencode-ralph-wiggum) - Autonomous iteration loop plugin
- [anthropics/claude-code (Ralph Wiggum official)](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) - Official Ralph implementation
- Our Actor agent: `src/agents/actor.ts`
- Our Critic agent: `src/agents/critic.ts`
- Our Orchestrator agent: `src/agents/orchestrator.ts`
