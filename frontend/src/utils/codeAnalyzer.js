/**
 * Code Analyzer - Intelligently extracts meaningful names from code
 * Analyzes code structure to generate smart filenames
 */

// Language to file extension mapping
const languageExtensions = {
    javascript: '.js',
    python: '.py',
    java: '.java',
    cpp: '.cpp',
    c: '.c',
    go: '.go',
    rust: '.rs',
    typescript: '.ts',
    php: '.php',
    ruby: '.rb',
    swift: '.swift',
    kotlin: '.kt',
    csharp: '.cs',
    r: '.r',
    perl: '.pl',
    scala: '.scala',
    shell: '.sh',
    sql: '.sql',
    html: '.html',
    css: '.css',
};

/**
 * Get file extension for a language
 */
export function getFileExtension(language) {
    return languageExtensions[language.toLowerCase()] || '.txt';
}

/**
 * Analyze code to extract a meaningful name
 * Priority: Class names > Main functions > Comments > Keywords
 */
export function analyzeCodePurpose(code, language) {
    if (!code || typeof code !== 'string') {
        return 'untitled_code';
    }

    const lang = language.toLowerCase();
    let detectedName = null;

    // Try different extraction methods in order of priority
    detectedName = extractClassName(code, lang);
    if (detectedName) return sanitizeFilename(detectedName);

    detectedName = extractMainFunction(code, lang);
    if (detectedName) return sanitizeFilename(detectedName);

    detectedName = extractFromComments(code, lang);
    if (detectedName) return sanitizeFilename(detectedName);

    detectedName = extractDomainKeywords(code);
    if (detectedName) return sanitizeFilename(detectedName);

    // Fallback
    return 'untitled_code';
}

/**
 * Extract class name from code
 */
function extractClassName(code, language) {
    const patterns = {
        python: /class\s+([A-Z][a-zA-Z0-9_]*)/,
        javascript: /class\s+([A-Z][a-zA-Z0-9_]*)/,
        typescript: /class\s+([A-Z][a-zA-Z0-9_]*)/,
        java: /(?:public\s+)?class\s+([A-Z][a-zA-Z0-9_]*)/,
        cpp: /class\s+([A-Z][a-zA-Z0-9_]*)/,
        c: /struct\s+([a-zA-Z][a-zA-Z0-9_]*)/,
        csharp: /(?:public\s+)?class\s+([A-Z][a-zA-Z0-9_]*)/,
        swift: /class\s+([A-Z][a-zA-Z0-9_]*)/,
        kotlin: /class\s+([A-Z][a-zA-Z0-9_]*)/,
        rust: /struct\s+([A-Z][a-zA-Z0-9_]*)/,
    };

    const pattern = patterns[language];
    if (!pattern) return null;

    const match = code.match(pattern);
    if (match && match[1]) {
        return camelToSnake(match[1]);
    }

    return null;
}

/**
 * Extract main function name
 */
function extractMainFunction(code, language) {
    const patterns = {
        python: /def\s+([a-z_][a-zA-Z0-9_]*)\s*\(/,
        javascript: /function\s+([a-z_][a-zA-Z0-9_]*)\s*\(/,
        typescript: /function\s+([a-z_][a-zA-Z0-9_]*)\s*\(/,
        go: /func\s+([a-z_][a-zA-Z0-9_]*)\s*\(/,
        rust: /fn\s+([a-z_][a-zA-Z0-9_]*)\s*\(/,
        c: /[a-zA-Z_][a-zA-Z0-9_]*\s+([a-z_][a-zA-Z0-9_]*)\s*\(/,
        cpp: /[a-zA-Z_][a-zA-Z0-9_]*\s+([a-z_][a-zA-Z0-9_]*)\s*\(/,
    };

    const pattern = patterns[language];
    if (!pattern) return null;

    const match = code.match(pattern);
    if (match && match[1] && match[1] !== 'main') {
        return match[1];
    }

    return null;
}

/**
 * Extract meaningful text from comments
 */
function extractFromComments(code, language) {
    const commentPatterns = {
        python: /#\s*([A-Z][a-zA-Z\s]{3,40})/,
        javascript: /\/\/\s*([A-Z][a-zA-Z\s]{3,40})/,
        typescript: /\/\/\s*([A-Z][a-zA-Z\s]{3,40})/,
        java: /\/\/\s*([A-Z][a-zA-Z\s]{3,40})/,
        cpp: /\/\/\s*([A-Z][a-zA-Z\s]{3,40})/,
        c: /\/\/\s*([A-Z][a-zA-Z\s]{3,40})/,
        go: /\/\/\s*([A-Z][a-zA-Z\s]{3,40})/,
        rust: /\/\/\s*([A-Z][a-zA-Z\s]{3,40})/,
    };

    const pattern = commentPatterns[language];
    if (!pattern) return null;

    const match = code.match(pattern);
    if (match && match[1]) {
        return match[1].trim().toLowerCase().replace(/\s+/g, '_');
    }

    return null;
}

/**
 * Extract domain keywords (payroll, invoice, calculator, etc.)
 */
function extractDomainKeywords(code) {
    const keywords = [
        'payroll', 'invoice', 'calculator', 'employee', 'student',
        'inventory', 'banking', 'ecommerce', 'dashboard', 'authentication',
        'signup', 'login', 'todo', 'notes', 'chat', 'game', 'quiz',
        'weather', 'converter', 'manager', 'system', 'tracker'
    ];

    const lowerCode = code.toLowerCase();

    for (const keyword of keywords) {
        if (lowerCode.includes(keyword)) {
            return keyword;
        }
    }

    return null;
}

/**
 * Convert camelCase or PascalCase to snake_case
 */
function camelToSnake(str) {
    return str
        .replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace(/^_/, '');
}

/**
 * Sanitize filename for filesystem
 */
export function sanitizeFilename(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 50) || 'untitled_code';
}

/**
 * Generate smart filename with extension
 */
export function generateSmartFilename(code, language) {
    const baseName = analyzeCodePurpose(code, language);
    const extension = getFileExtension(language);
    return `${baseName}${extension}`;
}
