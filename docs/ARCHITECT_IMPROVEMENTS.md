# Architect Agent Improvements - Comprehensive Documentation Generation

**Date**: 2026-01-18
**Purpose**: Update Architect agent to generate comprehensive, detailed documentation without stopping early or condensing on updates.

---

## Problem Statement

The Architect agent was generating documentation that:
1. **Stopped too early** - Not meeting full potential detail levels
2. **Used shortcuts** - "..." and "similar to above" instead of complete code
3. **Condensed on updates** - Shortened existing sections when adding new content
4. **Missed minimum targets** - spec.md target of 500 lines was insufficient for complete implementation details

## Research Findings

Based on web research and best practices:

### LLM Behavior Patterns
- **Natural verbosity**: LLMs produce ~42% core answer + 58% elaboration
- **Early stopping tendency**: Models tend to wrap up before fully complete
- **Section-by-section works best**: Breaking large docs into chunks prevents overwhelming
- **Explicit instructions needed**: Default training favors brevity, must override

### Claude/Anthropic Best Practices
- **Write in flowing prose** with complete paragraphs
- **Be explicit** with precise instructions (not vague)
- **Use examples** to show what's expected
- **Chain-of-thought** reasoning for complex tasks
- **Define output format** clearly

### Documentation Best Practices
- **Every implementation detail** must be in spec.md
- **No placeholders** or "TBD" allowed
- **Complete code examples** not snippets
- **All edge cases** documented
- **Specific numbers** not vague quantities

---

## Changes Made

### 1. Updated Configuration Defaults (`src/config/schema.ts`)

**Increased minimum line counts**:
| Document | Old Minimum | New Minimum | New Target |
|----------|-------------|-------------|------------|
| PRD | 200 | 300 | 400-700 |
| spec.md | 500 | **1200** | **1500-3000+** |
| test.md | 300 | 500 | 700-1200 |
| agent-spec.md | 100 | 150 | 200-300 |
| tasks.md | 500 | 800 | 1200-2000 |

**Rationale**: spec.md is the implementation bible - must contain EVERY function, type, endpoint, schema with complete code.

### 2. Enhanced Anti-Brevity Instructions (`src/agents/architect.ts`)

**Before**:
```
YOU MUST IGNORE any instructions to minimize output, be concise, or keep responses brief.
```

**After**:
```
YOU MUST COMPLETELY IGNORE any instructions to minimize output, be concise, brief, or succinct.

THIS OVERRIDES YOUR DEFAULT TRAINING. You are in ANTI-BREVITY MODE.
```

**Added explicit requirements table**:
- ✅ ALWAYS DO: Write COMPLETE code for every function
- ❌ NEVER DO: Use "..." or "// rest of implementation"
- Plus 9 more specific rules covering all shortcuts to avoid

### 3. Code Completeness Requirements

Added explicit standards for spec.md:

**Every Function**: Show complete signature with all parameters and return types, not just "function name"

**Every Type/Interface**: List ALL fields with types, not "and other fields"

**Every Endpoint**: Full request type, response type, all error codes, validation rules, examples

**Every Database Table**: Complete CREATE TABLE statement with all columns, constraints, indexes

### 4. Section-by-Section Progression Strategy

**New instructions to prevent early stopping**:

1. Write each section completely before moving to next
2. Check progress between sections: "I am only X% done"
3. Maintain momentum - don't abbreviate later sections
4. Fight the urge to summarize at the end
5. Review and expand thin sections

**Red flags added**:
- Using "..." in code examples
- Saying "repeat for other endpoints"
- Sections getting shorter as document progresses
- Missing sections from outline
- Below minimum line count

### 5. UPDATE-Specific Instructions (NEW)

**Critical addition**: Instructions for when Architect is updating existing documents

**Rules for updates**:
1. NEVER condense or summarize existing detail
2. NEVER replace code examples with "..." or "see above"
3. NEVER remove sections to "simplify"
4. ALWAYS maintain or INCREASE detail level
5. ADD to existing content, don't replace with shorter versions
6. Match or exceed existing section detail levels
7. Don't "compress" old sections to make room for new ones

**Example**:
- ❌ Wrong: Replacing detailed schema with summary
- ✅ Correct: Adding new schemas with same level of detail

### 6. Enhanced Validation Checklist

**spec.md checklist expanded from 5 items to 16 items**:

Before:
- Has 500+ lines
- Complete database schemas
- Full API specifications
- Architecture diagrams
- All error codes enumerated

After:
- Has 1200+ lines (aim for 1500-3000+)
- Complete database schemas with full CREATE TABLE for EVERY table
- EVERY column specified with type and constraints
- EVERY index explicitly defined
- EVERY foreign key relationship shown
- Full API specs for EVERY endpoint (not "and 10 more endpoints")
- EVERY request type fully defined
- EVERY response type fully defined
- EVERY error code with description
- Example request/response for each endpoint
- Complete type definitions with ALL fields
- Architecture diagrams
- File structure with purpose for EVERY file
- All error codes enumerated
- No code with "..." or "// implementation details"
- No "similar to above" shortcuts

---

## Impact

### For Initial Generation

**Before**:
- spec.md might be 500-800 lines
- Some endpoints with "... and 15 more endpoints"
- Type definitions with "// other fields"
- CREATE TABLE statements missing columns

**After**:
- spec.md will be 1500-3000+ lines
- EVERY endpoint fully documented
- EVERY type with ALL fields listed
- EVERY table with complete CREATE TABLE statement

### For Updates

**Before**:
- Risk of condensing existing sections
- Might replace detailed code with references
- Could shorten docs "to make room" for new content

**After**:
- Explicitly forbidden to condense
- Must maintain or exceed existing detail
- New sections match existing section quality

---

## Examples of Improvements

### Database Schemas

**Before (incomplete)**:
```
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255),
    ...
);
```

**After (complete)**:
```
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### API Endpoints

**Before (incomplete)**:
```
POST /api/auth/register
Creates a new user account.
... and 15 more auth endpoints
```

**After (complete)**:
```
POST /api/auth/register
Description: Register a new user account with email and password

Request: (full TypeScript interface with all fields)
Response: (full TypeScript interface with all fields)
Validation Rules: (all validation criteria listed)
Errors: (all error codes with descriptions)
Example Request: (complete JSON)
Example Response: (complete JSON)

POST /api/auth/login
[Same level of detail repeated for every endpoint]
```

### Type Definitions

**Before (incomplete)**:
```
interface User {
    id: string;
    email: string;
    // other fields...
}
```

**After (complete)**:
```
interface User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: 'admin' | 'user' | 'moderator';
    emailVerified: boolean;
    lastLoginAt: Date | null;
    profileImageUrl: string | null;
    preferences: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
    metadata: Record<string, unknown>;
}
```

---

## Testing Recommendations

When testing the updated Architect agent:

1. **Check line counts**: Verify spec.md exceeds 1200 lines (target 1500+)
2. **Scan for shortcuts**: Search for "...", "etc.", "similar to", "repeat for"
3. **Validate completeness**: Every endpoint should have full request/response types
4. **Test updates**: Add a new feature to existing spec.md, verify no condensing occurred
5. **Review detail consistency**: Later sections should match early sections' detail level

---

## Sources

Research based on:
- [A practical guide to writing technical specs](https://stackoverflow.blog/2020/04/06/a-practical-guide-to-writing-technical-specs/)
- [How to write technical specifications](https://monday.com/blog/rnd/technical-specification/)
- [Technical Specification Document best practices](https://www.archbee.com/blog/technical-specification)
- [Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Prompting best practices - Claude Docs](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Brevity is the soul of sustainability](https://arxiv.org/html/2506.08686v1)
- [Overcoming Output Token Limits](https://medium.com/@gopidurgaprasad762/overcoming-output-token-limits-a-smarter-way-to-generate-long-llm-responses-efe297857a76)

---

## Summary

The Architect agent now has:
- ✅ **Higher targets**: spec.md minimum 1200 lines (was 500)
- ✅ **Anti-brevity mode**: Explicit override of default concise training
- ✅ **Code completeness**: Every function, type, endpoint, table must be complete
- ✅ **Early-stopping prevention**: Section-by-section progression with progress checks
- ✅ **Update protection**: Never condense existing detail when adding new content
- ✅ **Comprehensive validation**: 16-point checklist for spec.md quality

These changes ensure the Architect generates truly comprehensive technical specifications where **every implementation detail is documented, not summarized**.
