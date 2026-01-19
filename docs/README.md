# OpenCode TDD Documentation

This directory contains detailed documentation for the OpenCode TDD plugin.

## Getting Started

- **[Installation Guide](./INSTALLATION.md)** - Complete installation and setup instructions
  - Installation methods (npm, bun, pnpm)
  - OpenCode configuration
  - Project initialization
  - Quick start examples

## System Architecture

- **[Architecture Analysis](./ARCHITECTURE_ANALYSIS.md)** - Deep dive into system design
  - Actor-Critic pattern analysis
  - Handoff mechanism design
  - Fresh context principles
  - State management

- **[Agent Definitions](./AGENTS.md)** - Legacy agent documentation
  - Original agent specifications
  - Role definitions

## Agents

- **[Researcher Agent](./RESEARCHER_AGENT.md)** - Lightweight data fetcher
  - Role and responsibilities
  - Context7 integration
  - Web search patterns
  - Output format

- **[Researcher Design](./RESEARCHER_DESIGN.md)** - Detailed architecture
  - Design decisions
  - Fast fetch process
  - Parallel execution
  - Integration with Architect

- **[Researcher Usage Patterns](./RESEARCHER_USAGE_PATTERNS.md)** - How to use the researcher
  - Common patterns
  - Best practices
  - Examples

## Documentation Generation

- **[Architect Improvements](./ARCHITECT_IMPROVEMENTS.md)** - Documentation system enhancements
  - PRD-driven approach
  - Multi-file architecture
  - Research integration
  - Task generation with implementation guidance

- **[Multi-File Spec](./MULTI_FILE_SPEC.md)** - Numbered specification approach
  - Why numbered chunks prevent timeouts
  - File organization (README.md, numbered files, TOC.md)
  - Flexible scaling (3 files to 30+ files)
  - Examples for different project types

- **[Multi-File Test](./MULTI_FILE_TEST.md)** - Numbered test documentation
  - Testing strategy organization
  - Research-informed test patterns
  - Runnable test examples
  - Framework-specific guidance

## Quick Links

| Document | Purpose | Best For |
|----------|---------|----------|
| [Installation Guide](./INSTALLATION.md) | Setup and configuration | New users |
| [Architecture Analysis](./ARCHITECTURE_ANALYSIS.md) | Understanding system design | Contributors, advanced users |
| [Researcher Agent](./RESEARCHER_AGENT.md) | Understanding research process | Understanding doc generation |
| [Multi-File Spec](./MULTI_FILE_SPEC.md) | Spec generation approach | Understanding documentation |
| [Multi-File Test](./MULTI_FILE_TEST.md) | Test generation approach | Understanding test strategy |

## Main README

For the main project documentation with quick start guide and examples, see [../README.md](../README.md).

## Contributing

Found an issue or want to improve documentation? Please see [CONTRIBUTING.md](../CONTRIBUTING.md).
