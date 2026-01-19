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
- **Document what's in the PRD** - don't inject requirements not mentioned
- Architecture diagrams (ASCII or Mermaid)
- Technology stack with justifications
- Complete file/folder structure
- **If PRD includes database**:
  - Complete schemas with CREATE TABLE statements
  - EVERY column with type and constraints
  - EVERY index and foreign key
- **If PRD includes API**:
  - EVERY endpoint fully documented (not "and 10 more endpoints")
  - Complete request/response types (TypeScript/JSON schema)
  - ALL validation rules
  - ALL error codes
  - Example requests and responses
- **If PRD mentions authentication**:
  - Auth flow and implementation details
- **If PRD mentions security requirements**:
  - Security considerations and implementation
- **If PRD mentions performance goals**:
  - Performance requirements and optimization strategies
- **If PRD mentions deployment**:
  - Deployment architecture
- Data models and relationships for ALL entities in the PRD (ALL fields, not "other fields...")

## Output Location

Write to: `.context/spec/` (multiple numbered files)

**Files created**:
- `README.md` - Topic roadmap and overview
- `001.md`, `002.md`, `003.md`, ... - Numbered topic files (~500 lines each)
- `TOC.md` - File→topic mapping (created last)

**Number of files**: As many as needed (typically 5-30 depending on project complexity)
**Length per file**: ~400-600 lines (fast generation, no timeouts)
**Total documentation**: Unlimited (could be 5,000-15,000+ lines for complex projects)

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

This command generates research findings and multi-file spec:

### 1. `.context/research.md` - Library Research
- All library documentation, best practices, patterns
- Security and performance considerations
- Integration examples
- Common pitfalls and solutions

### 2. `.context/spec/` - Technical Specification (Numbered, Chunked Files)

**Why numbered chunks?** Prevents timeouts by writing ~500 line files that generate quickly.

**Structure**:
- **README.md** - Topic roadmap (what will be covered)
- **001.md** through **XXX.md** - Numbered files covering each topic sequentially (~400-600 lines each)
- **TOC.md** - File→topic mapping (which files contain which topics)

**Flexibility**:
- Frontend project might have 6 files (2,500 lines total)
- Full-stack project might have 30 files (15,000 lines total)
- Topics can span multiple files (API Endpoints might be 003.md through 007.md)

**Benefits**:
- No timeouts (each chunk generates quickly)
- Unlimited total documentation
- Project-specific (only covers relevant topics)

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
