---
description: Generate a comprehensive Technical Specification
agent: architect
---

# Generate Technical Specification

Generate a detailed technical specification for this project.

## Prerequisites

Before running this command, you should have:
- `.context/prd.md` - Product Requirements Document

Reference the PRD with: `@.context/prd.md`

## Requirements

- **Minimum 1200 lines** (target 1500-3000+)
- **EVERY implementation detail documented** - no shortcuts, no "..."
- Complete database schemas with CREATE TABLE statements:
  - EVERY column with type and constraints
  - EVERY index and foreign key
- Full API specifications with:
  - EVERY endpoint fully documented (not "and 10 more endpoints")
  - Complete request/response types (TypeScript/JSON schema)
  - ALL validation rules
  - ALL error codes
  - Example requests and responses
  - Authentication/authorization requirements
- Architecture diagrams (ASCII or Mermaid)
- Complete file/folder structure
- Technology stack with justifications
- Data models and relationships (ALL fields, not "other fields...")
- Security considerations
- Performance requirements
- Deployment architecture

## Output Location

Write to: `.context/spec.md`

## Process

### Phase 1: Requirements & Library Identification
1. Read and analyze `@.context/prd.md`
2. Ask clarifying technical questions if needed
3. Identify libraries and technologies needed
4. Confirm library list with you

### Phase 2: Comprehensive Research
1. Spawn @researcher agents in parallel for each library
2. Each researcher uses Context7 (priority) + web search
3. Collect comprehensive research reports (2-3 minutes)
4. Write `.context/research.md` with all findings

### Phase 3: Spec Writing
1. Design the architecture using research findings
2. Document all technical details section by section
3. Reference research.md for patterns and best practices
4. Include concrete, runnable examples (not pseudocode)
5. Validate completeness against PRD requirements

## Outputs

This command generates TWO files:

1. **`.context/research.md`** - Comprehensive library research
   - All library documentation, best practices, patterns
   - Security and performance considerations
   - Integration examples
   - Common pitfalls and solutions

2. **`.context/spec.md`** - Technical specification
   - Architecture and tech stack decisions (with research references)
   - Complete database schemas
   - Full API specifications
   - Implementation details

## Format

```markdown
# Technical Specification

## 1. Architecture Overview
[High-level architecture diagram and explanation]

## 2. Technology Stack
[Chosen technologies with rationale]

## 3. Database Schema
[Complete CREATE TABLE statements]

## 4. API Specification
[All endpoints with full request/response types]

## 5. File Structure
[Complete project layout]

## 6. Data Models
[TypeScript interfaces, types, validation schemas]

## 7. Security & Authentication
[Auth flow, permissions, security measures]

## 8. Performance & Scalability
[Optimization strategies, caching, etc.]

## 9. Deployment
[Infrastructure, CI/CD, monitoring]
```

## Validation

Before finishing, ensure:
- [ ] All PRD features have technical implementation details
- [ ] Database schema is complete and normalized
- [ ] All API endpoints are fully specified
- [ ] No "TBD" or placeholder sections
- [ ] Code examples are complete and runnable
- [ ] File structure maps to actual implementation

## User Input

$INPUT
