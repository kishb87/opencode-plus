# Researcher Usage Patterns - All Agents

**Date**: 2026-01-18
**Summary**: @researcher is a lightweight data fetcher that can be used by @architect, @actor, and @critic

---

## Overview

The @researcher agent is a **fast documentation fetcher** (30-60 seconds) that retrieves raw data from Context7 and web searches. It doesn't write long reports - it just fetches and returns data for the calling agent to use.

**Key Characteristics**:
- ⚡ **Fast**: 30-60 seconds per fetch
- 📦 **Lightweight**: 50-150 line output (not 500+)
- 🎯 **Focused**: 2-3 targeted searches max
- 🔄 **Parallel**: Multiple researchers can run simultaneously
- 📝 **Raw data**: No synthesis, just facts

---

## Usage Pattern 1: Architect (Upfront Research)

**When**: Before writing specs
**Purpose**: Comprehensive library research
**Pattern**: Parallel batch research

### Flow

```
User: /tdd/spec "Build REST API with Fastify and Drizzle"
    ↓
@architect activates
    ↓
Identifies 8 libraries to research:
- Fastify, Drizzle, PostgreSQL, Vitest, Zod, JWT, bcrypt, Pino
    ↓
Spawns 8 @researcher agents IN PARALLEL
(single message with 8 Task tool calls)
    ↓
Each researcher:
  - Tries Context7 first
  - Does 2-3 web searches
  - Returns raw data (50-150 lines)
  - Takes 30-60 seconds
    ↓
All 8 return in ~1-2 minutes
    ↓
@architect receives 8 raw data reports
    ↓
@architect synthesizes into .context/research.md:
  - Organizes findings by library
  - Creates code examples from docs
  - Documents integration patterns
  - Writes 500-1000 line comprehensive guide
    ↓
@architect writes spec.md using research.md
```

### Example Raw Data (from researcher)

```markdown
# Fastify Research Data

## Context7 Results
Found Fastify documentation covering:
- Route registration and handlers
- Schema validation
- Plugin architecture
[Paste relevant Context7 excerpts]

## Official Documentation
- URL: https://fastify.dev/docs/latest
- Version: 4.26.0
- Installation: npm install fastify

## Best Practices (Raw)
- Use fastify.register() for plugins
- Validate inputs with JSON Schema
- Use async/await handlers
- Set up proper error handling
- Use Pino logger (built-in)

## Common Gotchas (Raw)
- Must await fastify.listen() in async
- Schemas must be registered before routes
- Plugin encapsulation can be confusing
- Reply sent twice if not careful

## Sources
- https://fastify.dev/docs/latest
- https://github.com/fastify/fastify/discussions
```

### Example Synthesized Output (by architect in research.md)

```markdown
## Fastify Web Framework

### Overview
Fastify is a fast and low overhead web framework for Node.js, chosen for its performance (2-3x faster than Express) and native TypeScript support.

### Official Documentation
- **URL**: https://fastify.dev/docs/latest
- **Version**: 4.26.0
- **Installation**: `npm install fastify`

### Key Concepts

#### 1. Route Registration
Fastify uses a plugin-based architecture where routes are registered using `fastify.register()`:

\`\`\`typescript
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

await fastify.listen({ port: 3000 })
\`\`\`

### Best Practices

1. **Use JSON Schema Validation**
   - Why: Automatic validation and documentation
   - Example: [code based on docs]

2. **Plugin Encapsulation**
   - Why: Isolate route scopes
   - Example: [code based on docs]

### Common Gotchas

1. **Reply Sent Twice**: Don't both return and call reply.send()
   - Solution: Choose one approach consistently

...
```

**Result**: Comprehensive, organized research.md ready for spec writing

---

## Usage Pattern 2: Actor (On-Demand When Stuck)

**When**: During implementation, when stuck
**Purpose**: Look up specific API or solve error
**Pattern**: Single focused research

### Flow

```
@actor implementing JWT authentication
    ↓
Writes test: expect(token).toMatch(/^eyJ/)
    ↓
Implements: const token = jwt.sign(payload, secret)
    ↓
Runs test: ❌ TypeError: jwt.sign is not a function
    ↓
Actor stuck - doesn't know correct API
    ↓
Actor invokes @researcher:
  Task tool, subagent_type: "researcher"
  Prompt: "jsonwebtoken library usage Node.js"
    ↓
@researcher fetches docs (30-60 sec):
  - Context7: jsonwebtoken docs
  - Web: Official GitHub README
  - Returns: import jwt from 'jsonwebtoken'
            token = jwt.sign(payload, secret, { expiresIn: '1h' })
    ↓
Actor sees correct usage
    ↓
Actor fixes: import jwt from 'jsonwebtoken' (was missing)
    ↓
Reruns test: ✅ Passes
    ↓
Continues implementation
```

### Example Actor Thought Process

```
Test failing:
  TypeError: jwt.sign is not a function

My code:
  const token = jwt.sign({ userId: user.id }, SECRET)

Problem: jwt.sign doesn't exist. Need to look up correct API.

Action: Invoke @researcher
  "jsonwebtoken library usage Node.js"

[Researcher returns in 45 seconds]

Research shows:
  - Import: import jwt from 'jsonwebtoken'
  - Usage: jwt.sign(payload, secret, options)
  - I forgot to import!

Fix:
  + import jwt from 'jsonwebtoken'
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' })

Test now passes ✅
```

**Benefit**: Actor self-recovers instead of failing task

---

## Usage Pattern 3: Critic (On-Demand for Validation)

**When**: During validation, unsure about best practice
**Purpose**: Verify security or best practices
**Pattern**: Single focused research

### Flow

```
@critic validating password hashing
    ↓
Reads code: bcrypt.hash(password, 8)
    ↓
Runs tests: ✅ All pass
    ↓
Critic thinks: "Is 8 rounds secure enough in 2026?"
    ↓
Critic invokes @researcher:
  Task tool, subagent_type: "researcher"
  Prompt: "bcrypt rounds security best practices 2026"
    ↓
@researcher fetches security info (30-60 sec):
  - Context7: bcrypt security docs
  - Web: OWASP recommendations
  - Web: Security advisories
  - Returns: Minimum 10 rounds recommended (2026)
            8 rounds considered too low
    ↓
Critic now has authoritative answer
    ↓
Critic returns verdict: ❌ FAIL
  Issue: Bcrypt rounds too low
  Current: 8 rounds
  Required: 10+ rounds (per OWASP 2026)
  Fix: Change to bcrypt.hash(password, 10)
  Source: Research shows modern recommendations
    ↓
Actor gets specific, sourced feedback
```

### Example Critic Validation Report (With Research)

```markdown
## Critic Validation Report

### Tests Run
✅ test/auth/register.test.ts - 5 passed
✅ test/auth/login.test.ts - 4 passed

### Validation Result: ❌ FAIL

### Issues Found

#### 1. Security: Insufficient Bcrypt Rounds

**File**: src/auth/hash.ts:12
**Current**: `bcrypt.hash(password, 8)`
**Required**: `bcrypt.hash(password, 10)`

**Rationale** (from research):
- Modern best practice: Minimum 10 rounds
- OWASP 2026 guideline: 10-12 rounds
- 8 rounds no longer considered secure
- Source: bcrypt security documentation

**Fix**:
\`\`\`typescript
// Change line 12
- const hash = await bcrypt.hash(password, 8)
+ const hash = await bcrypt.hash(password, 10)
\`\`\`

### Verdict
❌ FAIL - Fix security issue before proceeding
```

**Benefit**: Critic provides authoritative, sourced feedback

---

## Comparison: When Each Agent Uses Researcher

| Agent | When | Why | Pattern | Example |
|-------|------|-----|---------|---------|
| **@architect** | Before writing spec | Comprehensive library research | Parallel batch (5-10 researchers) | Research Fastify, Drizzle, Vitest, etc. |
| **@actor** | When stuck implementing | Look up API or solve error | Single focused research | "How do I use jwt.sign?" |
| **@critic** | When validating | Verify best practices | Single focused research | "Are 8 bcrypt rounds secure?" |

---

## Research Output Format (All Agents See This)

```markdown
# [Library/Topic] Research Data

## Context7 Results
[Paste Context7 docs if found]
[Or: "Not found in Context7"]

## Official Documentation
- **URL**: [official docs URL]
- **Version**: [latest version]
- **Installation**: [npm install command]
- **Key Info**:
  - [Bullet 1 from docs]
  - [Bullet 2 from docs]
  - [Bullet 3 from docs]

## Best Practices (Raw Search Results)
[Top 3-5 findings from "best practices" search]
- Practice 1...
- Practice 2...
- Practice 3...

## Common Gotchas (Raw Search Results)
[Top 3-5 findings from "gotchas" search]
- Gotcha 1...
- Gotcha 2...
- Gotcha 3...

## Sources
- [URL 1]
- [URL 2]
- [URL 3]
```

**Length**: 50-150 lines
**Time**: 30-60 seconds
**Content**: Raw data, no synthesis

---

## Key Benefits

### Speed
- **Before**: Sequential research took 30+ minutes
- **After**: Parallel research takes 1-2 minutes

### Self-Recovery
- **Actor stuck**: Can research and unblock themselves
- **Critic unsure**: Can research and provide authoritative feedback
- **Architect needs docs**: Gets comprehensive data quickly

### Accuracy
- **Context7 first**: Most accurate, version-specific docs
- **Web search fallback**: When Context7 doesn't have it
- **Source citations**: All findings include URLs

### Simplicity
- **Just fetch data**: Don't synthesize, don't analyze
- **Let caller decide**: Agent calling researcher knows what to do with data
- **Fast turnaround**: 30-60 seconds vs 5-10 minutes

---

## Configuration

### Model Override (Optional)

Use a faster/cheaper model for research:

```json
{
  "models": {
    "researcher": "anthropic/claude-haiku-4-20250514"
  }
}
```

Default: Uses your current session model

### When to Use Researcher

#### ✅ Use When:
- Actor: Tests failing with library API errors
- Actor: Unsure how to use a library
- Critic: Need to verify security best practices
- Critic: Validating a pattern you're unfamiliar with
- Architect: Before writing specs (always)

#### ❌ Don't Use When:
- Problem is logic error (not library usage)
- You can figure it out by reading existing code
- It's a simple typo or syntax error

---

## Summary

The @researcher agent is a **lightweight data fetcher** used by all agents to get quick, accurate documentation:

1. **@architect**: Batch parallel research (5-10 libraries) before spec writing
2. **@actor**: On-demand research when stuck on implementation
3. **@critic**: On-demand research when validating best practices

**Result**: Faster development, accurate implementations, authoritative validation.
