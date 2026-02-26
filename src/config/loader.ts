import { readFile } from "fs/promises"
import { join } from "path"
import { parseConfig, type TDDConfig, defaultConfig } from "./schema"

/**
 * Load TDD plugin configuration from various locations
 *
 * Search order (first found wins):
 * 1. {projectDir}/opencode-plus.json
 * 2. {projectDir}/.opencode/opencode-plus.json
 * 3. ~/.config/opencode/opencode-plus.json
 * 4. Default config
 */
export async function loadConfig(projectDir: any): Promise<TDDConfig> {
  // Handle directory in various formats
  let dirPath: string

  if (typeof projectDir === "string") {
    dirPath = projectDir
  } else if (projectDir && typeof projectDir === "object" && projectDir.path) {
    dirPath = projectDir.path
  } else if (projectDir && typeof projectDir === "object" && projectDir.toString) {
    // Fallback: try toString() in case it's a path-like object
    dirPath = projectDir.toString()
  } else {
    // Last resort: use current working directory
    dirPath = process.cwd()
  }

  const configPaths = [
    join(dirPath, "opencode-plus.json"),
    join(dirPath, ".opencode", "opencode-plus.json"),
    join(process.env.HOME || "~", ".config", "opencode", "opencode-plus.json"),
  ]

  for (const configPath of configPaths) {
    try {
      const content = await readFile(configPath, "utf-8")
      const rawConfig = JSON.parse(content)
      return parseConfig(rawConfig)
    } catch {
      // File doesn't exist or is invalid, try next
      continue
    }
  }

  // Return defaults if no config found
  return defaultConfig
}

/**
 * Deep merge two config objects
 */
export function mergeConfig(
  base: TDDConfig,
  override: Partial<TDDConfig>
): TDDConfig {
  return {
    models: { ...base.models, ...override.models },
    workflow: { ...base.workflow, ...override.workflow },
    documents: { ...base.documents, ...override.documents },
    features: { ...base.features, ...override.features },
    prompts: { ...base.prompts, ...override.prompts },
    mcp: { ...base.mcp, ...override.mcp },
  }
}

export { parseConfig, type TDDConfig, defaultConfig }
