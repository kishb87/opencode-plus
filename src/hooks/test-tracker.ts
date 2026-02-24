import type { PluginInput } from "@opencode-ai/plugin"

interface SessionEvent {
  type: string
  data?: unknown
}

/**
 * Test Tracker Hook
 *
 * Tracks test command executions and results
 * Updates test-mapping.json with test ownership
 */
export const createTestTrackerHook = ($: PluginInput["$"], directory: string) => {
  return async (event: SessionEvent) => {
    // Track session completion for test result logging
    if (event.type === "session.idle") {
      // Could analyze recent test runs and update mapping
      // For now, just log that we're tracking
    }

    // Track tool executions
    if (event.type === "tool.execute.after") {
      const data = event.data as {
        tool: string
        args: { command?: string }
        result?: string
      }

      if (data.tool === "bash" && data.args?.command) {
        const command = data.args.command

        // Check if it's a test command
        if (isTestCommand(command)) {
          await trackTestExecution($, directory, command, data.result)
        }
      }
    }
  }
}

function isTestCommand(command: string): boolean {
  const testPatterns = [
    /npm\s+test/,
    /pnpm\s+test/,
    /yarn\s+test/,
    /bun\s+test/,
    /jest/,
    /vitest/,
    /mocha/,
    /pytest/,
    /go\s+test/,
    /cargo\s+test/,
  ]

  return testPatterns.some((pattern) => pattern.test(command))
}

async function trackTestExecution(
  $: PluginInput["$"],
  directory: string,
  command: string,
  result?: string
) {
  try {
    // Read current test mapping
    const mappingPath = `${directory}/.tdd/test-mapping.json`
    let mapping: { version: string; mappings: Record<string, unknown>; history: unknown[] }

    try {
      const content = await $`cat ${mappingPath}`.text()
      mapping = JSON.parse(content)
    } catch {
      mapping = { version: "1.0.0", mappings: {}, history: [] }
    }

    // Add to history
    if (!mapping.history) {
      mapping.history = []
    }

    mapping.history.push({
      timestamp: new Date().toISOString(),
      command,
      passed: result ? !result.includes("FAIL") : undefined,
    })

    // Keep only last 100 entries
    if (mapping.history.length > 100) {
      mapping.history = mapping.history.slice(-100)
    }

    // Save updated mapping
    await $`echo ${JSON.stringify(mapping, null, 2)} > ${mappingPath}`
  } catch {
    // Silently fail - tracking is not critical
  }
}
