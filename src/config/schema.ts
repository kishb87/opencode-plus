import { z } from "zod"

/**
 * Configuration schema for opencode-plus plugin
 *
 * Users can customize via:
 * - opencode-plus.json (project root)
 * - .opencode/opencode-plus.json (project config dir)
 * - ~/.config/opencode/opencode-plus.json (global)
 */

const ModelsSchema = z.object({
  /** Model for Actor agent (implements tasks). If not specified, uses the current session model */
  actor: z.string().optional(),
  /** Model for Critic agent (validates tasks). If not specified, uses the current session model */
  critic: z.string().optional(),
  /** Model for Orchestrator agent (coordinates workflow). If not specified, uses the current session model */
  orchestrator: z.string().optional(),
  /** Model for Architect agent (generates documents). If not specified, uses the current session model */
  architect: z.string().optional(),
  /** Model for Researcher agent (gathers documentation). If not specified, uses the current session model */
  researcher: z.string().optional(),
})

const WorkflowSchema = z.object({
  /** Maximum retry attempts before escalating */
  maxRetries: z.number().min(1).max(10).default(3),
  /** Automatically run Critic validation after Actor completes */
  autoValidate: z.boolean().default(true),
  /** Test command to run (supports npm, pnpm, yarn, bun) */
  testCommand: z.string().default("npm test"),
  /** Directory for task files */
  tasksDir: z.string().default(".context/tasks"),
  /** Directory for context files */
  contextDir: z.string().default(".context"),
  /** Directory for TDD state */
  stateDir: z.string().default(".tdd"),
})

const DocumentsSchema = z.object({
  /** Minimum lines for PRD */
  minPrdLines: z.number().min(50).default(300),
  /** Minimum lines for technical spec (MUST include ALL code) */
  minSpecLines: z.number().min(100).default(1200),
  /** Minimum lines for test spec */
  minTestLines: z.number().min(50).default(500),
  /** Minimum lines for agent spec */
  minAgentSpecLines: z.number().min(50).default(150),
  /** Minimum lines for tasks breakdown */
  minTasksLines: z.number().min(100).default(800),
})

const FeaturesSchema = z.object({
  /** Enable Architect agent for document generation */
  architectAgent: z.boolean().default(true),
  /** Auto-save TDD state on session end */
  autoSaveState: z.boolean().default(true),
  /** Track test command results */
  testTracking: z.boolean().default(true),
  /** Inject TDD context into session compaction */
  compactionContext: z.boolean().default(true),
})

const McpSchema = z.object({
  /**
   * Controls whether Bright Data MCP tools are enabled for all TDD agents
   * (orchestrator, actor, critic).
   *
   * - `true` (default): the glob pattern `brightdata_*` is added to each
   *   agent's tool list.  If the Bright Data MCP server is NOT installed in
   *   OpenCode, the pattern simply matches nothing and no error is thrown.
   * - `false`: the glob pattern is omitted entirely so no Bright Data tools
   *   are visible to any agent.
   *
   * To install the Bright Data MCP server, add the following to your
   * opencode.json (or ~/.config/opencode/opencode.json):
   *
   * ```json
   * "mcp": {
   *   "brightdata": {
   *     "type": "local",
   *     "command": ["npx", "-y", "@brightdata/mcp"],
   *     "environment": {
   *       "API_TOKEN": "<your-brightdata-api-token>"
   *     }
   *   }
   * }
   * ```
   */
  brightdata: z.boolean().optional(),
})

const PromptsSchema = z.object({
  /** Additional instructions appended to Actor prompt */
  actorAppend: z.string().optional(),
  /** Additional instructions appended to Critic prompt */
  criticAppend: z.string().optional(),
  /** Additional instructions appended to Orchestrator prompt */
  orchestratorAppend: z.string().optional(),
  /** Additional instructions appended to Architect prompt */
  architectAppend: z.string().optional(),
  /** Additional instructions appended to Researcher prompt */
  researcherAppend: z.string().optional(),
})

export const TDDConfigSchema = z.object({
  // =========================================
  // AGENT MODEL OVERRIDES
  // =========================================
  models: ModelsSchema.optional(),

  // =========================================
  // WORKFLOW SETTINGS
  // =========================================
  workflow: WorkflowSchema.partial().optional(),

  // =========================================
  // DOCUMENT GENERATION SETTINGS
  // =========================================
  documents: DocumentsSchema.partial().optional(),

  // =========================================
  // FEATURE FLAGS
  // =========================================
  features: FeaturesSchema.partial().optional(),

  // =========================================
  // AGENT PROMPT CUSTOMIZATION
  // =========================================
  prompts: PromptsSchema.optional(),

  // =========================================
  // MCP SERVER INTEGRATION
  // =========================================
  mcp: McpSchema.optional(),
})

export type TDDConfig = {
  models: z.infer<typeof ModelsSchema>
  workflow: z.infer<typeof WorkflowSchema>
  documents: z.infer<typeof DocumentsSchema>
  features: z.infer<typeof FeaturesSchema>
  prompts: z.infer<typeof PromptsSchema>
  mcp: z.infer<typeof McpSchema>
}

/**
 * Default configuration values
 */
export const defaultConfig: TDDConfig = {
  models: ModelsSchema.parse({}),
  workflow: WorkflowSchema.parse({}),
  documents: DocumentsSchema.parse({}),
  features: FeaturesSchema.parse({}),
  prompts: PromptsSchema.parse({}),
  mcp: McpSchema.parse({}),
}

/**
 * Parse raw config and merge with defaults
 */
export function parseConfig(raw: unknown): TDDConfig {
  const parsed = TDDConfigSchema.parse(raw)
  return {
    models: ModelsSchema.parse(parsed.models ?? {}),
    workflow: WorkflowSchema.parse(parsed.workflow ?? {}),
    documents: DocumentsSchema.parse(parsed.documents ?? {}),
    features: FeaturesSchema.parse(parsed.features ?? {}),
    prompts: PromptsSchema.parse(parsed.prompts ?? {}),
    mcp: McpSchema.parse(parsed.mcp ?? {}),
  }
}
