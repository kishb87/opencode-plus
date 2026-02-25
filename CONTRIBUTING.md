# Contributing to opencode-plus

Thanks for your interest in contributing!

## Getting Started

```bash
git clone https://github.com/kishb87/opencode-plus.git
cd opencode-plus
npm install
npm run build
```

## Development Workflow

```bash
# Watch mode - rebuilds on file changes
npm run dev

# Typecheck
npm run typecheck

# Build
npm run build
```

## Symlink for local testing

To test changes in OpenCode locally:

```bash
# Create symlink so OpenCode loads your local build
ln -sf $(pwd)/plugin.ts ~/.config/opencode/plugin/opencode-plus.ts
ln -sf $(pwd)/commands ~/.config/opencode/command/tdd

# After making changes, rebuild and restart OpenCode
npm run build
```

## Submitting Changes

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run `npm run build` and `npm run typecheck` — both must pass
5. Open a pull request against `main`

## Commit Style

Use conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` code change that isn't a fix or feature
- `chore:` tooling, dependencies, config

## Releasing

Releases are automated. Maintainers push a version tag to trigger publish:

```bash
npm version patch   # or minor / major
git push --follow-tags
```

This triggers the publish workflow which builds and publishes to npm via OIDC trusted publishing.
