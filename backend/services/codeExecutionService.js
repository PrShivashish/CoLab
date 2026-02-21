import axios from 'axios';

/**
 * CodeExecutionService — Judge0 CE adapter
 *
 * Uses the official Judge0 Community Edition public instance (ce.judge0.com).
 * No API key required. Rate limited to ~5 req/s but sufficient for a dev tool.
 *
 * Judge0 CE language IDs: https://ce.judge0.com/languages
 */

const JUDGE0_URL = 'https://ce.judge0.com';

// Judge0 CE language ID map
// Source: GET https://ce.judge0.com/languages (checked 2026-02-21)
const LANGUAGE_IDS = {
    c: 49,  // C (GCC 9.2.0)
    cpp: 54,  // C++ (GCC 9.2.0)
    csharp: 51,  // C# (Mono 6.6.0)
    go: 60,  // Go (1.13.5)
    java: 62,  // Java (OpenJDK 13.0.1)
    javascript: 63,  // JavaScript (Node.js 12.14.0)
    kotlin: 78,  // Kotlin (1.3.70)
    php: 68,  // PHP (7.4.1)
    python: 71,  // Python (3.8.1)
    ruby: 72,  // Ruby (2.7.0)
    rust: 73,  // Rust (1.40.0)
    swift: 83,  // Swift (5.2.3)
    typescript: 74,  // TypeScript (3.7.4)
};

// Human-readable display names
const LANGUAGE_DISPLAY_NAMES = {
    c: 'C',
    cpp: 'C++',
    csharp: 'C#',
    go: 'Go',
    java: 'Java',
    javascript: 'JavaScript',
    kotlin: 'Kotlin',
    php: 'PHP',
    python: 'Python',
    ruby: 'Ruby',
    rust: 'Rust',
    swift: 'Swift',
    typescript: 'TypeScript',
};

// Judge0 CE status IDs → human readable
const STATUS = {
    1: 'In Queue',
    2: 'Processing',
    3: 'Accepted',
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error (SIGSEGV)',
    8: 'Runtime Error (SIGXFSZ)',
    9: 'Runtime Error (SIGFPE)',
    10: 'Runtime Error (SIGABRT)',
    11: 'Runtime Error (NZEC)',
    12: 'Runtime Error (Other)',
    13: 'Internal Error',
    14: 'Exec Format Error',
};

class CodeExecutionService {
    constructor() {
        this.apiUrl = JUDGE0_URL;
        console.log('✅ Using Judge0 CE (ce.judge0.com) — no API key required');
    }

    /**
     * Execute code using Judge0 CE.
     * @param {string} code     - Source code to run
     * @param {string} language - Language key (e.g. 'python', 'javascript')
     * @param {string} stdin    - Standard input (optional)
     */
    async execute(code, language, stdin = '') {
        const langKey = language.toLowerCase();
        const languageId = LANGUAGE_IDS[langKey];

        if (!languageId) {
            throw new Error(
                `Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_IDS).join(', ')}`
            );
        }

        try {
            // POST submission with wait=true → synchronous response
            const response = await axios.post(
                `${this.apiUrl}/submissions?base64_encoded=false&wait=true`,
                {
                    source_code: code,
                    language_id: languageId,
                    stdin: stdin || '',
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 20000,   // 20s overall timeout
                }
            );

            const data = response.data;
            const statusId = data.status?.id ?? 0;
            const statusDesc = STATUS[statusId] ?? data.status?.description ?? 'Unknown';

            const stdout = data.stdout ?? '';
            const stderr = data.stderr ?? '';
            const compileErr = data.compile_output ?? '';

            // Compile error = language-level failure
            if (statusId === 6) {
                return {
                    success: false,
                    output: '',
                    error: compileErr || 'Compilation error',
                    status: 'Compilation Error',
                    language,
                    time: data.time,
                };
            }

            // Runtime error
            if (statusId >= 7 && statusId <= 12) {
                return {
                    success: false,
                    output: stdout,
                    error: stderr || statusDesc,
                    status: statusDesc,
                    language,
                    time: data.time,
                };
            }

            // Time limit exceeded
            if (statusId === 5) {
                return {
                    success: false,
                    output: '',
                    error: 'Time limit exceeded (3 seconds)',
                    status: 'Time Limit Exceeded',
                    language,
                    time: data.time,
                };
            }

            // Success (Accepted = 3)
            return {
                success: true,
                output: stdout || 'Code executed successfully (no output)',
                error: stderr || '',
                status: 'Success',
                language,
                time: data.time,
                memory: data.memory,
            };

        } catch (error) {
            const status = error.response?.status;
            const msg = error.response?.data?.error || error.message;

            if (status === 429) throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            if (status === 503) throw new Error('Code execution service temporarily unavailable. Try again in a few seconds.');

            throw new Error(`Execution failed: ${msg}`);
        }
    }

    /**
     * Returns list of supported languages for the UI.
     */
    getSupportedLanguages() {
        return Object.keys(LANGUAGE_IDS).map(key => ({
            id: key,
            language: key,
            displayName: LANGUAGE_DISPLAY_NAMES[key] ?? key,
            languageId: LANGUAGE_IDS[key],
        }));
    }

    /**
     * Returns appropriate source filename for a language.
     */
    getFileName(language) {
        const fileNames = {
            javascript: 'index.js',
            python: 'main.py',
            java: 'Main.java',
            cpp: 'main.cpp',
            c: 'main.c',
            go: 'main.go',
            ruby: 'main.rb',
            php: 'index.php',
            typescript: 'index.ts',
            rust: 'main.rs',
            kotlin: 'Main.kt',
            swift: 'main.swift',
            csharp: 'Main.cs',
        };
        return fileNames[language] ?? 'main.txt';
    }
}

export default new CodeExecutionService();
