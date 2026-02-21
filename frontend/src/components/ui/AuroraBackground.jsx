import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export const AuroraBackground = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                "relative flex flex-col h-[100vh] items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] transition-bg",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className={cn(
                        // The Aurora Gals
                        "filter blur-[100px] opacity-50",
                        "absolute top-0 left-0 w-full h-full",
                        // Animation
                        "after:content-[''] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:animate-aurora after:[background-size:200%,_100%] after:[mix-blend-mode:var(--aurora-blend-mode)] pointer-events-none",
                        "absolute -inset-[10px] opacity-50",
                        "[--white-gradient:repeating-linear-gradient(100deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_7%,transparent_10%,transparent_12%,rgba(255,255,255,1)_16%)]",
                        "[--dark-gradient:repeating-linear-gradient(100deg,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_7%,transparent_10%,transparent_12%,rgba(0,0,0,1)_16%)]",
                        "[--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#6366f1_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)]",
                        "[background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%]",
                        "after:inset-0 after:[mix-blend-mode:var(--aurora-blend-mode)] after:content-[''] after:absolute after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:animate-aurora after:[background-attachment:fixed]"
                    )}
                />
            </div>
            {children}
        </div>
    );
};
