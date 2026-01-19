import { z } from "zod"

/**
 * Configuration schema for opencode-tdd plugin
 *
 * Users can customize via:
 * - opencode-tdd.json (project root)
 * - .opencode/opencode-tdd.json (project config dir)
 * - ~/.config/opencode/opencode-tdd.json (global)
 */
export const TDDConfigSchema = z.object({
  // =========================================
  // AGENT MODEL OVERRIDES
  // =========================================
  models: z
    .object({
      /**
       * Model for Actor agent (implements tasks)
       * If not specified, uses the current session model
       */
      actor: z.string().optional(),
      /**
       * Model for Critic agent (validates tasks)
       * If not specified, uses the current session model
       */
      critic: z.string().optional(),
      /**
       * Model for Orchestrator agent (coordinates workflow)
       * If not specified, uses the current session model
       */
      orchestrator: z.string().optional(),
      /**
       * Model for Architect agent (generates documents)
       * If not specified, uses the current session model
       */
      architect: z.string().optional(),
    })
    .default({}),

  // =========================================
  // WORKFLOW SETTINGS
  // =========================================
  workflow: z
    .object({
      /** Maximum retry attempts before escalating */
      maxRetries: z.number().min(1).max(10).default(3),
      /** Automatically run Critic validation after Actor completes */
      autoValidate: z.boolean().default(true),
      /** Test command to run (supports npm, pnpm, yarn, bun) */
      testCommand: z.string().default("npm test"),
      /** Directory for task files */
      tasksDir: z.string().default("tasks"),
      /** Directory for context files */
      contextDir: z.string().default(".context"),
      /** Directory for TDD state */
      stateDir: z.string().default(".tdd"),
    })
    .default({}),

  // =========================================
  // DOCUMENT GENERATION SETTINGS
  // =========================================
  documents: z
    .object({
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
    .default({}),

  // =========================================
  // FEATURE FLAGS
  // =========================================
  features: z
    .object({
      /** Enable Architect agent for document generation */
      architectAgent: z.boolean().default(true),
      /** Auto-save TDD state on session end */
      autoSaveState: z.boolean().default(true),
      /** Track test command results */
      testTracking: z.boolean().default(true),
      /** Inject TDD context into session compaction */
      compactionContext: z.boolean().default(true),
    })
    .default({}),

  // =========================================
  // AGENT PROMPT CUSTOMIZATION
  // =========================================
  prompts: z
    .object({
      /** Additional instructions appended to Actor prompt */
      actorAppend: z.string().optional(),
      /** Additional instructions appended to Critic prompt */
      criticAppend: z.string().optional(),
      /** Additional instructions appended to Orchestrator prompt */
      orchestratorAppend: z.string().optional(),
      /** Additional instructions appended to Architect prompt */
      architectAppend: z.string().optional(),
    })
    .default({}),
})

export type TDDConfig = z.infer<typeof TDDConfigSchema>

/**
 * Default configuration values
 */
export const defaultConfig: TDDConfig = TDDConfigSchema.parse({})
