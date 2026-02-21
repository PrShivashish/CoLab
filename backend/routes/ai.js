import express from 'express';
import geminiService from '../services/geminiService.js';
import rateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to all AI routes
router.use(rateLimiter.middleware());

/**
 * POST /api/ai/autocomplete
 * Get code completion suggestions
 */
router.post('/autocomplete', async (req, res) => {
    try {
        const { code, cursorPosition, language, filename } = req.body;

        if (!code || cursorPosition === undefined || !language) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: code, cursorPosition, language',
            });
        }

        // Extract code before cursor
        const codeBefore = code.substring(0, cursorPosition);

        // Get completion from Gemini
        const result = await geminiService.getCodeCompletion(
            codeBefore,
            language,
            filename
        );

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Autocomplete error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate completion',
        });
    }
});

/**
 * POST /api/ai/analyze
 * Analyze code for errors and improvements
 */
router.post('/analyze', async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: code, language',
            });
        }

        const analysis = await geminiService.analyzeCode(code, language);

        res.json({
            success: true,
            analysis,
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze code',
        });
    }
});

/**
 * POST /api/ai/generate
 * Generate code from description
 */
router.post('/generate', async (req, res) => {
    try {
        const { description, language, context } = req.body;

        if (!description || !language) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: description, language',
            });
        }

        const result = await geminiService.generateCode(
            description,
            language,
            context || {}
        );

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate code',
        });
    }
});

/**
 * POST /api/ai/debug
 * Debug runtime error
 */
router.post('/debug', async (req, res) => {
    try {
        const { error, code, language, stackTrace } = req.body;

        if (!error || !code || !language) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: error, code, language',
            });
        }

        const result = await geminiService.debugError(
            error,
            code,
            language,
            stackTrace
        );

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to debug error',
        });
    }
});

/**
 * POST /api/ai/chat
 * Chat with AI assistant
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: message',
            });
        }

        const result = await geminiService.chat(message, context || {});

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Chat error details:', {
            message: error.message,
            status: error.status ?? error.statusCode ?? error.code,
            stack: error.stack?.split('\n').slice(0, 3).join(' | ')
        });
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process chat message',
        });
    }
});

export default router;
