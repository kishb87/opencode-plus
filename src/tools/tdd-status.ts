import { tool } from "@opencode-ai/plugin"
import type { PluginInput, ToolDefinition } from "@opencode-ai/plugin"
import { loadConfig } from "../config/loader"

interface TDDState {
  version: string
  project_type: string
  test_command: string
  workflow_phase: string
  current_task: string | null
  current_attempt: number
  completed_tasks: string[]
  failed_tasks: string[]
  total_tasks: number
  last_critic_feedback: string | null
  created_at: string
  updated_at: string
}

/**
 * TDD Status Tool
 *
 * Reports current TDD workflow progress and state
 */
export const tddStatusTool = ($: PluginInput["$"], directory: any): ToolDefinition =>
  tool({
    description: `Check TDD workflow progress and current state.
Shows completed tasks, current task, and next steps.`,
    args: {
      verbose: tool.schema
        .boolean()
        .optional()
        .describe("Show detailed information including task contents"),
      json: tool.schema
        .boolean()
        .optional()
        .describe("Output raw JSON state"),
    },
    async execute(args) {
      const { verbose = false, json = false } = args

      // Handle directory in various formats
      const dir = typeof directory === "string"
        ? directory
        : (directory?.path || process.cwd())

      try {
        // Load config to resolve tasksDir
        const config = await loadConfig(dir)
        const tasksDir = config.workflow?.tasksDir ?? ".context/tasks"
        const tasksDirPath = `${dir}/${tasksDir}`

        // Read state file
        const stateContent = await $`cat ${dir}/.tdd/state.json`.text()
        const state: TDDState = JSON.parse(stateContent)

        if (json) {
          return JSON.stringify(state, null, 2)
        }

        // Count task files
        let taskFiles: string[] = []
        try {
          const taskList = await $`ls ${tasksDirPath}/TDD_*.md 2>/dev/null`.text()
          taskFiles = taskList.trim().split("\n").filter(Boolean)
        } catch {
          // No task files yet
        }

        const totalTasks = taskFiles.length || state.total_tasks
        const completedCount = state.completed_tasks?.length || 0
        const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
        const progressBar = generateProgressBar(progress)

        let output = `
# TDD Workflow Status

## Overview

| Metric | Value |
|--------|-------|
| **Phase** | ${formatPhase(state.workflow_phase)} |
| **Progress** | ${completedCount}/${totalTasks} tasks (${progress}%) |
| **Current Task** | ${state.current_task || "None"} |
| **Attempt** | ${state.current_attempt || 0} |
| **Test Command** | \`${state.test_command}\` |

${progressBar}

## Completed Tasks (${completedCount})
${state.completed_tasks?.length ? state.completed_tasks.map((t) => `- ✅ ${t}`).join("\n") : "None yet"}

## Remaining Tasks (${totalTasks - completedCount})
${getRemainingTasks(taskFiles, state.completed_tasks || [])}
`

        if (state.last_critic_feedback) {
          output += `
## Last Critic Feedback
\`\`\`
${state.last_critic_feedback}
\`\`\`
`
        }

        if (verbose && state.current_task) {
          try {
            const taskContent = await $`cat ${tasksDirPath}/${state.current_task}.md`.text()
            output += `
## Current Task Content

\`\`\`markdown
${taskContent.slice(0, 2000)}${taskContent.length > 2000 ? "\n... (truncated)" : ""}
\`\`\`
`
          } catch {
            output += "\n*Could not read current task file*\n"
          }
        }

        output += `
## Timestamps

- **Created**: ${formatDate(state.created_at)}
- **Last Updated**: ${formatDate(state.updated_at)}
`

        return output
      } catch (error) {
        return `❌ TDD workflow not initialized.

Run \`tdd_init\` to set up the project structure.

Error: ${error}`
      }
    },
  })

function formatPhase(phase: string): string {
  const phaseMap: Record<string, string> = {
    not_started: "🔵 Not Started",
    in_progress: "🟡 In Progress",
    actor_working: "🟠 Actor Working",
    critic_validating: "🟣 Critic Validating",
    completed: "🟢 Completed",
    blocked: "🔴 Blocked",
  }
  return phaseMap[phase] || phase
}

function generateProgressBar(percent: number): string {
  const filled = Math.round(percent / 5)
  const empty = 20 - filled
  const bar = "█".repeat(filled) + "░".repeat(empty)
  return `\`[${bar}]\` ${percent}%`
}

function getRemainingTasks(allTasks: string[], completed: string[]): string {
  const completedSet = new Set(completed)
  const remaining = allTasks
    .map((path) => {
      const match = path.match(/TDD_\d+/)
      return match ? match[0] : null
    })
    .filter((task): task is string => task !== null && !completedSet.has(task))

  if (remaining.length === 0) {
    return "All tasks completed! 🎉"
  }

  return remaining.map((t) => `- ⬜ ${t}`).join("\n")
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString()
  } catch {
    return isoString
  }
}
