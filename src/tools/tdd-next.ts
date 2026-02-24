import { tool } from "@opencode-ai/plugin"
import type { PluginInput, ToolDefinition } from "@opencode-ai/plugin"
import { loadConfig } from "../config/loader"

interface TDDState {
  workflow_phase: string
  current_task: string | null
  current_attempt: number
  completed_tasks: string[]
  total_tasks: number
  last_critic_feedback: string | null
  updated_at: string
}

/**
 * TDD Next Tool
 *
 * Determines and returns the next task to work on
 */
export const tddNextTool = ($: PluginInput["$"], directory: any): ToolDefinition =>
  tool({
    description: `Get the next TDD task to work on.
Returns task details including test scope and existing code context.
Updates state to mark task as current.`,
    args: {
      peek: tool.schema
        .boolean()
        .optional()
        .describe("Only show next task without updating state"),
    },
    async execute(args) {
      const { peek = false } = args

      // Handle directory in various formats
      const dir = typeof directory === "string"
        ? directory
        : (directory?.path || process.cwd())

      try {
        // Load config to resolve tasksDir
        const config = await loadConfig(dir)
        const tasksDir = config.workflow?.tasksDir ?? ".context/tasks"
        const tasksDirPath = `${dir}/${tasksDir}`

        // Read current state
        const stateContent = await $`cat ${dir}/.tdd/state.json`.text()
        const state: TDDState = JSON.parse(stateContent)

        // Get list of task files
        let taskFiles: string[] = []
        try {
          const taskList = await $`ls ${tasksDirPath}/TDD_*.md 2>/dev/null | sort -V`.text()
          taskFiles = taskList.trim().split("\n").filter(Boolean)
        } catch {
          return `❌ No task files found in ${tasksDirPath}/

Generate tasks first:
1. Run \`/architect-full "Your project description"\` to generate all documents
2. Or run \`/architect-tasks\` to generate task breakdown from existing spec
`
        }

        if (taskFiles.length === 0) {
          return `❌ No task files found in ${tasksDirPath}/

Create TDD task files (TDD_1.md, TDD_2.md, etc.) to begin the workflow.`
        }

        // Find next incomplete task
        const completedSet = new Set(state.completed_tasks || [])
        let nextTaskPath: string | null = null
        let nextTaskId: string | null = null

        for (const taskPath of taskFiles) {
          const match = taskPath.match(/TDD_(\d+)/)
          if (match) {
            const taskId = `TDD_${match[1]}`
            if (!completedSet.has(taskId)) {
              nextTaskPath = taskPath
              nextTaskId = taskId
              break
            }
          }
        }

        if (!nextTaskId || !nextTaskPath) {
          return `🎉 All tasks completed!

## Summary
- **Total Tasks**: ${taskFiles.length}
- **Completed**: ${state.completed_tasks?.length || 0}

The TDD workflow is complete. All tests should be passing.

Run your full test suite to verify:
\`\`\`bash
npm test
\`\`\`
`
        }

        // Read task content
        const taskContent = await $`cat ${nextTaskPath}`.text()

        // Update state if not peeking
        if (!peek) {
          const newState = {
            ...state,
            workflow_phase: "actor_working",
            current_task: nextTaskId,
            current_attempt: state.current_task === nextTaskId ? state.current_attempt + 1 : 1,
            updated_at: new Date().toISOString(),
          }
          await $`echo ${JSON.stringify(newState, null, 2)} > ${dir}/.tdd/state.json`
        }

        // Parse frontmatter for summary
        const frontmatter = parseFrontmatter(taskContent)

        return `# Next Task: ${nextTaskId}

## Task Overview

| Property | Value |
|----------|-------|
| **ID** | ${nextTaskId} |
| **Title** | ${frontmatter.title || "Untitled"} |
| **Attempt** | ${peek ? state.current_attempt : state.current_task === nextTaskId ? state.current_attempt + 1 : 1} |
| **Status** | ${peek ? "Preview" : "Started"} |

## Test Scope

### Owns (create/modify these tests)
${formatTestList(frontmatter.test_scope?.owns)}

### Must Pass (all these must pass when done)
${formatTestList(frontmatter.test_scope?.must_pass)}

### Expected to Fail (ignore these - future work)
${formatTestList(frontmatter.test_scope?.expected_to_fail)}

## Full Task Content

\`\`\`markdown
${taskContent}
\`\`\`

---

${peek ? "**This is a preview. Run without peek=true to start working on this task.**" : `
**Task ${nextTaskId} is now active.**

Use \`@actor\` to implement this task following TDD:
1. Red: Write failing tests
2. Green: Implement to pass tests
3. Refactor: Clean up while keeping tests green

When complete, use \`@critic\` to validate the implementation.
`}
`
      } catch (error) {
        return `❌ Error getting next task: ${error}

Make sure TDD is initialized: \`tdd_init\``
      }
    },
  })

interface Frontmatter {
  task_id?: string
  title?: string
  test_scope?: {
    owns?: string[]
    must_pass?: string[]
    expected_to_fail?: string[]
  }
}

function parseFrontmatter(content: string): Frontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  try {
    // Simple YAML-like parsing (not full YAML)
    const lines = match[1].split("\n")
    const result: Frontmatter = { test_scope: {} }
    let currentKey = ""
    let currentList: string[] = []

    for (const line of lines) {
      if (line.match(/^\w+:/)) {
        // New key
        if (currentKey && currentList.length > 0) {
          if (currentKey === "owns") result.test_scope!.owns = currentList
          if (currentKey === "must_pass") result.test_scope!.must_pass = currentList
          if (currentKey === "expected_to_fail") result.test_scope!.expected_to_fail = currentList
        }
        currentList = []

        const [key, ...valueParts] = line.split(":")
        const value = valueParts.join(":").trim()
        currentKey = key.trim()

        if (value && !value.startsWith("-")) {
          if (currentKey === "task_id") result.task_id = value.replace(/['"]/g, "")
          if (currentKey === "title") result.title = value.replace(/['"]/g, "")
        }
      } else if (line.trim().startsWith("-")) {
        // List item
        currentList.push(line.trim().replace(/^-\s*/, "").replace(/['"]/g, ""))
      }
    }

    // Don't forget last key
    if (currentKey && currentList.length > 0) {
      if (currentKey === "owns") result.test_scope!.owns = currentList
      if (currentKey === "must_pass") result.test_scope!.must_pass = currentList
      if (currentKey === "expected_to_fail") result.test_scope!.expected_to_fail = currentList
    }

    return result
  } catch {
    return {}
  }
}

function formatTestList(tests?: string[]): string {
  if (!tests || tests.length === 0) return "*None specified*"
  return tests.map((t) => `- \`${t}\``).join("\n")
}
