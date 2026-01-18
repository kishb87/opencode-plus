---
description: Generate a comprehensive Test Specification
agent: architect
---

# Generate Test Specification

Generate a detailed test specification with concrete, runnable test examples.

## Prerequisites

Before running this command, you should have:
- `.context/prd.md` - Product Requirements Document
- `.context/spec.md` - Technical Specification

Reference with: `@.context/prd.md` and `@.context/spec.md`

## Requirements

- Minimum 300 lines (target 400-600)
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

Write to: `.context/test.md`

## Process

1. Read and analyze `@.context/prd.md` and `@.context/spec.md`
2. Identify all testable components from the spec
3. Write actual test code examples using the project's testing framework
4. Include test data fixtures
5. Document testing patterns and conventions
6. Validate coverage of all requirements

## Format

```markdown
# Test Specification

## 1. Testing Philosophy & Strategy
[Approach, coverage goals, TDD workflow]

## 2. Testing Framework & Tools
[Jest/Vitest/pytest/etc., libraries, configuration]

## 3. Test Data & Fixtures
[Reusable test data, factories, builders]

## 4. Unit Tests
[Complete test examples for core functions/classes]

## 5. Integration Tests
[API endpoint tests, database tests, service integration]

## 6. E2E Tests
[Full user flow tests with setup/teardown]

## 7. Test Utilities & Helpers
[Reusable test helpers, mocks, stubs]

## 8. Performance Tests
[Load tests, stress tests if applicable]

## 9. Testing Conventions
[File naming, organization, patterns to follow]
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

## Validation

Before finishing, ensure:
- [ ] All API endpoints from spec have test examples
- [ ] All core functions have unit tests
- [ ] Critical user flows have E2E tests
- [ ] Test data fixtures are complete and realistic
- [ ] No pseudocode - all examples are runnable
- [ ] Test utilities cover common patterns

## User Input

$INPUT
