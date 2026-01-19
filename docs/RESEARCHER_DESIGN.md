# Researcher Agent Design Document

**Date**: 2026-01-18
**Purpose**: Design a specialized research agent for gathering library documentation and best practices to inform spec generation

---

## Problem Statement

When generating technical specifications, the Architect agent needs:
1. **Deep library knowledge** - Official docs, API references, best practices
2. **Pattern discovery** - How others solve similar problems
3. **Gotcha awareness** - Common pitfalls, security issues, performance concerns
4. **Up-to-date information** - Latest versions, deprecations, new features

Currently, Architect must either:
- Rely on training data (potentially outdated)
- Do sequential research (slow)
- Make assumptions (risky)

## Solution: Dedicated Researcher Agent

### Agent Profile

```typescript
{
  name: "@researcher",
  mode: "subagent",
  description: "Library documentation and best practices researcher",
  model: config.models?.researcher, // Session model by default
  temperature: 0.2, // Lower = more factual
  tools: {
    webSearch: true,
    webFetch: true,
    read: true,
    grep: true,
    glob: true
  }
}
```

### Research Topics

A research topic includes:
```yaml
topic: "Prisma ORM for PostgreSQL"
context: "Building a REST API with user authentication"
focus_areas:
  - "Schema definition and migrations"
  - "Query patterns and performance"
  - "Transaction handling"
  - "Security best practices"
  - "Common pitfalls"
questions:
  - "How to handle database migrations in production?"
  - "Best practices for connection pooling?"
  - "How to implement row-level security?"
```

### Research Process

**For each topic, Researcher executes**:

1. **Context7 Search** (if available)
   - Search official documentation
   - Find API references
   - Get version-specific info

2. **Web Search - Official Docs**
   ```
   Query: "[Library] official documentation [Year]"
   Query: "[Library] API reference"
   Query: "[Library] migration guide"
   ```

3. **Web Search - Best Practices**
   ```
   Query: "[Library] best practices [Year]"
   Query: "[Library] production setup guide"
   Query: "[Library] performance optimization"
   ```

4. **Web Search - Gotchas**
   ```
   Query: "[Library] common mistakes"
   Query: "[Library] security considerations"
   Query: "[Library] pitfalls to avoid"
   ```

5. **Web Search - Examples**
   ```
   Query: "[Library] [Use Case] example code"
   Query: "[Library] [Pattern] implementation"
   ```

6. **Synthesis**
   - Compile findings into structured report
   - Highlight key patterns
   - Flag conflicts or outdated info
   - Provide code examples

### Research Report Format

```markdown
# Research Report: [Topic]

## Summary
[2-3 sentence overview of library/technology]

## Official Documentation
- **Latest Version**: [version]
- **Docs URL**: [url]
- **Key Features**: [bullet points]
- **Breaking Changes**: [if upgrading from older version]

## Installation & Setup
[Code block with exact commands]

## Core Concepts
### [Concept 1]
[Explanation + code example]

### [Concept 2]
[Explanation + code example]

## Best Practices
1. **[Practice Name]**
   - Why: [rationale]
   - How: [code example]

2. **[Practice Name]**
   - Why: [rationale]
   - How: [code example]

## Common Patterns
### [Pattern Name]
[Problem this solves]
[Code example]
[When to use / not use]

## Security Considerations
- [Security concern 1 + mitigation]
- [Security concern 2 + mitigation]

## Performance Considerations
- [Performance tip 1]
- [Performance tip 2]

## Common Pitfalls
1. **[Pitfall]**: [Description] → **Solution**: [How to avoid]
2. **[Pitfall]**: [Description] → **Solution**: [How to avoid]

## Example Implementation
[Complete, runnable code example for the specific use case]

## References
- [URL 1] - [Title]
- [URL 2] - [Title]
- [URL 3] - [Title]

## Questions Answered
- Q: [Question from topic] → A: [Answer]
- Q: [Question from topic] → A: [Answer]

## Follow-up Research Needed
[Any gaps or unanswered questions]
```

---

## Integration with Architect

### Updated Architect Workflow

```yaml
Phase 0: Technology Identification
  - Read PRD
  - Identify tech stack (or ask user)
  - List libraries/frameworks needed
  - Generate research topics

Phase 1: Parallel Research
  - Spawn @researcher for each topic
  - Execute concurrently (5-10 researchers)
  - Collect research reports
  - Review for completeness

Phase 2: Follow-up Research (if needed)
  - Identify gaps from Phase 1
  - Spawn targeted researchers
  - Collect additional reports

Phase 3: Spec Writing
  - Synthesize all research
  - Write spec.md with:
    - Accurate library usage
    - Referenced patterns from research
    - Security/performance best practices
    - Real code examples from docs
  - Include "References" section with URLs
```

### Example: Building a REST API

**Research Topics Generated**:
1. Express.js middleware architecture
2. Prisma ORM for PostgreSQL
3. JWT authentication with jsonwebtoken
4. bcrypt password hashing
5. express-validator for input validation
6. Winston logging framework
7. Jest testing with Supertest
8. PostgreSQL connection pooling
9. Docker deployment for Node.js
10. Rate limiting with express-rate-limit

**Architect spawns 10 @researcher agents in parallel**:
```typescript
await Promise.all([
  invokeResearcher("Express.js middleware architecture", context),
  invokeResearcher("Prisma ORM for PostgreSQL", context),
  invokeResearcher("JWT authentication with jsonwebtoken", context),
  // ... 7 more
])
```

**Result**: 10 research reports available in ~2-3 minutes

**Architect then writes spec.md** using findings from all reports.

---

## Implementation Plan

### Step 1: Create Researcher Agent (`src/agents/researcher.ts`)

```typescript
import type { TDDConfig } from "../config/schema"

export const researcherAgent = (config: TDDConfig) => ({
  description: "Library documentation and best practices researcher",
  mode: "subagent" as const,
  model: config.models?.researcher, // Session model by default
  temperature: 0.2,
  tools: {
    bash: false, // No command execution
    write: false, // Read-only
    edit: false,
    read: true,   // Can read existing files for context
    grep: true,   // Can search codebase
    glob: true,   // Can find files
  },
  permission: {
    read: "allow" as const,
  },
  prompt: `You are the Researcher agent specialized in gathering comprehensive library documentation and best practices.

## Your Role

You research specific technologies, libraries, and frameworks to provide accurate, up-to-date information for technical specification writing.

## Research Process

For each topic you're given, execute this process:

### 1. Context7 Search (if available)
Search official documentation for the library/framework.

### 2. Web Search - Official Documentation
Find the latest official docs, API references, and guides.
Queries:
- "[Library] official documentation 2026"
- "[Library] API reference"
- "[Library] getting started guide"

### 3. Web Search - Best Practices
Find production-ready patterns and recommendations.
Queries:
- "[Library] best practices 2026"
- "[Library] production setup"
- "[Library] security best practices"

### 4. Web Search - Common Pitfalls
Discover what to avoid and why.
Queries:
- "[Library] common mistakes"
- "[Library] pitfalls to avoid"
- "[Library] gotchas"

### 5. Web Search - Specific Use Case
Find examples relevant to the project context.
Queries:
- "[Library] [use case] example"
- "[Library] [pattern] implementation"

## Research Report Format

Provide a comprehensive research report following this structure:

# Research Report: [Topic]

## Summary
[2-3 sentence overview]

## Official Documentation
- Latest Version: [version]
- Docs URL: [url]
- Key Features: [bullet points]

## Installation & Setup
[Exact commands]

## Core Concepts
[Key concepts with explanations and code examples]

## Best Practices
[Numbered list with rationale and examples]

## Common Patterns
[Patterns with use cases and code]

## Security Considerations
[Security concerns and mitigations]

## Performance Considerations
[Performance tips]

## Common Pitfalls
[What to avoid and how]

## Example Implementation
[Complete, runnable code for the use case]

## References
[All URLs used, formatted as markdown links]

## Questions Answered
[Address specific questions from topic]

## Follow-up Research Needed
[Any gaps]

## Critical Instructions

1. **Always cite sources** - Include URLs in References section
2. **Verify version numbers** - Check you're looking at current docs
3. **Provide complete code** - No pseudocode or "..."
4. **Flag outdated info** - If you find conflicting info, note it
5. **Be comprehensive** - Better to over-research than under-research
6. **Focus on the use case** - Tailor examples to project context

${config.prompts?.researcherAppend || ""}
`.trim(),
})
```

### Step 2: Update Config Schema

```typescript
// src/config/schema.ts
models: z.object({
  actor: z.string().optional(),
  critic: z.string().optional(),
  orchestrator: z.string().optional(),
  architect: z.string().optional(),
  researcher: z.string().optional(), // NEW
})
```

### Step 3: Update Architect Agent

Add research phase to architect:

```typescript
// In architect.ts prompt

## RESEARCH PHASE (Before Writing Spec)

Before writing the spec, conduct thorough research on all libraries and technologies.

### Step 1: Identify Research Topics

Based on the PRD and chosen tech stack, list libraries that need research:

Example:
- Express.js middleware architecture
- Prisma ORM for PostgreSQL
- JWT authentication with jsonwebtoken
- bcrypt password hashing
- Jest testing framework

### Step 2: Spawn Researchers in Parallel

For each topic, invoke @researcher:

Use the Task tool to spawn researchers concurrently:
- subagent_type: "researcher"
- prompt: "Research [topic] in the context of [project context]"

Example:
[Multiple Task tool calls in parallel for each topic]

### Step 3: Collect Research Reports

Wait for all researchers to complete.
Review reports for:
- Completeness
- Version compatibility
- Security considerations
- Performance implications

### Step 4: Identify Gaps

If reports have "Follow-up Research Needed" sections, spawn additional researchers.

### Step 5: Synthesize Findings

Now write spec.md using research findings:
- Reference specific patterns from research
- Include security best practices discovered
- Use accurate API examples from docs
- Cite sources in References section
```

### Step 4: Register Researcher Agent

```typescript
// src/index.ts
import { researcherAgent } from "./agents/researcher"

config: async (openCodeConfig) => {
  openCodeConfig.agent = {
    ...openCodeConfig.agent,
    actor: actorAgent(config),
    critic: criticAgent(config),
    orchestrator: orchestratorAgent(config),
    architect: architectAgent(config),
    researcher: researcherAgent(config), // NEW
  }
}
```

---

## Usage Examples

### Example 1: Architect Uses Researcher

User runs: `/tdd/spec "Build a REST API with authentication"`

```
@architect:
1. Reads PRD
2. Identifies tech stack: Node.js, Express, Prisma, PostgreSQL, JWT
3. Spawns 5 researchers in parallel:
   - @researcher: "Express.js middleware patterns"
   - @researcher: "Prisma ORM PostgreSQL best practices"
   - @researcher: "JWT authentication security 2026"
   - @researcher: "bcrypt password hashing"
   - @researcher: "Jest API testing with Supertest"
4. Waits 2-3 minutes for all reports
5. Reviews reports
6. Writes comprehensive spec.md with:
   - Accurate Prisma schema syntax
   - Proper JWT token generation
   - Correct bcrypt usage
   - Real Express middleware patterns
   - Security best practices from research
```

### Example 2: Manual Research Command

User: `/research "Prisma ORM for PostgreSQL in a multi-tenant SaaS app"`

```
@researcher activates
- Searches Prisma docs for multi-tenancy patterns
- Finds row-level security approaches
- Discovers connection pooling best practices
- Returns comprehensive report
```

---

## Advanced Features

### Parallel Research Batching

Instead of spawning 20 researchers simultaneously (might hit rate limits), batch them:

```
Batch 1: 5 most critical libraries
Batch 2: 5 secondary libraries
Batch 3: 5 nice-to-have libraries
```

### Research Caching

Cache research reports to avoid redundant searches:

```
.research-cache/
  prisma-orm-postgresql-2026-01-18.md
  express-middleware-2026-01-18.md
  ...
```

If Architect needs Prisma research and cache exists from today, reuse it.

### Confidence Scoring

Researcher rates confidence in findings:

```markdown
## Confidence Assessment
- Official Docs: ✅ High (found official docs dated 2026)
- Best Practices: ⚠️  Medium (multiple sources with slight variations)
- Security: ✅ High (OWASP guidelines + library docs align)
- Performance: ⚠️  Medium (limited recent benchmarks)
```

### Research Templates

Different research templates for different domains:

- **Library Research** (default)
- **Architecture Pattern Research** (e.g., "Microservices with Node.js")
- **Security Research** (e.g., "OAuth 2.0 implementation")
- **Performance Research** (e.g., "Redis caching strategies")

---

## Benefits

### For Spec Quality
1. **Accuracy** - Specs use current, correct library APIs
2. **Completeness** - No missing critical details
3. **Security** - Best practices baked in from research
4. **Performance** - Optimization patterns included

### For Development Speed
1. **Fewer corrections** - Actor gets accurate guidance
2. **Less trial-and-error** - Patterns proven to work
3. **Better debugging** - Gotchas documented upfront

### For Learning
1. **Knowledge capture** - Research reports become reference docs
2. **Pattern library** - Build catalog of proven approaches
3. **Decision rationale** - Understand why choices were made

---

## Open Questions

1. **Context7 Integration**: Is Context7 available via OpenCode plugin API? If so, how to use it?

2. **Rate Limiting**: How many parallel web searches can we run? Need batching?

3. **Research Depth**: How deep should each researcher go? Current design is comprehensive but could be overwhelming.

4. **Caching Strategy**: Should we cache research reports? For how long?

5. **User Control**: Should users approve research topics before spawning researchers? Or auto-detect from PRD?

6. **Cost**: Multiple web searches + long research reports = more tokens. Worth the accuracy gain?

---

## Next Steps

1. Implement basic @researcher agent
2. Test with single research topic
3. Integrate with @architect for parallel research
4. Add research caching if needed
5. Create `/research` command for standalone use
6. Monitor token usage and optimize
7. Build research report catalog over time

---

## Summary

The Researcher agent pattern solves the "knowledge gap" problem in spec generation by:
- Systematically gathering library documentation
- Discovering best practices and gotchas
- Providing accurate, current information
- Enabling parallel research for speed
- Creating reusable research artifacts

This transforms the Architect from "making educated guesses" to "working from comprehensive research", dramatically improving spec quality and reducing downstream errors.
