/**
 * opencode-tdd - TDD Actor-Critic Workflow Plugin for OpenCode
 *
 * This plugin provides a structured Test-Driven Development workflow
 * using an Actor-Critic multi-agent system.
 *
 * Agents:
 * - @actor: Implements tasks following Red→Green→Refactor
 * - @critic: Validates implementations with fresh context
 * - @orchestrator: Coordinates the TDD workflow
 * - @architect: Generates comprehensive foundational documents
 *
 * Tools:
 * - tdd_init: Initialize project structure
 * - tdd_status: Check workflow progress
 * - tdd_next: Get next task
 * - tdd_state: Read/update state
 */

import type { Plugin } from "@opencode-ai/plugin"
import { tddInitTool } from "./tools/tdd-init"
import { tddStatusTool } from "./tools/tdd-status"
import { tddNextTool } from "./tools/tdd-next"
import { tddStateTool } from "./tools/tdd-state"
import { actorAgent } from "./agents/actor"
import { criticAgent } from "./agents/critic"
import { orchestratorAgent } from "./agents/orchestrator"
import { architectAgent } from "./agents/architect"
import { createTestTrackerHook } from "./hooks/test-tracker"
import { createStatePersistHook } from "./hooks/state-persist"
import { loadConfig } from "./config/loader"

export const TDDPlugin: Plugin = async (ctx) => {
  const { client, $, directory, worktree } = ctx

  // Load user configuration
  const config = await loadConfig(directory)

  // Log plugin initialization
  await client.app.log({
    service: "opencode-tdd",
    level: "info",
    message: "TDD Plugin initialized",
    extra: {
      directory,
      worktree,
      config: {
        features: config.features,
      },
    },
  })

  return {
    // =========================================
    // CUSTOM TOOLS
    // =========================================
    tool: {
      tdd_init: tddInitTool($, directory),
      tdd_status: tddStatusTool($, directory),
      tdd_next: tddNextTool($, directory),
      tdd_state: tddStateTool($, directory),
    },

    // =========================================
    // AGENT CONFIGURATION INJECTION
    // =========================================
    config: async (openCodeConfig) => {
      // Inject TDD agents into OpenCode config
      openCodeConfig.agent = {
        ...openCodeConfig.agent,
        actor: actorAgent(config),
        critic: criticAgent(config),
        orchestrator: orchestratorAgent(config),
        architect: architectAgent(config),
      }
    },

    // =========================================
    // EVENT HOOKS
    // =========================================
    event: async ({ event }) => {
      // Test tracking hook
      if (config.features?.testTracking !== false) {
        await createTestTrackerHook($, directory)(event)
      }

      // State persistence on session end
      if (config.features?.autoSaveState !== false) {
        await createStatePersistHook($, directory)(event)
      }
    },

    // =========================================
    // SESSION COMPACTION HOOK
    // =========================================
    "experimental.session.compacting": async (input, output) => {
      // Inject TDD context into compaction summary
      try {
        const stateJson = await $`cat ${directory}/.tdd/state.json 2>/dev/null`.text()
        const state = JSON.parse(stateJson)

        output.context.push(`
## TDD Workflow Context (Preserved Across Compaction)

**Current Phase**: ${state.workflow_phase || "unknown"}
**Current Task**: ${state.current_task || "none"}
**Progress**: ${state.completed_tasks?.length || 0}/${state.total_tasks || 0} tasks completed
**Attempt**: ${state.current_attempt || 1}

### Completed Tasks
${state.completed_tasks?.map((t: string) => `- ✅ ${t}`).join("\n") || "None yet"}

### Last Critic Feedback
${state.last_critic_feedback || "None"}

### Important
- Actor and Critic agents use FRESH context per invocation
- Task files in tasks/ directory contain full requirements
- State is tracked in .tdd/state.json
`)
      } catch {
        // No TDD state yet, skip injection
      }
    },

    // =========================================
    // TOOL EXECUTION HOOKS
    // =========================================
    "tool.execute.after": async (input, output) => {
      // Track test command results
      if (
        input.tool === "bash" &&
        config.features?.testTracking !== false
      ) {
        const command = output.args?.command as string
        if (command?.includes("test") || command?.includes("jest") || command?.includes("vitest")) {
          await client.app.log({
            service: "opencode-tdd",
            level: "debug",
            message: "Test command executed",
            extra: { command },
          })
        }
      }
    },
  }
}

// Default export for OpenCode plugin system
export default TDDPlugin

// Named exports for advanced usage
export { actorAgent, criticAgent, orchestratorAgent, architectAgent }
export { tddInitTool, tddStatusTool, tddNextTool, tddStateTool }
export { loadConfig } from "./config/loader"
export type { TDDConfig } from "./config/schema"
