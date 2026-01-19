# OpenCode TDD Plugin - Global Setup (Auto-Load Method)

The opencode-tdd plugin is configured to load **globally** across all projects using OpenCode's auto-load directory.

## Installation Steps

### 1. Clone/Setup the Repository
```bash
git clone https://github.com/yourusername/opencode-tdd.git
cd opencode-tdd
npm install
npm run build
```

### 2. Create Plugin Symlinks

OpenCode requires a **TypeScript file** in the plugin directory to discover plugins. We need two symlinks:

```bash
# Create plugin directory if it doesn't exist
mkdir -p ~/.config/opencode/plugin ~/.config/opencode/command

# Symlink 1: Plugin entry point (.ts file - REQUIRED for discovery!)
ln -sf /path/to/opencode-tdd/plugin.ts ~/.config/opencode/plugin/opencode-tdd.ts

# Symlink 2: Commands directory
ln -sf /path/to/opencode-tdd/commands ~/.config/opencode/command/tdd
```

**Important:** Replace `/path/to/opencode-tdd` with your actual path!

### 3. Verify Setup

```bash
# Check symlinks
ls -la ~/.config/opencode/plugin/opencode-tdd.ts
ls -la ~/.config/opencode/command/tdd/

# Should see:
# opencode-tdd.ts -> /path/to/opencode-tdd/plugin.ts
# tdd -> /path/to/opencode-tdd/commands
```

### 4. Restart OpenCode

Start OpenCode in any project - the plugin should load automatically!

## Configuration Summary

After installation, you'll have:

**Plugin Entry Point:**
`~/.config/opencode/plugin/opencode-tdd.ts` → symlink to `/path/to/opencode-tdd/plugin.ts`

**Commands Directory:**
`~/.config/opencode/command/tdd/` → symlink to `/path/to/opencode-tdd/commands`

**Global Config (Optional):**
`~/.config/opencode/opencode.json` - No plugin config needed!

## How It Works

```
OpenCode starts
    ↓
Scans ~/.config/opencode/plugin/ for .ts files
    ↓
Finds opencode-tdd.ts (symlinked to plugin.ts) ✅
    ↓
Transpiles and loads the TypeScript file
    ↓
plugin.ts re-exports from ./dist/index.mjs
    ↓
Registers tools: tdd_init, tdd_status, tdd_next, tdd_state ✅
    ↓
Registers agents: @actor, @critic, @orchestrator, @architect ✅
    ↓
Plugin active in ALL projects! ✅
```

**Key Insight:** OpenCode's auto-load system requires a **`.ts` file directly in the plugin directory**. It does NOT auto-discover plugins from subdirectories. That's why we need the `plugin.ts` entry point.

## Why This Method Is Best

✅ **No config needed** - OpenCode auto-loads from the plugin directory
✅ **Works with all package managers** - Bypasses npm/bun entirely
✅ **Simple symlink** - Points to your development directory
✅ **Instant updates** - Rebuild and restart, changes are live
✅ **No freezing** - Doesn't try to install from npm

## Available Everywhere

Open OpenCode in **any project** and you'll have access to:

### Slash Commands
- `/tdd-init` - Initialize TDD structure
- `/tdd-start` - Start Actor-Critic workflow
- `/tdd-status` - Check progress
- `/architect-full` - Generate all docs
- `/architect-prd` - Generate PRD only

### Agents
- `@actor` - TDD implementer
- `@critic` - TDD validator
- `@orchestrator` - Workflow coordinator
- `@architect` - Document generator

### Tools (available in agent contexts)
- `tdd_init`
- `tdd_status`
- `tdd_next`
- `tdd_state`

## Making Changes

When you update the plugin code:

```bash
cd /path/to/opencode-tdd

# 1. Edit source files
vim src/agents/actor.ts

# 2. Rebuild
npm run build

# 3. Restart OpenCode in any project
# Changes are now live everywhere via the symlink!
```

## Directory Structure

```
~/.config/opencode/
├── opencode.json                  # Global OpenCode config (optional)
├── plugin/
│   └── opencode-tdd.ts           # Entry point (symlink → plugin.ts) ✅
└── command/
    └── tdd/                       # Commands (symlink → commands/)
        ├── prd.md
        ├── spec.md
        ├── test-spec.md
        ├── agent-spec.md
        ├── tasks.md
        ├── tdd-init.md
        ├── tdd-start.md
        ├── tdd-status.md
        └── architect-full.md

/path/to/opencode-tdd/             # Your dev directory
├── plugin.ts                      # Plugin entry point (re-exports from dist/)
├── dist/                          # Built JavaScript
│   ├── index.js
│   └── index.mjs
├── commands/                      # Command markdown files
├── src/                           # TypeScript source
└── package.json
```

## Per-Project Configuration (Optional)

You can still override settings per project by creating `opencode-tdd.json`:

```json
{
  "models": {
    "actor": "anthropic/claude-sonnet-4-20250514",
    "critic": "anthropic/claude-sonnet-4-20250514"
  },
  "workflow": {
    "maxRetries": 3,
    "testCommand": "npm test"
  }
}
```

Place in:
- `{project}/opencode-tdd.json` (highest priority)
- `{project}/.opencode/opencode-tdd.json`
- `~/.config/opencode/opencode-tdd.json` (global defaults)

## Testing in a New Project

```bash
# Go to any project
cd ~/my-other-project

# Start OpenCode
opencode

# Try the plugin
> /tdd-init

# It should work! 🎉
```

## Disabling the Plugin

### Option 1: Remove the plugin entry point
```bash
rm ~/.config/opencode/plugin/opencode-tdd.ts
# Plugin no longer loads (commands still work)
```

### Option 2: Temporarily rename it
```bash
mv ~/.config/opencode/plugin/opencode-tdd.ts ~/.config/opencode/plugin/opencode-tdd.ts.disabled
# Plugin disabled, easy to re-enable by renaming back
```

### Option 3: Disable everything (commands too)
```bash
rm ~/.config/opencode/plugin/opencode-tdd.ts
rm ~/.config/opencode/command/tdd
# Both plugin and commands disabled
```

## Re-enabling After Removal

```bash
# Re-create the plugin entry point symlink
ln -sf /path/to/opencode-tdd/plugin.ts ~/.config/opencode/plugin/opencode-tdd.ts

# Re-create the commands symlink
ln -sf /path/to/opencode-tdd/commands ~/.config/opencode/command/tdd

# Plugin is globally available again!
```

## Troubleshooting

### Tools not available (tdd_init, tdd_status, etc.)

**Symptom**: Commands like `/tdd/init` work, but when they try to use the `tdd_init` tool, you get "tool not found" errors.

**Cause**: The plugin isn't loading because OpenCode can't find the `.ts` entry point file.

**Fix**: Verify the plugin entry point symlink exists:
```bash
ls -la ~/.config/opencode/plugin/opencode-tdd.ts
# Should show: opencode-tdd.ts -> /path/to/opencode-tdd/plugin.ts
```

If it doesn't exist, create it:
```bash
ln -sf /path/to/opencode-tdd/plugin.ts ~/.config/opencode/plugin/opencode-tdd.ts
```

**Why this is required**: OpenCode's auto-load system scans for `.ts` files directly in `~/.config/opencode/plugin/`. It does NOT automatically discover plugins from subdirectories. The `plugin.ts` file is the entry point that re-exports the built plugin.

### OpenCode freezes on startup

**Cause**: Plugin specified in config file trying to install from npm/bun, or corrupt TypeScript file

**Fix 1**: Remove plugin from `~/.config/opencode/opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json"
}
```

**Fix 2**: Temporarily disable the plugin entry point:
```bash
mv ~/.config/opencode/plugin/opencode-tdd.ts ~/.config/opencode/plugin/opencode-tdd.ts.disabled
```

Then restart OpenCode to see if it starts normally.

### Commands work but tools don't

**Symptom**: You can run `/tdd/init` and see the command, but it says "tdd_init tool not found"

**Cause**: Commands and tools are separate. Commands are markdown files (always work), tools require the plugin to load.

**Fix**: Check if the plugin is loading by verifying:
```bash
# 1. Entry point exists
ls -la ~/.config/opencode/plugin/opencode-tdd.ts

# 2. Entry point points to valid file
cat ~/.config/opencode/plugin/opencode-tdd.ts
# Should show: export { default } from './dist/index.mjs'

# 3. Built files exist
ls -la /path/to/opencode-tdd/dist/
# Should show: index.js and index.mjs (recent timestamps)
```

### Plugin not loading after rebuild

After modifying source code and rebuilding, restart OpenCode for changes to take effect:
```bash
cd /path/to/opencode-tdd
npm run build
# Then restart OpenCode in any project
```

## Publishing to NPM (Future)

When ready to share publicly:

```bash
# 1. Update version
npm version patch

# 2. Login to npm
npm login

# 3. Publish
npm publish
```

Then users install normally:
```bash
npm install -g opencode-tdd
# Or add to project: npm install opencode-tdd
```

And add to their `opencode.json`:
```json
{
  "plugin": ["opencode-tdd"]
}
```

## Summary

- ✅ Plugin loads in **all projects** automatically via `~/.config/opencode/plugin/`
- ✅ **No config file needed** - auto-load directory handles it
- ✅ **Symlink to development directory** - all changes immediately available after rebuild
- ✅ **No npm/bun issues** - bypasses package managers entirely
- ✅ **No freezing** - doesn't try to install anything
- ✅ Can still override settings per project

This is the **cleanest and most reliable** approach for local plugin development!
