import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const languages = [
    "JAVASCRIPT", "PYTHON", "GO", "RUST",
    "TYPESCRIPT", "C++", "JAVA", "RUBY",
    "SWIFT", "KOTLIN", "PHP", "SQL"
];

const devActions = [
    "BUILD", "DEPLOY", "SCALE", "SHIP",
    "CODE", "MERGE", "COMMIT", "PUSH",
    "TEST", "DEBUG", "REFACTOR", "OPTIMIZE"
];

export default function LanguageMarquee() {
    const containerRef = useRef(null);

    // Track scroll progress relative to the marquee section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Create smooth spring-based scroll velocity with MORE responsiveness
    const scrollVelocity = useSpring(scrollYProgress, {
        stiffness: 200,  // Increased from 100 for snappier response
        damping: 25,     // Reduced from 30 for less drag
        restDelta: 0.001
    });

    // INCREASED scroll range for FASTER parallax movement
    // Line 1: Moves left to right (reverse) as you scroll - MORE DRAMATIC
    const x1 = useTransform(scrollVelocity, [0, 1], ["-40%", "40%"]);  // Was -10% to 10%

    // Line 2: Moves right to left (normal) - OPPOSITE + MORE DRAMATIC
    const x2 = useTransform(scrollVelocity, [0, 1], ["40%", "-40%"]);  // Was 10% to -10%

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden select-none pointer-events-none">
            {/* Gradient Fade Edges */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--color-background)] via-transparent to-[var(--color-background)]" />

            {/* LINE 1: Languages (moving RIGHT on scroll) - TIGHTER SPACING */}
            <motion.div
                style={{ x: x1 }}
                className="flex gap-12 whitespace-nowrap py-2"
            >
                <motion.div
                    className="flex gap-12"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 25,
                            ease: "linear",
                        },
                    }}
                >
                    {[...languages, ...languages, ...languages, ...languages].map((lang, index) => (
                        <span
                            key={`lang-${index}`}
                            className="text-5xl md:text-7xl font-black text-transparent"
                            style={{
                                WebkitTextStroke: '2px var(--color-foreground)',
                                opacity: 0.6  // Increased from 0.3 for better visibility
                            }}
                        >
                            {lang}
                        </span>
                    ))}
                </motion.div>
            </motion.div>

            {/* LINE 2: Dev Actions (moving LEFT on scroll) - TIGHTER OVERLAP */}
            <motion.div
                style={{ x: x2 }}
                className="flex gap-12 whitespace-nowrap py-2 -mt-2"
            >
                <motion.div
                    className="flex gap-12"
                    animate={{ x: [-1000, 0] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {[...devActions, ...devActions, ...devActions, ...devActions].map((action, index) => (
                        <span
                            key={`action-${index}`}
                            className="text-6xl md:text-8xl font-black text-transparent"
                            style={{
                                WebkitTextStroke: '2.5px var(--color-accent)',  // Slightly thicker stroke
                                opacity: 0.7  // Increased from 0.5 for better visibility
                            }}
                        >
                            {action}
                        </span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
