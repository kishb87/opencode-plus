# Multi-File Specification Structure (Numbered, Chunked)

**Date**: 2026-01-18
**Problem**: Single spec.md file (1500-3000+ lines) causes LLM timeouts
**Solution**: Split spec into numbered chunk files (~500 lines each, unlimited files)

---

## Why Multi-File?

### Problem with Single File
```
Architect writing spec.md:
  ↓
Writes 400 lines... 800 lines... 1200 lines...
  ↓
Tool call timeout at ~1500 lines
  ↓
Partial spec generated, missing critical sections
  ↓
Can't recover without rewriting everything
```

### Solution with Multiple Files
```
Architect writing specs:
  ↓
Writes README.md (200 lines) ✅ Complete
Writes architecture.md (350 lines) ✅ Complete
Writes database.md (400 lines) ✅ Complete
Writes api.md (600 lines) ✅ Complete
  ↓
Each file completes successfully
  ↓
Total: 2000+ comprehensive lines across multiple files
```

**Benefits**:
- ✅ No timeouts (each file is manageable size)
- ✅ Restart-friendly (if one file fails, don't lose everything)
- ✅ Better organization (easier to navigate)
- ✅ Modular updates (update just API section without rewriting entire spec)
- ✅ Parallel potential (could eventually write sections concurrently)
- ✅ Real-world pattern (how large specs are actually organized)

---

## File Structure

```
.context/
├── prd.md                      # Product Requirements
├── research.md                 # Library research findings
├── spec/                       # Technical Specification (NUMBERED CHUNKS)
│   ├── README.md              # Topic roadmap (what will be covered)
│   ├── 001.md                 # First topic chunk (~400-600 lines)
│   ├── 002.md                 # Second topic chunk (~400-600 lines)
│   ├── 003.md                 # Third topic chunk (~400-600 lines)
│   ├── ...                    # As many files as needed
│   ├── 012.md                 # Example: 12th file
│   └── TOC.md                 # File→topic mapping (created last)
├── test.md                     # Test Specification
└── agent-spec.md               # Agent Principles
```

**Total spec lines**: Unlimited! (typically 2000-15000+ across all files)

---

## File Breakdown

### 1. README.md (Topic Roadmap)
**Purpose**: Entry point listing all topics to be covered
**Size**: 150-300 lines

**Contains**:
- Project overview
- List of ALL topics that will be documented
- Quick reference section (tech stack, DB, API base, auth method)
- Link to research.md
- Note that TOC.md will show file→topic mapping

**Example**:
```markdown
# Technical Specification

**Project**: REST API with Real-time Features
**Tech Stack**: Fastify, Drizzle, PostgreSQL, Socket.IO

## Overview
[2-3 paragraphs]

## Topics to Cover
1. System Architecture
2. Database Schema
3. API Endpoints
4. Authentication & Security
5. Error Handling
6. File Structure
7. Deployment

## Quick Reference
**Database**: PostgreSQL 16
**Auth**: JWT tokens
**API Base**: /api/v1
```

**IMPORTANT**: This is NOT a table of contents with file links - that comes later in TOC.md. This is a roadmap of what topics need documentation.

### 2. Numbered Files (001.md, 002.md, 003.md, ...)
**Purpose**: Cover each topic comprehensively in ~500 line chunks
**Size**: ~400-600 lines per file (natural stopping points)

**Characteristics**:
- **Sequential**: Write 001.md, then 002.md, then 003.md, etc.
- **Topic-focused**: Each file continues documenting topics from README roadmap
- **Spans allowed**: Topics can span multiple files (API Endpoints might be 003.md through 007.md)
- **Complete**: Each file is comprehensive for its chunk (no "..." or "similar to above")
- **Unlimited**: As many files as needed to cover all topics

**Example for Full-Stack Project** (12 files, 5,740 lines):
- `001.md` - System Architecture (complete, 450 lines)
- `002.md` - Database Schema Part 1: users, sessions tables (520 lines)
- `003.md` - Database Schema Part 2: posts, comments tables (480 lines)
- `004.md` - API Endpoints Part 1: auth endpoints (550 lines)
- `005.md` - API Endpoints Part 2: user endpoints (530 lines)
- `006.md` - API Endpoints Part 3: post endpoints (510 lines)
- `007.md` - Frontend Components Part 1: layout, auth (490 lines)
- `008.md` - Frontend Components Part 2: dashboard, forms (470 lines)
- `009.md` - Authentication & Security (complete, 580 lines)
- `010.md` - Error Handling (complete, 420 lines)
- `011.md` - File Structure (complete, 380 lines)
- `012.md` - Deployment (complete, 350 lines)

**Example for Frontend-Only Project** (6 files, 2,490 lines):
- `001.md` - Component Architecture (380 lines)
- `002.md` - State Management with Redux (520 lines)
- `003.md` - Routing & Navigation (410 lines)
- `004.md` - API Integration Layer (450 lines)
- `005.md` - Styling & Theming (390 lines)
- `006.md` - File Structure (340 lines)

**Each file contains**:
- Topic heading (with continuation note if applicable)
- Comprehensive documentation for that chunk
- Complete code examples (no shortcuts)
- References to research.md for library-specific patterns
- Continuation note if topic continues to next file

### 3. TOC.md (File→Topic Mapping)
**Purpose**: Map which files contain which topics (created LAST)
**Size**: 100-200 lines

**Contains**:
- Clear mapping of topics to file ranges
- Navigation instructions
- Links to README.md

**Example**:
```markdown
# Table of Contents

## File → Topic Mapping

### System Architecture
- **001.md** - Complete

### Database Schema
- **002.md** - Users, sessions tables
- **003.md** - Posts, comments tables

### API Endpoints
- **004.md** - Authentication endpoints
- **005.md** - User management endpoints
- **006.md** - Post and comment endpoints

### Frontend Components
- **007.md** - Layout and auth components
- **008.md** - Dashboard and forms

[etc.]

## Navigation
To find documentation:
1. Check this TOC for the file range
2. Open the numbered files
3. See README.md for topic overview
```

**CRITICAL**: TOC.md is written LAST, after all numbered files are complete

---

## How Architect Generates

### Writing Order

The Architect writes files in this specific order:

1. **README.md** (topic roadmap first)
2. **001.md** (~500 lines covering first topic or part of first topic)
3. **002.md** (~500 lines continuing or starting next topic)
4. **003.md** (~500 lines continuing topics)
5. **...** (as many numbered files as needed)
6. **XXX.md** (final numbered file)
7. **TOC.md** (file→topic mapping, written LAST)

**Each file is written completely before moving to the next.**
**Files are written sequentially until all topics from README are covered.**

### Example Architect Process

```
User: /tdd/spec "Build REST API with authentication"
  ↓
@architect:
  1. Does research (creates research.md)
  2. Creates .context/spec/ directory

  3. Writes README.md (topic roadmap)
     - Lists 6 topics: Architecture, Database, API, Security, Errors, File Structure
     - Quick reference
     - Link to research.md

  4. Writes 001.md (~450 lines)
     - System Architecture (complete)
     - Tech stack from research
     - Integration patterns

  5. Writes 002.md (~520 lines)
     - Database Schema Part 1
     - ERD
     - users table (complete CREATE TABLE with all columns, indexes)
     - sessions table (complete CREATE TABLE)

  6. Writes 003.md (~550 lines)
     - API Endpoints Part 1
     - POST /api/auth/register (complete spec with request/response/validation/errors/examples)
     - POST /api/auth/login (complete spec)

  7. Writes 004.md (~480 lines)
     - API Endpoints Part 2
     - POST /api/auth/logout (complete spec)
     - GET /api/users/me (complete spec)
     - PUT /api/users/me (complete spec)

  8. Writes 005.md (~580 lines)
     - Security & Authentication
     - JWT configuration
     - bcrypt setup (from research)
     - Auth flow diagrams
     - CORS, rate limiting

  9. Writes 006.md (~420 lines)
     - Error Handling
     - All 25 error codes enumerated
     - Error response format
     - Validation approach

  10. Writes 007.md (~380 lines)
      - File Structure
      - Complete directory tree
      - Purpose for every file/folder

  11. Writes TOC.md (mapping)
      - 001: Architecture
      - 002: Database Schema
      - 003-004: API Endpoints
      - 005: Security
      - 006: Error Handling
      - 007: File Structure

  ✅ Complete - 7 files, 3,380 lines total, no timeouts!
```

---

## How Agents Reference Specs

### Actor References

When Actor implements a task, they first check TOC.md to find relevant files:

```markdown
## Task: Implement User Registration

### Finding Relevant Specs
1. Check @.context/spec/TOC.md
   - Database Schema: 002.md
   - API Endpoints: 003-004.md
   - Security: 005.md

2. Read relevant files:
@.context/spec/002.md#users - User table schema
@.context/spec/003.md#post-apiauthregister - Registration endpoint
@.context/spec/005.md#password-hashing - bcrypt setup
```

**Benefit**:
- TOC.md shows exactly which files to read
- Actor only loads 2-3 files instead of entire spec
- Each file is ~500 lines (manageable context)

### Critic References

When Critic validates, they use TOC.md to find validation criteria:

```markdown
## Validation Context

1. Check @.context/spec/TOC.md for relevant topics
2. Read specific files:
   - @.context/spec/003.md#post-apiauthregister - Expected API contract
   - @.context/spec/005.md#password-hashing - Security requirements
   - @.context/spec/006.md - Error codes to check
```

**Benefit**: Focused validation against specific requirements, without loading entire spec

---

## Migration Guide

### Old Single-File Approach

```
.context/
├── spec.md  (1500-3000 lines, causes timeouts)
```

### New Multi-File Approach (Numbered Chunks)

```
.context/
├── spec/
│   ├── README.md
│   ├── 001.md
│   ├── 002.md
│   ├── 003.md
│   ├── 004.md
│   ├── ...
│   ├── 012.md
│   └── TOC.md
```

### For Existing Projects

If you have an existing `spec.md`, you can:

1. Run `/tdd/spec` again - Architect will create spec/ folder with numbered files
2. Manually split spec.md into numbered files with TOC.md
3. Or keep spec.md and create spec/ for new work (both can coexist)

**Actor/Critic work with both formats** - they can read `@.context/spec.md` or `@.context/spec/001.md`

**To manually convert**:
1. Create README.md with topic list
2. Split content into ~500 line chunks as 001.md, 002.md, etc.
3. Create TOC.md mapping topics to files

---

## Benefits Summary

| Aspect | Single File | Numbered Chunks |
|--------|-------------|-----------------|
| **Timeouts** | ❌ Frequent at 1500+ lines | ✅ None (each file ~500 lines) |
| **Recovery** | ❌ Lose everything on timeout | ✅ Keep completed files |
| **Organization** | ❌ Hard to navigate 3000 lines | ✅ TOC.md shows file→topic mapping |
| **Flexibility** | ❌ Frontend gets database sections | ✅ Only relevant topics documented |
| **Updates** | ❌ Rewrite entire file | ✅ Update specific numbered files |
| **References** | ❌ Load entire spec | ✅ TOC → load specific files |
| **Limit** | ❌ Can't exceed ~1500 lines | ✅ Unlimited (25+ files if needed) |
| **Speed** | ❌ Slow generation (one big write) | ✅ Fast (sequential ~500 line writes) |

---

## Line Count Distribution

Typical project (REST API with auth):

```
README.md          :  250 lines (topic roadmap)
001.md            :  450 lines (System Architecture)
002.md            :  520 lines (Database Schema - users, sessions)
003.md            :  550 lines (API Endpoints - auth)
004.md            :  480 lines (API Endpoints - users)
005.md            :  580 lines (Security & Auth flow)
006.md            :  420 lines (Error Handling)
007.md            :  380 lines (File Structure)
TOC.md            :   70 lines (file→topic mapping)
─────────────────────────────────────────────────────
Total              : 3700 lines across 9 files
```

**Before**: Would timeout at ~1500 lines
**After**: All 3700 lines generated successfully (no limit!)

Large project (Full-stack with real-time features):

```
README.md          :  300 lines (topic roadmap)
001.md - 012.md   : 5400 lines (12 numbered files ~450 lines each)
TOC.md            :  150 lines (comprehensive mapping)
─────────────────────────────────────────────────────
Total              : 5850 lines across 14 files
```

**Can scale to 15,000+ lines if project is complex!**

---

## Summary

The numbered, chunked multi-file spec structure solves the timeout problem by:

1. **Preventing timeouts**: Each file is ~500 lines (fast generation, no timeouts)
2. **Unlimited documentation**: No ceiling - can have 25+ files if project is complex
3. **Flexible**: Only documents relevant topics (frontend vs full-stack)
4. **Fast**: Sequential writing of manageable chunks
5. **Clear navigation**: README roadmap + TOC mapping
6. **Modular updates**: Change specific numbered files without affecting others

**Result**: Comprehensive, unlimited technical specifications without LLM timeouts.

**Example scale**:
- Simple frontend: 6 files, 2,500 lines
- REST API: 9 files, 3,700 lines
- Full-stack SaaS: 25 files, 12,000 lines

**All generated successfully with no timeouts!**
