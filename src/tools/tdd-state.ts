import { tool } from "@opencode-ai/plugin"
import type { Shell } from "@opencode-ai/plugin"

/**
 * TDD State Tool
 *
 * Read and update TDD workflow state
 */
export const tddStateTool = ($: Shell, directory: string) =>
  tool({
    description: `Read or update TDD workflow state.
Can mark tasks as complete, update phase, or record Critic feedback.`,
    args: {
      action: tool.schema
        .enum(["read", "complete_task", "set_phase", "set_feedback", "reset"])
        .describe("Action to perform"),
      taskId: tool.schema
        .string()
        .optional()
        .describe("Task ID (for complete_task action)"),
      phase: tool.schema
        .enum(["not_started", "in_progress", "actor_working", "critic_validating", "completed", "blocked"])
        .optional()
        .describe("Workflow phase (for set_phase action)"),
      feedback: tool.schema
        .string()
        .optional()
        .describe("Critic feedback (for set_feedback action)"),
    },
    async execute(args) {
      const { action, taskId, phase, feedback } = args
      const statePath = `${directory}/.tdd/state.json`

      try {
        // Read current state
        const stateContent = await $`cat ${statePath}`.text()
        const state = JSON.parse(stateContent)

        switch (action) {
          case "read":
            return JSON.stringify(state, null, 2)

          case "complete_task":
            if (!taskId) {
              return "❌ taskId is required for complete_task action"
            }

            // Add to completed if not already there
            if (!state.completed_tasks) {
              state.completed_tasks = []
            }
            if (!state.completed_tasks.includes(taskId)) {
              state.completed_tasks.push(taskId)
            }

            // Clear current task if it matches
            if (state.current_task === taskId) {
              state.current_task = null
              state.current_attempt = 0
            }

            state.workflow_phase = "in_progress"
            state.updated_at = new Date().toISOString()

            await $`echo ${JSON.stringify(state, null, 2)} > ${statePath}`

            return `✅ Task ${taskId} marked as complete.

**Progress**: ${state.completed_tasks.length}/${state.total_tasks || "?"} tasks completed

Next: Run \`tdd_next\` to get the next task.`

          case "set_phase":
            if (!phase) {
              return "❌ phase is required for set_phase action"
            }

            state.workflow_phase = phase
            state.updated_at = new Date().toISOString()

            await $`echo ${JSON.stringify(state, null, 2)} > ${statePath}`

            return `✅ Workflow phase set to: ${phase}`

          case "set_feedback":
            if (!feedback) {
              return "❌ feedback is required for set_feedback action"
            }

            state.last_critic_feedback = feedback
            state.workflow_phase = "critic_validating"
            state.updated_at = new Date().toISOString()

            await $`echo ${JSON.stringify(state, null, 2)} > ${statePath}`

            return `✅ Critic feedback recorded.

\`\`\`
${feedback.slice(0, 500)}${feedback.length > 500 ? "..." : ""}
\`\`\`

Actor can now retry with this feedback.`

          case "reset":
            const resetState = {
              ...state,
              workflow_phase: "not_started",
              current_task: null,
              current_attempt: 0,
              completed_tasks: [],
              failed_tasks: [],
              last_critic_feedback: null,
              updated_at: new Date().toISOString(),
            }

            await $`echo ${JSON.stringify(resetState, null, 2)} > ${statePath}`

            return `✅ TDD state reset.

All progress has been cleared. Run \`tdd_next\` to start from the beginning.`

          default:
            return `❌ Unknown action: ${action}`
        }
      } catch (error) {
        return `❌ Error managing TDD state: ${error}

Make sure TDD is initialized: \`tdd_init\``
      }
    },
  })
