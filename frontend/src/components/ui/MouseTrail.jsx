import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const MouseTrail = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [trail, setTrail] = useState([]);

    const springConfig = { damping: 25, stiffness: 700 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Add particle
            const id = Date.now();
            const symbols = ["{ }", "</>", "01", "&&", ";", "[]", "#"];
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const color = Math.random() > 0.5 ? "var(--color-accent)" : "#00F0FF";

            setTrail(prev => [...prev.slice(-15), { id, x: e.clientX, y: e.clientY, symbol, color }]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Main Cursor Follower */}
            <motion.div
                style={{ x, y }}
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[var(--color-accent)] mix-blend-difference"
            />

            {/* Code Trail */}
            {trail.map((t) => (
                <TrailParticle key={t.id} {...t} />
            ))}
        </div>
    );
};

const TrailParticle = ({ x, y, symbol, color }) => {
    return (
        <motion.div
            initial={{ opacity: 1, scale: 1, x: x - 10, y: y - 10 }}
            animate={{ opacity: 0, scale: 0, y: y + 20 }}
            transition={{ duration: 0.8 }}
            style={{ color }}
            className="fixed top-0 left-0 text-xs font-mono font-bold pointer-events-none"
        >
            {symbol}
        </motion.div>
    );
};
