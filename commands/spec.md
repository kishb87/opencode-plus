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

- Minimum 500 lines (target 800-1200)
- Complete database schemas with CREATE TABLE statements
- Full API specifications with:
  - Endpoint definitions
  - Request/response types (TypeScript/JSON schema)
  - Authentication/authorization requirements
  - Error responses
- Architecture diagrams (ASCII or Mermaid)
- Complete file/folder structure
- Technology stack with justifications
- Data models and relationships
- Security considerations
- Performance requirements
- Deployment architecture

## Output Location

Write to: `.context/spec.md`

## Process

1. Read and analyze `@.context/prd.md`
2. Ask clarifying technical questions if needed
3. Design the architecture
4. Document all technical details section by section
5. Include concrete, runnable examples (not pseudocode)
6. Validate completeness against PRD requirements

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
