// Simple in-memory rate limiter
// In production, use Redis for distributed rate limiting

class RateLimiter {
    constructor() {
        // Store: { userId/ip: { minute: count, day: count, lastReset: timestamp } }
        this.store = new Map();
        this.RPM_LIMIT = 15; // Gemini free tier: 15 requests per minute
        this.DAILY_LIMIT = 1500; // Gemini free tier: 1500 requests per day
    }

    getKey(req) {
        // Use user ID if authenticated, otherwise IP address
        return req.user?.id || req.ip || 'anonymous';
    }

    checkLimit(key) {
        const now = Date.now();
        const minuteWindow = Math.floor(now / 60000); // 1 minute window
        const dayKey = new Date().toDateString(); // Daily window

        if (!this.store.has(key)) {
            this.store.set(key, {
                minuteCount: 0,
                minuteWindow,
                dailyCount: 0,
                dayKey,
            });
        }

        const userData = this.store.get(key);

        // Reset minute counter if window has passed
        if (userData.minuteWindow !== minuteWindow) {
            userData.minuteCount = 0;
            userData.minuteWindow = minuteWindow;
        }

        // Reset daily counter if day has changed
        if (userData.dayKey !== dayKey) {
            userData.dailyCount = 0;
            userData.dayKey = dayKey;
        }

        // Check limits
        if (userData.minuteCount >= this.RPM_LIMIT) {
            return {
                allowed: false,
                error: 'Rate limit exceeded: Too many requests per minute. Please wait.',
                retryAfter: 60,
            };
        }

        if (userData.dailyCount >= this.DAILY_LIMIT) {
            return {
                allowed: false,
                error: 'Daily quota exceeded. Upgrade to Pro for unlimited requests.',
                retryAfter: null,
            };
        }

        // Increment counters
        userData.minuteCount++;
        userData.dailyCount++;

        return {
            allowed: true,
            remaining: {
                minute: this.RPM_LIMIT - userData.minuteCount,
                daily: this.DAILY_LIMIT - userData.dailyCount,
            },
        };
    }

    middleware() {
        return (req, res, next) => {
            const key = this.getKey(req);
            const result = this.checkLimit(key);

            if (!result.allowed) {
                return res.status(429).json({
                    success: false,
                    error: result.error,
                    retryAfter: result.retryAfter,
                });
            }

            // Add rate limit info to response headers
            res.set({
                'X-RateLimit-Remaining-Minute': result.remaining.minute,
                'X-RateLimit-Remaining-Daily': result.remaining.daily,
            });

            next();
        };
    }

    // Cleanup old entries periodically
    cleanup() {
        const now = Date.now();
        const hourAgo = now - 3600000;

        for (const [key, data] of this.store.entries()) {
            // Remove entries older than 1 hour
            if (data.minuteWindow * 60000 < hourAgo) {
                this.store.delete(key);
            }
        }
    }
}

const rateLimiter = new RateLimiter();

// Cleanup every 10 minutes
setInterval(() => rateLimiter.cleanup(), 600000);

export default rateLimiter;
