import { readFile } from "fs/promises"
import { join } from "path"
import { TDDConfigSchema, type TDDConfig, defaultConfig } from "./schema"

/**
 * Load TDD plugin configuration from various locations
 *
 * Search order (first found wins):
 * 1. {projectDir}/opencode-tdd.json
 * 2. {projectDir}/.opencode/opencode-tdd.json
 * 3. ~/.config/opencode/opencode-tdd.json
 * 4. Default config
 */
export async function loadConfig(projectDir: string): Promise<TDDConfig> {
  const configPaths = [
    join(projectDir, "opencode-tdd.json"),
    join(projectDir, ".opencode", "opencode-tdd.json"),
    join(process.env.HOME || "~", ".config", "opencode", "opencode-tdd.json"),
  ]

  for (const configPath of configPaths) {
    try {
      const content = await readFile(configPath, "utf-8")
      const rawConfig = JSON.parse(content)

      // Validate and merge with defaults
      const config = TDDConfigSchema.parse(rawConfig)
      return config
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
  return TDDConfigSchema.parse({
    models: { ...base.models, ...override.models },
    workflow: { ...base.workflow, ...override.workflow },
    documents: { ...base.documents, ...override.documents },
    features: { ...base.features, ...override.features },
    prompts: { ...base.prompts, ...override.prompts },
  })
}

export { TDDConfigSchema, type TDDConfig, defaultConfig }
