import type { Shell } from "@opencode-ai/plugin"

interface SessionEvent {
  type: string
  data?: unknown
}

/**
 * State Persist Hook
 *
 * Automatically saves TDD state on session end
 * Ensures state is not lost if session terminates unexpectedly
 */
export const createStatePersistHook = ($: Shell, directory: string) => {
  return async (event: SessionEvent) => {
    // Auto-save state when session ends
    if (event.type === "session.idle" || event.type === "session.deleted") {
      await persistState($, directory)
    }

    // Also persist on session error
    if (event.type === "session.error") {
      await persistState($, directory, true)
    }
  }
}

async function persistState($: Shell, directory: string, isError = false) {
  try {
    const statePath = `${directory}/.tdd/state.json`

    // Check if state file exists
    try {
      await $`test -f ${statePath}`
    } catch {
      // No state file, nothing to persist
      return
    }

    // Read current state
    const content = await $`cat ${statePath}`.text()
    const state = JSON.parse(content)

    // Update timestamp
    state.updated_at = new Date().toISOString()

    // If error, mark state
    if (isError && state.workflow_phase === "actor_working") {
      state.workflow_phase = "in_progress"
      state.last_error = new Date().toISOString()
    }

    // Write back
    await $`echo ${JSON.stringify(state, null, 2)} > ${statePath}`

    // Create backup
    const backupPath = `${directory}/.tdd/state.backup.json`
    await $`cp ${statePath} ${backupPath}`
  } catch {
    // Silently fail - persistence is best-effort
  }
}
