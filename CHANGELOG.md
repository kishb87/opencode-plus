# Changelog

All notable changes to opencode-plus will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-24

### Added
- Initial release of opencode-plus
- Actor agent — TDD implementer following Red→Green→Refactor
- Critic agent — independent validator with binary APPROVED/NOT APPROVED verdict
- Orchestrator agent — coordinates Actor-Critic workflow with retry logic
- Architect agent — generates PRD, technical spec, test spec, agent spec, and task files
- Researcher agent — lightweight documentation fetcher for parallel research
- `tdd_init` tool — initializes project structure
- `tdd_status` tool — checks workflow progress
- `tdd_next` tool — gets next task
- `tdd_state` tool — reads/updates workflow state
- Multi-file spec and test generation to prevent timeouts
- Session compaction hook to preserve TDD context
