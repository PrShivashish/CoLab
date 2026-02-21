import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * ParallaxLayer - Creates a mouse-reactive parallax effect
 * @param {number} depth - Movement multiplier (positive = moves with mouse, negative = against)
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Content to animate
 */
export default function ParallaxLayer({ depth = 0.5, className, children }) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for fluid movement
    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(useTransform(mouseX, [0, windowSize.width], [-20 * depth, 20 * depth]), springConfig);
    const y = useSpring(useTransform(mouseY, [0, windowSize.height], [-20 * depth, 20 * depth]), springConfig);

    useEffect(() => {
        // Set initial window size
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [depth, mouseX, mouseY]);

    return (
        <motion.div
            style={{ x, y }}
            className={cn("absolute inset-0 pointer-events-none", className)}
        >
            {children}
        </motion.div>
    );
}
