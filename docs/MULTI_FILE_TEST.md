# Multi-File Test Documentation (Numbered, Chunked)

**Date**: 2026-01-18
**Problem**: Single test.md file causes timeouts + no research for testing libraries
**Solution**: Numbered chunk files (~500 lines each) + research phase for testing libraries

---

## Why Multi-File Test Documentation?

### Problem with Single test.md

```
Architect writing test.md:
  ↓
No research on testing frameworks (guesses patterns)
Writes 400 lines... 800 lines... 1200 lines...
  ↓
Tool call timeout at ~1500 lines
  ↓
Partial test docs, missing critical test types
Can't document comprehensive test suites
```

### Solution with Numbered Chunks + Research

```
Architect generating test docs:
  ↓
Phase 1: Research testing libraries
  - Spawn @researcher for Jest, Testing Library, Supertest, etc.
  - Collect best practices, patterns, syntax
  - Update research.md with findings
  ↓
Phase 2: Write test/ directory
  - README.md (testing strategy roadmap, 250 lines) ✅
  - 001.md (framework setup, 420 lines) ✅
  - 002.md (test fixtures, 540 lines) ✅
  - 003.md (unit tests part 1, 550 lines) ✅
  - 004.md (unit tests part 2, 530 lines) ✅
  - 005.md (integration tests, 610 lines) ✅
  - TOC.md (file→topic mapping, 80 lines) ✅
  ↓
Each file completes successfully
  ↓
Total: 2,980 lines of comprehensive, research-based test documentation
```

**Benefits**:
- ✅ Research-informed (test patterns from library docs)
- ✅ No timeouts (each file ~500 lines)
- ✅ Unlimited documentation
- ✅ Complete, runnable test code (not pseudocode)
- ✅ Flexible (simple vs complex test suites)

---

## File Structure

```
.context/
├── prd.md                      # Product Requirements
├── research.md                 # Library research (includes testing section)
├── spec/                       # Technical Specification
│   ├── README.md
│   ├── 001.md through XXX.md
│   └── TOC.md
├── test/                       # Test Specification (NUMBERED CHUNKS)
│   ├── README.md              # Testing strategy roadmap
│   ├── 001.md                 # First test topic (~400-600 lines)
│   ├── 002.md                 # Second test topic (~400-600 lines)
│   ├── 003.md                 # Third test topic (~400-600 lines)
│   ├── ...                    # As many files as needed
│   ├── 008.md                 # Example: 8th file
│   └── TOC.md                 # File→topic mapping (created last)
└── agent-spec.md               # Agent Principles
```

**Total test lines**: Unlimited! (typically 1000-5000+ across all files)

---

## File Breakdown

### 1. README.md (Testing Strategy Roadmap)
**Purpose**: Entry point listing all testing topics to be covered
**Size**: 150-300 lines

**Contains**:
- Testing philosophy and TDD approach
- List of ALL testing topics that will be documented
- Quick reference (framework, tools, coverage goals)
- Link to research.md#testing-libraries

**Example**:
```markdown
# Test Specification

**Project**: REST API with Authentication
**Testing Framework**: Jest (from research)

## Overview
[2-3 paragraphs on testing philosophy]

## Topics to Cover
1. Testing Strategy - Philosophy, TDD workflow, coverage goals
2. Framework Setup - Jest configuration, test runner
3. Test Data & Fixtures - Factories, builders, mock data
4. Unit Tests - Core functions, services, utilities
5. Integration Tests - API endpoints, database operations
6. Test Utilities - Helpers, mocks, stubs

## Quick Reference
**Framework**: Jest 29
**Assertion**: expect (Jest built-in)
**Mocking**: jest.mock, jest.fn
**API Testing**: Supertest
**Coverage**: Istanbul (c8)
```

### 2. Numbered Files (001.md, 002.md, 003.md, ...)
**Purpose**: Document each testing topic comprehensively in ~500 line chunks
**Size**: ~400-600 lines per file

**Example for Backend API Project** (5 files, 2,450 lines):
- `001.md` - Testing Strategy & Framework Setup (480 lines)
  - TDD philosophy
  - Jest configuration
  - Test runner setup
  - Directory structure

- `002.md` - Test Data, Fixtures & Factories (520 lines)
  - User factory examples
  - Mock data builders
  - Database seeding
  - Fixture patterns from research

- `003.md` - Unit Tests Part 1: Core Functions (550 lines)
  - Authentication utilities tests
  - Validation function tests
  - Helper function tests
  - Complete Jest syntax from research

- `004.md` - Unit Tests Part 2: Services (490 lines)
  - UserService tests
  - AuthService tests
  - Mocking patterns from research

- `005.md` - Integration Tests: API Endpoints (410 lines)
  - Supertest setup (from research)
  - POST /api/auth/register tests
  - POST /api/auth/login tests
  - Complete request/response assertions

**Example for Full-Stack Project** (8 files, 4,100 lines):
- `001.md` - Testing Strategy (380 lines)
- `002.md` - Framework Setup (Jest backend, Vitest frontend) (420 lines)
- `003.md` - Test Data & Fixtures (540 lines)
- `004.md` - Backend Unit Tests Part 1 (550 lines)
- `005.md` - Backend Unit Tests Part 2 (530 lines)
- `006.md` - Backend Integration Tests (610 lines)
- `007.md` - Frontend Component Tests (Testing Library from research) (490 lines)
- `008.md` - E2E Tests (Playwright from research) (580 lines)

**Each file contains**:
- Topic heading
- COMPLETE, RUNNABLE test code (based on research)
- Actual framework syntax (Jest/Vitest/pytest/etc.)
- Setup, teardown, assertions
- Mock/stub examples from research
- Success, failure, edge cases
- NO pseudocode

### 3. TOC.md (File→Topic Mapping)
**Purpose**: Map which files contain which testing topics (created LAST)
**Size**: 80-150 lines

**Example**:
```markdown
# Table of Contents

## File → Topic Mapping

### Testing Strategy
- **001.md** - Philosophy, TDD workflow, coverage goals

### Framework Setup
- **002.md** - Jest configuration, test runner

### Test Data & Fixtures
- **003.md** - Factories, builders, mock data

### Unit Tests
- **004.md** - Core functions and utilities
- **005.md** - Services and repositories

### Integration Tests
- **006.md** - API endpoint tests

### E2E Tests
- **007.md** - User flows with Playwright

## Navigation
To find test documentation:
1. Check this TOC for the file range
2. Open the numbered files
3. See README.md for testing strategy
```

---

## Research Phase (Critical!)

### Why Research Testing Libraries?

Without research:
- ❌ Architect guesses Jest/Vitest syntax
- ❌ Mock patterns may be outdated
- ❌ Missing best practices
- ❌ Test code may not run

With research:
- ✅ Current testing framework syntax
- ✅ Best practices from official docs
- ✅ Correct mocking/stubbing patterns
- ✅ All test code is runnable

### Research Process

#### Step 1: Identify Testing Libraries

Based on spec, identify:
- **Testing framework**: Jest, Vitest, Mocha, pytest, Go testing
- **Assertion library**: expect, Chai, assert
- **Mocking/stubbing**: jest.mock, Sinon, unittest.mock
- **API testing**: Supertest, MSW, httptest
- **E2E framework**: Playwright, Cypress, Selenium
- **Test utilities**: Testing Library, factory-bot
- **Database testing**: testcontainers, in-memory DBs
- **Coverage**: Istanbul, c8, coverage.py

#### Step 2: Spawn @researcher Agents in Parallel

For each library, spawn @researcher:
- Context7 first (priority)
- Web search fallback
- Returns 50-150 lines of raw data per library

#### Step 3: Update research.md

Add "## Testing Libraries" section to `.context/research.md`:

```markdown
## Testing Libraries

### Jest (Testing Framework)

**Official Documentation**:
- URL: https://jestjs.io/
- Version: 29.x

**Best Practices**:
1. Use describe blocks for organization
2. Clear test names with "it should..."
3. Setup/teardown with beforeEach/afterEach

**Common Gotchas**:
1. Async tests need async/await or return promise
2. Mock hoisting - mocks defined before imports

**Example Pattern**:
```javascript
describe('UserService', () => {
  beforeEach(() => {
    // setup
  });

  it('should create user with hashed password', async () => {
    // test
  });
});
```

### Supertest (API Testing)

[Similar detailed section from research]

### Testing Library (Component Testing)

[Similar detailed section from research]

[All testing libraries documented]
```

---

## How Architect Generates

### Writing Order

1. **Research Phase** (~2 minutes):
   - Identify testing libraries from spec
   - Spawn @researcher agents in parallel
   - Update research.md with testing section

2. **README.md** (testing strategy roadmap)

3. **001.md** (~500 lines covering first testing topic)

4. **002.md** (~500 lines continuing or starting next topic)

5. **...** (as many numbered files as needed)

6. **XXX.md** (final numbered file)

7. **TOC.md** (file→topic mapping, written LAST)

### Example Architect Process

```
User: /tdd/test-spec
  ↓
@architect:

  Phase 1: Research
  1. Identifies testing libs from spec: Jest, Supertest, Faker
  2. Spawns 3 @researcher agents in parallel
  3. Collects raw data (150 lines total)
  4. Updates .context/research.md with "Testing Libraries" section

  Phase 2: Write test/
  5. Writes README.md (testing strategy roadmap, 250 lines)
     - TDD philosophy
     - Topics to cover list
     - Quick reference
     - Link to research.md

  6. Writes 001.md (~480 lines)
     - Testing Strategy
     - Jest setup and configuration (from research)
     - Test runner configuration
     - Directory structure

  7. Writes 002.md (~520 lines)
     - Test Data & Fixtures
     - User factory with Faker (from research)
     - Mock builders
     - Database seeding patterns

  8. Writes 003.md (~550 lines)
     - Unit Tests: Core Functions
     - Complete Jest test examples
     - describe/it structure (from research)
     - Mocking examples with jest.fn

  9. Writes 004.md (~490 lines)
     - Unit Tests: Services
     - UserService tests
     - AuthService tests
     - jest.mock patterns (from research)

  10. Writes 005.md (~410 lines)
      - Integration Tests
      - Supertest setup (from research)
      - API endpoint tests
      - Complete request/response assertions

  11. Writes TOC.md (80 lines)
      - Maps each topic to file range

  ✅ Complete - 5 files, 2,730 lines, research-based, no timeouts!
```

---

## How Agents Reference Tests

### Actor References

When Actor implements code, they can reference specific test files:

```markdown
## Task: Implement User Registration

### Finding Test Requirements
1. Check @.context/test/TOC.md
   - Unit Tests: 003-004.md
   - Integration Tests: 005.md

2. Read relevant files:
@.context/test/003.md#user-validation - Validation test examples
@.context/test/005.md#post-auth-register - API test expectations
```

**Benefit**:
- TOC.md shows exactly which files contain relevant tests
- Actor sees complete, runnable test examples
- Test code uses correct framework syntax from research

### Critic References

When Critic validates implementation, they use test docs:

```markdown
## Validation Context

1. Check @.context/test/TOC.md for test requirements
2. Verify implementation matches test examples:
   - @.context/test/003.md - Expected unit test coverage
   - @.context/test/005.md - Expected API test behavior
```

---

## Migration Guide

### Old Single-File Approach

```
.context/
├── test.md  (500-1500 lines, timeouts, no research)
```

### New Multi-File Approach (Numbered Chunks)

```
.context/
├── research.md  (includes Testing Libraries section)
├── test/
│   ├── README.md
│   ├── 001.md
│   ├── 002.md
│   ├── 003.md
│   ├── ...
│   └── TOC.md
```

### For Existing Projects

If you have an existing `test.md`:

1. Run `/tdd/test-spec` again - Architect will research + create test/ folder
2. Manually split test.md into numbered files with TOC.md
3. Or keep test.md and create test/ for new work (both can coexist)

---

## Benefits Summary

| Aspect | Single test.md | Numbered Chunks + Research |
|--------|----------------|----------------------------|
| **Research** | ❌ No research, guessed patterns | ✅ Library research, correct syntax |
| **Timeouts** | ❌ Frequent at 1500+ lines | ✅ None (each file ~500 lines) |
| **Runnable** | ❌ May have pseudocode | ✅ All tests runnable (from research) |
| **Flexibility** | ❌ One size fits all | ✅ Simple (3 files) to complex (10+ files) |
| **Updates** | ❌ Rewrite entire file | ✅ Update specific numbered files |
| **Limit** | ❌ Can't exceed ~1500 lines | ✅ Unlimited (5000+ lines possible) |
| **Navigation** | ❌ Search through one big file | ✅ TOC.md shows file→topic mapping |

---

## Line Count Distribution

### Backend API Project (5 files, 2,730 lines):

```
README.md          :  250 lines (testing strategy roadmap)
001.md            :  480 lines (Strategy & Framework Setup)
002.md            :  520 lines (Test Data & Fixtures)
003.md            :  550 lines (Unit Tests Part 1)
004.md            :  490 lines (Unit Tests Part 2)
005.md            :  410 lines (Integration Tests)
TOC.md            :   30 lines (file→topic mapping)
─────────────────────────────────────────────────────
Total              : 2,730 lines (comprehensive test docs)
```

### Full-Stack Project (8 files, 4,180 lines):

```
README.md          :  280 lines (testing strategy)
001.md            :  380 lines (Testing Strategy)
002.md            :  420 lines (Framework Setup - Jest + Vitest)
003.md            :  540 lines (Test Data & Fixtures)
004.md            :  550 lines (Backend Unit Tests Part 1)
005.md            :  530 lines (Backend Unit Tests Part 2)
006.md            :  610 lines (Backend Integration Tests)
007.md            :  490 lines (Frontend Component Tests)
008.md            :  580 lines (E2E Tests with Playwright)
TOC.md            :  100 lines (comprehensive mapping)
─────────────────────────────────────────────────────
Total              : 4,480 lines across 10 files
```

**Can scale to 5,000+ lines for complex projects!**

---

## Summary

The numbered, chunked test documentation with research phase solves multiple problems:

1. **Research-informed**: Testing patterns based on library docs and best practices
2. **No timeouts**: Each file ~500 lines (fast generation)
3. **Unlimited documentation**: Can document extensive test suites
4. **Runnable code**: All test examples are complete and runnable (not pseudocode)
5. **Flexible**: Simple projects (3 files) to complex (10+ files)
6. **Clear navigation**: README roadmap + TOC mapping

**Example scale**:
- Simple backend: 3 files, 1,200 lines
- Backend API: 5 files, 2,700 lines
- Full-stack app: 8 files, 4,500 lines

**All generated successfully with research-based, runnable test code!**
