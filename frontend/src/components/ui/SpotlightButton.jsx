import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { cn } from "../../utils/cn";

export const SpotlightButton = ({ children, onClick, className, variant = "primary" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    const variants = {
        primary: "bg-[var(--color-backgroundTertiary)] text-[var(--color-foreground)] border-[var(--color-border)]",
        secondary: "bg-transparent text-[var(--color-foregroundMuted)] border-transparent hover:bg-[var(--color-backgroundSecondary)]",
        ghost: "bg-transparent text-[var(--color-foregroundMuted)] hover:text-[var(--color-foreground)]"
    };

    return (
        <button
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border px-8 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]",
                variants[variant],
                className
            )}
        >
            <div
                ref={divRef}
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, var(--color-accent), transparent 40%)`,
                }}
            />

            {/* Spotlight border effect */}
            <div
                className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(150px circle at ${position.x}px ${position.y}px, var(--color-accent), transparent 100%)`,
                    maskImage: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                    padding: "1px",
                }}
            />

            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </button>
    );
};
