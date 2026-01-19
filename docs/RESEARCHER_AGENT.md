# Researcher Agent - Lightweight Documentation Fetcher

**Added**: 2026-01-18
**Status**: Implemented ✅
**Type**: Lightweight data fetcher (not synthesizer)

---

## What It Does

The @researcher agent is a **lightweight documentation fetcher** that quickly retrieves raw docs and search results. It does NOT write long reports - it fetches data in 30-60 seconds and returns it to the calling agent for synthesis.

**Used by**:
- @architect - For comprehensive library research before writing specs
- @actor - When stuck implementing and needs to look up APIs
- @critic - When validating and needs to verify best practices

## Key Features

### 1. **Fast Data Fetching**
- Returns in 30-60 seconds (not 5-10 minutes)
- Fetches raw data only, no synthesis
- Output: 50-150 lines (not 500-800)
- Multiple researchers can run in parallel

### 2. **Context7 Priority**
- Always tries Context7 first (official documentation)
- Falls back to 2-3 targeted web searches only if needed
- Ensures most accurate, version-specific information

### 3. **Lightweight Output**
Each researcher returns RAW data:
- Context7 docs (if found, pasted as-is)
- Official docs URL and version
- Top 3-5 best practice findings (raw)
- Top 3-5 common gotchas (raw)
- Source URLs

NO synthesis, NO code examples, NO long analysis - just raw facts.

### 4. **Used by Multiple Agents**

**@architect** - Upfront research before writing specs
- Spawns 5-10 researchers in parallel
- Synthesizes raw data into `.context/research.md`
- Uses findings to write accurate specs

**@actor** - On-demand when stuck implementing
- Single researcher for specific problem
- Gets quick answer to unblock work
- Example: "How do I use bcrypt?"

**@critic** - On-demand when validating
- Single researcher to verify best practices
- Gets authoritative answer for feedback
- Example: "Are 8 bcrypt rounds secure?"

---

## Usage

### Automatic (via /tdd/spec)

```bash
# Architect automatically researches all needed libraries
/tdd/spec "Build REST API using Fastify and Drizzle ORM"
```

**What happens**:
1. Architect identifies libraries: Fastify, Drizzle, PostgreSQL, Vitest, etc.
2. Confirms list with you
3. Spawns 5-10 @researcher agents in parallel
4. Waits 2-3 minutes for research
5. Writes `.context/research.md` with findings
6. Writes `.context/spec.md` referencing research

### Manual (standalone research)

```bash
# Research a specific library
/tdd/research "Prisma ORM for PostgreSQL multi-tenant SaaS"

# Research with specific context
/tdd/research "Fastify web framework with WebSocket support and rate limiting"

# Research integration pattern
/tdd/research "Drizzle ORM with Fastify and PostgreSQL connection pooling"
```

**Returns**: Raw research data (50-150 lines) in 30-60 seconds

### Actor Uses (When Stuck)

**Scenario**: Actor implementing JWT auth, tests failing

Actor invokes researcher from within their work:
```typescript
// Tests failing with "jwt.sign is not a function"
// Actor uses Task tool:
//   subagent_type: "researcher"
//   prompt: "jsonwebtoken library usage Node.js"

// Researcher returns in 30-60 sec:
// - Official docs URL
// - Correct usage: jwt.sign(payload, secret, { expiresIn: '1h' })
// - Common gotchas

// Actor fixes code based on research
```

### Critic Uses (When Validating)

**Scenario**: Critic reviewing bcrypt implementation

Critic invokes researcher to verify:
```typescript
// Code uses: bcrypt.hash(password, 8)
// Critic unsure if secure, uses Task tool:
//   subagent_type: "researcher"
//   prompt: "bcrypt rounds security best practices 2026"

// Researcher returns in 30-60 sec:
// - Recommended: 10+ rounds minimum
// - 8 rounds considered too low for 2026

// Critic provides specific feedback with source
```

---

## Research Process (FAST - 30-60 seconds)

### Step 1: Try Context7 (ALWAYS FIRST)

```
Search Context7 for the library documentation

If found → Paste relevant excerpts
If not found → Proceed to Step 2
```

**Time**: 5-10 seconds

### Step 2: Web Search (2-3 Targeted Queries)

Run ONLY these searches:

```
Query 1: "[Library] official documentation 2026"
  → Get docs URL, version, installation

Query 2: "[Library] best practices 2026"
  → Get top 3-5 best practice findings

Query 3: "[Library] common gotchas"
  → Get top 3-5 pitfall findings
```

**Time**: 20-50 seconds

### Step 3: Return Raw Data

```
NO synthesis
NO code examples created
NO analysis
JUST paste the raw findings
```

**Output format**:
```markdown
# [Library] Research Data

## Context7 Results
[Paste if found / "Not found"]

## Official Documentation
- URL: [url]
- Version: [version]
- Installation: [command]

## Best Practices (Raw)
[Paste top 3-5 findings]

## Common Gotchas (Raw)
[Paste top 3-5 findings]

## Sources
[URLs]
```

**Total time**: 30-60 seconds

---

## Example Workflow

### Scenario: Building a REST API

**User runs**:
```
/tdd/spec "Build REST API with authentication and real-time notifications"
```

**Architect flow**:

1. **Reads PRD**, asks clarifying questions:
   ```
   I need to understand your tech preferences:

   1. Web framework?
      a) Express (most popular)
      b) Fastify (fastest)
      c) Nest.js (enterprise)

   2. Database?
      a) PostgreSQL
      b) MySQL

   3. ORM preference?
      a) Prisma (dev experience)
      b) Drizzle (performance)

   4. Real-time approach?
      a) Socket.IO (full-featured)
      b) ws (lightweight)
   ```

2. **User responds**: Fastify, PostgreSQL, Drizzle, Socket.IO

3. **Architect identifies libraries**:
   ```
   I'll research these libraries:

   Core:
   - Fastify - Web framework
   - Drizzle ORM - Database access
   - PostgreSQL - Database

   Features:
   - Socket.IO - Real-time notifications
   - jsonwebtoken - JWT authentication
   - bcrypt - Password hashing
   - Zod - Validation

   Testing:
   - Vitest - Test framework

   Infrastructure:
   - Pino - Logging (Fastify default)

   Proceed with research?
   ```

4. **Spawns 9 researchers in parallel**:
   ```typescript
   // Single message with 9 Task tool calls
   Task(researcher, "Fastify web framework")
   Task(researcher, "Drizzle ORM for PostgreSQL")
   Task(researcher, "PostgreSQL connection pooling")
   Task(researcher, "Socket.IO with Fastify")
   Task(researcher, "JWT authentication security 2026")
   Task(researcher, "bcrypt password hashing")
   Task(researcher, "Zod validation with Fastify")
   Task(researcher, "Vitest testing framework")
   Task(researcher, "Pino logging with Fastify")
   ```

5. **Waits 2-3 minutes**, collects 9 comprehensive reports

6. **Writes `.context/research.md`** (3000+ lines):
   ```markdown
   # Research Findings

   ## Fastify
   [Full 500-line report]

   ## Drizzle ORM
   [Full 500-line report]

   ## Integration Patterns

   ### Fastify + Drizzle Setup
   [Complete code example from research]

   ### Fastify + Socket.IO Setup
   [Complete code example from research]

   ## Technology Decisions

   | Tech | Choice | Rationale |
   |------|--------|-----------|
   | Framework | Fastify | 2-3x faster than Express, better TypeScript... |
   | ORM | Drizzle | SQL-like, better performance than Prisma... |
   ```

7. **Writes `.context/spec.md`** using research:
   ```markdown
   # Technical Specification

   ## Technology Stack

   - **Framework**: Fastify 4.x (see research.md#fastify)
     - Chosen for performance (2-3x faster than Express)
     - Native TypeScript support
     - Plugin architecture aligns with requirements

   - **ORM**: Drizzle (see research.md#drizzle-orm)
     - SQL-like queries for performance
     - Type-safe schema definition
     - Better performance than Prisma (from benchmarks in research)

   ## Database Schema

   [Uses Drizzle schema syntax from research]

   ## API Specification

   [Uses Fastify route patterns from research]
   [Includes Zod validation from research]

   ## Security

   [Uses JWT + bcrypt patterns from research]
   [Implements security best practices found in research]
   ```

**Result**: Comprehensive, research-backed spec with accurate library usage

---

## Agents Overview

### @researcher
- **Mode**: Subagent (fresh context)
- **Tools**: WebSearch, WebFetch, Read, Grep (read-only)
- **Temperature**: 0.2 (factual)
- **Output**: 500-800 line research report

### @architect (updated)
- **Spawns**: Multiple @researcher agents in parallel
- **Creates**: research.md + spec.md
- **References**: research.md in spec.md decisions

---

## Benefits

### For Spec Quality
1. **Accuracy** - Uses current, correct library APIs
2. **Completeness** - All patterns, gotchas, security documented
3. **Best Practices** - Production-ready from day one
4. **Performance** - Optimization patterns baked in

### For Development Speed
1. **Fewer Corrections** - Actor gets accurate guidance
2. **Less Trial-and-Error** - Proven patterns documented
3. **Better Debugging** - Common pitfalls already documented

### For Knowledge Management
1. **Research Catalog** - Build library of research.md files
2. **Decision Rationale** - Understand why choices were made
3. **Onboarding** - New developers read research.md to understand stack

---

## Configuration

### Model Override (optional)

Use a faster/cheaper model for research:

```json
{
  "models": {
    "researcher": "anthropic/claude-haiku-4-20250514"
  }
}
```

Default: Uses your current session model

### Custom Research Instructions

Add custom instructions in config:

```json
{
  "prompts": {
    "researcherAppend": "Always check npm trends for popularity. Prioritize libraries with > 1M weekly downloads."
  }
}
```

---

## Files

- **Agent**: `src/agents/researcher.ts`
- **Command**: `commands/research.md`
- **Integration**: `src/agents/architect.ts` (Phase 1: Library Research)
- **Design Doc**: `RESEARCHER_DESIGN.md`

---

## Future Enhancements

### Research Caching
Cache research reports to avoid redundant searches:
```
.research-cache/
  prisma-orm-2026-01-18.md
  fastify-web-framework-2026-01-18.md
```

### Research Templates
Different templates for different domains:
- Library Research (default)
- Architecture Pattern Research
- Security Research
- Performance Research

### Confidence Scoring
Enhanced confidence assessments with source reliability ratings

---

## Summary

The Researcher agent transforms spec generation from "educated guessing" to "comprehensive research", resulting in:
- ✅ Accurate library usage
- ✅ Security best practices
- ✅ Performance optimization
- ✅ Complete documentation
- ✅ Fewer implementation errors
- ✅ Faster development cycles
