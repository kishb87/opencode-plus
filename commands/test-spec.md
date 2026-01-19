---
description: Generate a comprehensive Test Specification
agent: architect
---

# Generate Test Specification

Generate a detailed test specification with concrete, runnable test examples.

## Prerequisites

Before running this command, you should have:
- `.context/prd.md` - Product Requirements Document
- `.context/spec/` - Technical Specification (multi-file)

Reference with: `@.context/prd.md` and `@.context/spec/README.md` (or `.context/spec.md` if using single file)

## Requirements

- **Minimum 500 lines TOTAL (target 1000-3000+, no upper limit) across numbered files**
- **EVERY test type documented** - no shortcuts, no "..."
- Complete, runnable test examples (not pseudocode)
- Test coverage for:
  - **Unit tests** - Individual functions, components
  - **Integration tests** - API endpoints, database operations
  - **E2E tests** - Full user flows
- Test fixtures and mock data examples
- Test utilities and helpers
- Testing strategy and philosophy
- Performance/load test examples (if applicable)

## Output Location

Write to: `.context/test/` (multiple numbered files)

**Files created**:
- `README.md` - Testing strategy roadmap and overview
- `001.md`, `002.md`, `003.md`, ... - Numbered test documentation files (~500 lines each)
- `TOC.md` - File→topic mapping (created last)

**Number of files**: As many as needed (typically 3-10 depending on project complexity)
**Length per file**: ~400-600 lines (fast generation, no timeouts)
**Total documentation**: Unlimited (could be 1,000-5,000+ lines for complex projects)

## Process

### Phase 1: Testing Library Research (CRITICAL - Do This Before Writing)

#### Step 1.1: Identify Testing Technologies

Based on spec and project type, identify ALL testing libraries/tools needed:

**Categories to consider**:
- Testing framework (Jest, Vitest, Mocha, pytest, Go testing, etc.)
- Assertion library (Chai, expect, assert, etc.)
- Test runner configuration
- Mocking/stubbing (jest.mock, Sinon, unittest.mock, etc.)
- API testing (Supertest, MSW, httptest, etc.)
- E2E framework (Playwright, Cypress, Selenium, etc.)
- Test utilities (Testing Library, factory patterns, etc.)
- Database testing (testcontainers, in-memory DBs, etc.)
- Code coverage tools (Istanbul, c8, coverage.py, etc.)

**Show list to user for confirmation**:
```markdown
I'll research the following testing libraries:

**Testing Framework**:
- [Framework] - [Purpose]

**Testing Utilities**:
- [Library 1] - [Purpose]
- [Library 2] - [Purpose]

Proceed with research?
```

#### Step 1.2: Spawn Researchers in Parallel

For each testing library, invoke @researcher using the Task tool:

**IMPORTANT**: Spawn ALL researchers in PARALLEL (single message, multiple Task tool calls).

```markdown
I'll now research these testing libraries. This will take 1-2 minutes.
```

Each researcher will:
1. Try Context7 first (priority)
2. Fall back to web search if needed
3. Return raw data (50-150 lines)

#### Step 1.3: Collect Research Data

Wait for all researchers to complete.

You'll receive RAW data from each researcher:
- Context7 results (if found)
- Official docs URL and version
- Best practices
- Common patterns
- Testing gotchas

#### Step 1.4: Update or Create research.md

**If .context/research.md exists** (from spec generation):
- Add a new "## Testing Libraries" section
- Synthesize test library research into this section

**If .context/research.md doesn't exist**:
- Create it with testing library research

### Phase 2: Write Test Documentation (Numbered Chunks)

1. Read and analyze `@.context/prd.md` and `@.context/spec/`
2. Read synthesized testing research from `.context/research.md`
3. Write test documentation using numbered chunk approach
4. Include concrete, runnable test examples based on research
5. Validate coverage of all requirements

## Format (Numbered, Chunked Structure)

### Step 1: Write README.md (Testing Strategy Roadmap)

Create `.context/test/README.md` with testing topics to cover:

```markdown
# Test Specification

**Project**: [Project Name]
**Generated**: [Date]
**Testing Framework**: [From research]

## Overview

[2-3 paragraphs on testing philosophy and approach]

## Topics to Cover

Based on the spec, this test documentation will cover:

1. **Testing Strategy** - Philosophy, coverage goals, TDD workflow
2. **Framework Setup** - Configuration, tools, test runner
3. **Test Data & Fixtures** - Factories, builders, mock data
4. **Unit Tests** - Function/component tests with examples
5. **Integration Tests** - API, database, service integration
6. **E2E Tests** - Full user flows [if applicable]
7. **Test Utilities** - Helpers, mocks, stubs
8. **Performance Tests** - Load/stress tests [if applicable]
9. **Testing Conventions** - File naming, organization

[List ALL testing topics relevant to this project]

## Quick Reference

**Framework**: [From research]
**Test Runner**: [Choice]
**Assertion Library**: [Choice]
**Coverage Tool**: [Choice]

## Research

For testing library documentation and best practices, see [../research.md](../research.md#testing-libraries)
```

### Step 2: Write Numbered Files Sequentially

Write files `001.md`, `002.md`, `003.md`, etc., covering each testing topic sequentially.

**File Size**: ~400-600 lines per file (natural stopping points)

**Topics Spanning Multiple Files**: If a topic needs more than 600 lines, continue it in the next file.

**Example for Backend API Project** (5 files, 2,450 lines):
- `001.md` - Testing Strategy & Framework Setup (480 lines)
- `002.md` - Test Data, Fixtures & Factories (520 lines)
- `003.md` - Unit Tests Part 1: Core functions, utilities (550 lines)
- `004.md` - Unit Tests Part 2: Services, repositories (490 lines)
- `005.md` - Integration Tests: API endpoints (410 lines)

**Example for Full-Stack Project** (8 files, 4,100 lines):
- `001.md` - Testing Strategy (380 lines)
- `002.md` - Framework Setup & Configuration (420 lines)
- `003.md` - Test Data & Fixtures (540 lines)
- `004.md` - Backend Unit Tests Part 1 (550 lines)
- `005.md` - Backend Unit Tests Part 2 (530 lines)
- `006.md` - Backend Integration Tests (610 lines)
- `007.md` - Frontend Component Tests (490 lines)
- `008.md` - E2E Tests (580 lines)

**Writing Each File**:
```markdown
# [Topic Name]

[If continuation: "# [Topic Name] (continued from XXX.md)"]

[Write comprehensive test documentation for this chunk]

[Include complete, runnable test code - no pseudocode]

[Reference research.md for testing library patterns]

[If topic continues: "**Continued in [next file number].md**"]
```

### Step 3: Write TOC.md (File→Topic Mapping)

After ALL numbered files are written, create `.context/test/TOC.md`:

```markdown
# Table of Contents

## File → Topic Mapping

### Testing Strategy
- **001.md** - Complete

### Framework Setup
- **002.md** - Complete

### Test Data & Fixtures
- **003.md** - Complete

### Unit Tests
- **004.md** - Core functions and utilities
- **005.md** - Services and repositories

### Integration Tests
- **006.md** - API endpoints

[etc.]
```

## Example Quality

All test examples should be:
- ✅ **Complete** - Runnable without modification
- ✅ **Realistic** - Use actual data structures from spec
- ✅ **Clear** - Easy to understand and follow
- ✅ **Comprehensive** - Cover success, failure, edge cases

**Bad (pseudocode):**
```javascript
test('user login', () => {
  // test login logic
})
```

**Good (complete):**
```javascript
describe('POST /api/auth/login', () => {
  it('returns JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })

    expect(response.status).toBe(200)
    expect(response.body.token).toMatch(/^eyJ/)
    expect(response.body.user).toMatchObject({
      id: expect.any(String),
      email: 'test@example.com'
    })
  })

  it('returns 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Invalid credentials')
  })
})
```

## Benefits

✅ **No timeouts** - Each file ~500 lines (fast generation)
✅ **Unlimited** - Can document 50+ test suites if needed
✅ **Flexible** - Simple projects get 3 files, complex get 10+ files
✅ **Research-informed** - Testing patterns based on library best practices
✅ **Clear navigation** - README roadmap + TOC mapping

## Validation

Before finishing, ensure:
- [ ] README.md exists with testing strategy roadmap
- [ ] Numbered files (001.md, 002.md, etc.) cover all testing topics
- [ ] All API endpoints from spec have test examples
- [ ] All core functions have unit tests
- [ ] Critical user flows have E2E tests (if applicable)
- [ ] Test data fixtures are complete and realistic
- [ ] No pseudocode - all examples are runnable (based on research)
- [ ] Test utilities cover common patterns from research.md
- [ ] TOC.md exists mapping topics to files
- [ ] Total documentation is comprehensive (1000+ lines typically)

## User Input

$INPUT
