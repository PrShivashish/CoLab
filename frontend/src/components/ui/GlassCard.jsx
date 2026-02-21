import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const GlassCard = ({ children, className, hoverEffect = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/50 backdrop-blur-xl transition-all duration-300",
                hoverEffect && "hover:border-[var(--color-border)] hover:bg-[var(--color-backgroundSecondary)]/50 hover:shadow-2xl hover:shadow-[var(--color-accent)]/10",
                className
            )}
            {...props}
        >
            {/* Noise texture overlay for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Content */}
            <div className="relative z-10">{children}</div>

            {/* Gradient glow on top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent opacity-50" />
        </motion.div>
    );
};
