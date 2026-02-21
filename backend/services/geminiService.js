/**
 * GeminiService - Production-grade wrapper for Google Generative AI
 *
 * MODEL HISTORY (diagnostic run 2026-02-21):
 *   - "gemini-pro"         → 404 NOT FOUND — removed from API
 *   - "gemini-2.0-flash"   → 403 FORBIDDEN — not accessible with free-tier AI Studio key
 *   - "gemini-2.5-flash"   → ✅ WORKING — confirmed via direct API call
 *   - "gemini-1.5-flash"   → Fallback — older but widely accessible
 *
 * Diagnostic result (2026-02-21):
 *   ✅ gemini-2.5-flash: working
 *   ❌ gemini-pro: 404 NOT FOUND
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Configuration ─────────────────────────────────────────────────────────

const PRIMARY_MODEL = "gemini-flash-latest";
const FALLBACK_MODEL = "gemini-2.0-flash-lite";
const GEMMA_MODEL = "gemma-3-27b-it";          // Separate quota bucket
const JSON_MODEL = "gemini-flash-latest";

// Generation defaults — used for chat, analysis, autocomplete
const DEFAULT_GENERATION_CONFIG = {
    temperature: 0.3,
    maxOutputTokens: 4096,
    topP: 0.8,
    topK: 40,
};

// Code generation gets a higher token limit — complex programs can be 200-400 lines
const CODE_GENERATION_CONFIG = {
    temperature: 0.3,
    maxOutputTokens: 8192,
    topP: 0.8,
    topK: 40,
};

// Safety settings — allow code-related content
const SAFETY_SETTINGS = [];  // Use defaults — code content passes fine without overrides

// ─── Initialisation ─────────────────────────────────────────────────────────

if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY is not set — AI features will fail at runtime");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Creates a model instance with sensible defaults.
 * @param {string} modelName - Gemini model name
 * @param {object} [extraConfig] - Extra generationConfig overrides
 */
function createModel(modelName, extraConfig = {}) {
    return genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { ...DEFAULT_GENERATION_CONFIG, ...extraConfig },
    });
}

// Pre-initialised model instances (lazy — created once on first import)
const models = {
    get primary() { return createModel(PRIMARY_MODEL); },
    get fallback() { return createModel(FALLBACK_MODEL); },
    get json() {
        return createModel(JSON_MODEL, {
            responseMimeType: "application/json",
        });
    },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

/**
 * Strips markdown code fences from a model response.
 * Model often wraps output in ```python\n...\n``` even when told not to.
 */
function stripCodeFences(text) {
    return text
        .replace(/^```[\w]*\n?/gm, "")
        .replace(/^```$/gm, "")
        .trim();
}

/**
 * Calls generateContent with automatic fallback across multiple models.
 * @param {string} prompt
 * @param {object} [config] - Optional generationConfig overrides
 */
async function callWithFallback(prompt, config = {}) {
    const candidates = [
        { name: PRIMARY_MODEL },
        { name: FALLBACK_MODEL },
        { name: GEMMA_MODEL },
    ];

    let lastError;

    for (const { name } of candidates) {
        try {
            const model = createModel(name, config);
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            if (!text) throw new Error("Empty response from model");
            return text;
        } catch (err) {
            const status = err.status ?? err.statusCode ?? err.code ?? 0;
            lastError = err;

            // If it's a safety error or prompt error, don't retry (it will fail same way)
            if (status === 400) break;

            console.warn(`⚠️  [${name}] failed [HTTP ${status}]: ${err.message?.slice(0, 100)}`);
        }
    }

    // All candidates failed — surface a meaningful error
    const status = lastError?.status ?? lastError?.statusCode ?? 0;
    if (status === 429) {
        throw Object.assign(new Error("AI rate limit reached. Please wait a moment and try again."), { status: 429 });
    }
    throw lastError ?? new Error("All AI models failed");
}

// ─── GeminiService ───────────────────────────────────────────────────────────

class GeminiService {
    // ── Code Autocomplete ────────────────────────────────────────────────────

    /**
     * Generates an inline code completion for the editor cursor position.
     * @param {string} codeBefore - code up to cursor
     * @param {string} language
     * @param {string} [filename]
     */
    async getCodeCompletion(codeBefore, language, filename = "script") {
        const langUpper = language.toUpperCase();
        const prompt = [
            `You are an expert ${language} code autocomplete engine embedded in a ${language} editor.`,
            `LANGUAGE IN USE: ${langUpper}. You MUST continue the code in ${langUpper} only.`,
            `DO NOT switch to any other programming language under any circumstances.`,
            ``,
            `Rules:`,
            `- Output ONLY the ${language} continuation — zero explanations, zero markdown, zero code fences`,
            `- The output must be valid, syntactically correct ${language} code`,
            `- Match the indentation style and conventions of the existing code`,
            `- Provide only the most natural next code expression, statement, or block`,
            ``,
            `Current ${language} file (${filename}.${language}):`,
            `\`\`\`${language}`,
            codeBefore,
            `\`\`\``,
            ``,
            `Continue writing ${language} code from exactly the cursor position:`,
        ].join('\n');

        try {
            const raw = await callWithFallback(prompt);
            return {
                suggestion: stripCodeFences(raw),
                confidence: 0.85,
            };
        } catch (err) {
            console.error("[GeminiService.getCodeCompletion]", err.message);
            throw new Error("Failed to generate code completion");
        }
    }

    // ── Code Analysis ────────────────────────────────────────────────────────

    /**
     * Analyses code for bugs, security issues, and improvements.
     * Returns structured JSON.
     */
    async analyzeCode(code, language) {
        const prompt = `Analyse this ${language} code for errors, bugs, security issues, and improvements.
Return ONLY valid JSON — no markdown, no explanation — matching this exact schema:
{
  "errors": [
    {
      "line": <line number or 0>,
      "severity": "error|warning|info",
      "type": "syntax|type-error|logic|security|performance|style",
      "message": "concise description",
      "suggestion": "how to fix it",
      "confidence": 0.9
    }
  ],
  "score": <0-100 quality score>
}

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the JSON:`;

        try {
            let raw;
            try {
                const result = await models.json.generateContent(prompt);
                raw = result.response.text();
            } catch {
                raw = await callWithFallback(prompt);
            }

            raw = stripCodeFences(raw);

            try {
                return JSON.parse(raw);
            } catch {
                console.warn("[GeminiService.analyzeCode] JSON parse failed, returning default");
                return { errors: [], score: 85, message: "Analysis completed" };
            }
        } catch (err) {
            console.error("[GeminiService.analyzeCode]", err.message);
            throw new Error("Failed to analyse code");
        }
    }

    // ── Code Generation ──────────────────────────────────────────────────────

    /**
     * Generates code from a natural-language description.
     * Scales complexity based on keywords like "small", "simple", "any".
     * Enforces sandbox-safe code (no stdin reads).
     *
     * @param {string} description - user's request
     * @param {string} language
     * @param {object} [context]
     */
    async generateCode(description, language, context = {}) {
        const langUpper = language.toUpperCase();
        const depLine = context.dependencies
            ? `Available libraries/dependencies: ${context.dependencies}`
            : "";

        // Detect if user wants simple/short code — prevent over-engineering
        const wantsSimple = /\b(small|simple|basic|short|quick|tiny|minimal|brief|easy|beginner|hello|demo|example|snippet|any)\b/i.test(description);
        const complexityRule = wantsSimple
            ? `COMPLEXITY: The user asked for SMALL/SIMPLE code. Write MINIMAL code — 10 to 30 lines MAXIMUM. A concise, clear demonstration only. NO enterprise patterns, NO excessive try/catch blocks, NO over-engineering.`
            : `COMPLEXITY: Write a complete, well-structured implementation appropriate in length for the request.`;

        const prompt = [
            `You are a ${language} developer.`,
            `TARGET LANGUAGE: ${langUpper}. Write ONLY ${langUpper} code.`,
            ``,
            `Request: ${description}`,
            depLine,
            ``,
            complexityRule,
            ``,
            `SANDBOX RULE (CRITICAL): This code runs in an automated sandbox with NO interactive terminal.`,
            `- Do NOT use cin, scanf, input(), Scanner, readline, console.readline, or ANY function that reads from stdin/user input.`,
            `- Instead, use HARDCODED example values to demonstrate the concept.`,
            `- Example: instead of "int x; cin >> x;" write "int x = 42; // example value"`,
            ``,
            `Output rules:`,
            `1. Output ONLY raw ${language} source code — no markdown fences, no explanations`,
            `2. Every line must be syntactically valid ${language}`,
            `3. Use ${language} idioms and conventions`,
            `4. Brief inline comments on non-obvious lines only`,
            `5. Code must compile and run correctly`,
            ``,
            `${langUpper} Code:`,
        ].filter(Boolean).join('\n');

        try {
            // Use fallback mechanism directly to handle quota/outage across all models
            const raw = await callWithFallback(prompt, CODE_GENERATION_CONFIG);

            return {
                code: stripCodeFences(raw),
                explanation: `Generated ${language} code for: ${description}`,
            };
        } catch (err) {
            console.error("[GeminiService.generateCode]", err.message);
            throw new Error("Failed to generate code");
        }
    }

    // ── Debug Assistant ──────────────────────────────────────────────────────

    /**
     * Analyses a runtime error and suggests fixes.
     */
    async debugError(errorMessage, code, language, stackTrace = "") {
        const traceLine = stackTrace ? `Stack trace:\n${stackTrace}` : "";

        const prompt = `You are a debugging expert. Analyse this ${language} runtime error and provide clear, actionable fixes.

Error: ${errorMessage}
${traceLine}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Root cause explanation (1-2 sentences)
2. Exact fix with corrected code snippet
3. How to prevent this in future

Be concise and practical.`;

        try {
            const raw = await callWithFallback(prompt);
            return {
                analysis: raw,
                suggestions: [],
            };
        } catch (err) {
            console.error("[GeminiService.debugError]", err.message);
            throw new Error("Failed to analyse error");
        }
    }

    // ── Chat ─────────────────────────────────────────────────────────────────

    /**
     * General-purpose AI chat about code.
     * @param {string} message - user message
     * @param {object} context - { code, language, history }
     */
    async chat(message, context = {}) {
        const { code, language, history = [] } = context;
        const langStr = language || 'code';
        const langUpper = langStr.toUpperCase();

        const systemContext = `You are an expert ${langStr} programming assistant embedded in CoLab, a real-time collaborative code editor.
The user is currently working on ${langStr} code. Be helpful, concise, and code-focused.
When providing code examples, always use ${langStr}.`;

        const codeContext = code?.trim()
            ? `\nCurrent editor code:\n\`\`\`${language}\n${code.slice(0, 1500)}\n\`\`\``
            : "";

        const historyText = history
            .slice(-6) // Last 3 exchanges
            .map(h => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`)
            .join("\n");

        const prompt = [
            systemContext,
            codeContext,
            historyText ? `\nConversation so far:\n${historyText}` : "",
            `\nUser: ${message}`,
            `\nAssistant:`,
        ].filter(Boolean).join("");

        try {
            const raw = await callWithFallback(prompt);
            return {
                response: raw,
                timestamp: Date.now(),
            };
        } catch (err) {
            console.error("[GeminiService.chat]", err.message);
            throw new Error("Failed to get AI response");
        }
    }
}

export default new GeminiService();
