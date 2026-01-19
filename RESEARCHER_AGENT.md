# Researcher Agent - Comprehensive Library Research

**Added**: 2026-01-18
**Status**: Implemented ✅

---

## What It Does

The @researcher agent conducts comprehensive research on libraries, frameworks, and technologies to inform spec generation with accurate, up-to-date information.

## Key Features

### 1. **Context7 Priority**
- Always tries Context7 first (official documentation)
- Falls back to web search only if needed
- Ensures most accurate, version-specific information

### 2. **Parallel Execution**
- Research multiple libraries simultaneously
- 10 libraries in 2-3 minutes vs 15-20 minutes sequentially
- Architect spawns all researchers at once

### 3. **Comprehensive Reports**
Each research report includes:
- Official documentation links and version info
- Installation and setup instructions
- Core concepts with code examples
- Best practices with rationale
- Common patterns (with pros/cons)
- Security considerations and mitigations
- Performance optimization tips
- Common pitfalls and solutions
- Complete, runnable example implementation
- Testing approach
- All sources cited

### 4. **Research Documentation**
Creates `.context/research.md` with:
- All research findings aggregated
- Integration patterns between libraries
- Technology decision rationale
- Security and performance summaries
- Comprehensive references

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

**Returns**: Comprehensive research report (500-800 lines)

---

## Research Process

### Step 1: Context7 Search (ALWAYS FIRST)

```
Try Context7 for:
  - Official documentation
  - API references
  - Migration guides
  - Best practices

If found → Use as primary source
If not found → Proceed to web search
```

### Step 2: Web Search - Official Docs

```
Queries:
  - "[Library] official documentation 2026"
  - "[Library] API reference"
  - "[Library] getting started guide"

Extract:
  - Latest version
  - Installation commands
  - Core concepts
```

### Step 3: Web Search - Best Practices

```
Queries:
  - "[Library] best practices 2026"
  - "[Library] production setup"
  - "[Library] security best practices"

Extract:
  - Recommended patterns
  - Configuration tips
  - Security considerations
```

### Step 4: Web Search - Pitfalls

```
Queries:
  - "[Library] common mistakes"
  - "[Library] gotchas"
  - "[Library] pitfalls to avoid"

Extract:
  - Common errors
  - Antipatterns
  - Migration issues
```

### Step 5: Web Search - Use Case

```
Queries:
  - "[Library] [use case] example 2026"
  - "[Library] [pattern] implementation"

Extract:
  - Real-world examples
  - Integration code
  - Complete implementations
```

### Step 6: Synthesis

Compile all findings into structured report with:
- Summary
- Complete code examples
- Confidence assessment
- References to all sources

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
