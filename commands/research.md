---
description: Research a library, framework, or technology comprehensively
agent: researcher
---

# Research Library or Technology

Conduct comprehensive research on a specific library, framework, or technology to gather:
- Official documentation
- Best practices
- Common pitfalls
- Security considerations
- Performance optimization
- Integration patterns
- Complete code examples

## Usage

```
/tdd/research "Prisma ORM for PostgreSQL multi-tenant SaaS"
/tdd/research "Fastify web framework with WebSocket support"
/tdd/research "Vitest testing framework with React Testing Library"
```

## Research Process

The @researcher agent will:

### 1. Context7 Search (Priority)
- Search official documentation in Context7
- Extract API references and guides
- Get version-specific information

### 2. Web Search (If needed)
- Official documentation and API references
- Production best practices and patterns
- Common mistakes and pitfalls
- Security considerations
- Performance optimization tips
- Real-world examples and integrations

### 3. Comprehensive Report

The researcher will provide a structured report including:
- **Summary** - Overview of the technology
- **Official Documentation** - Latest version, URLs, key features
- **Installation & Setup** - Exact commands and configuration
- **Core Concepts** - Fundamental concepts with code examples
- **Best Practices** - Production-ready patterns with rationale
- **Common Patterns** - Reusable patterns with pros/cons
- **Security Considerations** - Risks and mitigations
- **Performance Considerations** - Optimization strategies
- **Common Pitfalls** - What to avoid and why
- **Example Implementation** - Complete, runnable code for your use case
- **Testing Approach** - How to test code using this library
- **References** - All sources cited
- **Confidence Assessment** - How reliable the findings are

## Output

The research report will be comprehensive (500-800 lines) with:
- ✅ Complete, runnable code examples (not pseudocode)
- ✅ All sources cited with URLs
- ✅ Version numbers and deprecation warnings
- ✅ Security and performance best practices
- ✅ Real-world integration patterns

## When to Use

Use this command when:
- Evaluating a library before adopting it
- Need comprehensive documentation for implementation
- Want to understand best practices and gotchas
- Planning architecture and need library details
- @architect is generating spec and you want additional research
- Need to research integration patterns between libraries

## Example Output Structure

```markdown
# Research Report: Prisma ORM

**Researched**: 2026-01-18
**Context**: Multi-tenant SaaS application

## Summary
Prisma is a next-generation ORM that...

## Official Documentation
- Latest Stable Version: 5.9.1
- Documentation URL: https://www.prisma.io/docs
- Repository: https://github.com/prisma/prisma

## Installation & Setup
...complete setup instructions...

## Core Concepts
### Concept 1: Prisma Schema
...explanation with code...

## Best Practices
1. **Use transaction for multi-table operations**
   Why: Ensures data consistency...
   How: [complete code example]

## Common Pitfalls
1. **N+1 Query Problem**
   Problem: Loading relations without include causes...
   Solution: [code showing correct approach]

...comprehensive report continues...
```

## User Input

$INPUT
