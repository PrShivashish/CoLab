import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, Zap, Globe, Share2, Terminal, ChevronRight } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { SpotlightButton } from "../components/ui/SpotlightButton";
import { CollabEditorMockup, SmartTerminalMockup, ShareLinkMockup, MultiLanguageMockup } from "../components/ui/FeatureMockups";
import CodingMascot from "../components/ui/CodingMascot";
import LanguageMarquee from "../components/ui/LanguageMarquee";

// --- Main Page ---

export default function LandingPage() {
    const { scrollYProgress, scrollY } = useScroll();

    // Hero parallax
    // Hero parallax - smoother, less distance to prevent breaking
    const heroY = useTransform(scrollY, [0, 500], [0, 100]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

    // Scroll-based color transitions for sections below marquee
    const featuresScrollY = useTransform(scrollY, [600, 1400], [0, 1]);
    const ctaScrollY = useTransform(scrollY, [1800, 2600], [0, 1]);

    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-x-hidden">

            {/* Scroll Progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent)] to-purple-500 origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Floating Header */}
            {/* Floating Header - Seamless Blend */}
            <nav className="fixed top-0 w-full z-40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)] to-transparent opacity-90 h-32 -z-10" />
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="text-2xl font-black tracking-tight">
                        <span className="text-[var(--color-foreground)]">Co</span>
                        <span className="text-[var(--color-accent)]">Lab</span>
                    </div>
                    <ThemeToggle />
                </div>
            </nav>

            {/* ======= HERO SECTION - WITH CODING MASCOT ======= */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">

                {/* Yellow-Orange-Black Gradient Mix */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#f59e0b_0%,_#ea580c_15%,_#7c2d12_40%,_var(--color-background)_70%)] opacity-40" />

                {/* Scrolling Language Marquee - Background Layer */}


                {/* Animated Blobs - Reduced Opacity */}
                {/* Animated Glow Blobs - Warm Tones */}
                <motion.div
                    className="absolute top-1/4 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -30, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Hero Content - Grid Layout */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

                    {/* LEFT: Text Content */}
                    <motion.div
                        style={{ y: heroY, opacity: heroOpacity }}
                        className="text-left space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
                            </span>
                            <span className="text-sm font-bold text-[var(--color-accent)]">CoLab 2.0 — Live Now</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]"
                        >
                            <span className="text-[var(--color-foreground)]">Dream. Code.</span>
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] via-purple-500 to-pink-500">
                                Together.
                            </span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="text-lg md:text-xl text-[var(--color-foreground)] font-medium leading-relaxed max-w-xl"
                        >
                            The world's most <span className="text-[var(--color-accent)] font-bold">advanced</span> real-time collaboration platform.
                            <br />
                            <span className="text-[var(--color-foregroundMuted)]">Code together. Execute instantly. Ship faster.</span>
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex flex-col sm:flex-row items-start gap-4"
                        >
                            <Link to="/home">
                                <SpotlightButton className="group px-8 py-4 text-lg font-bold">
                                    Start Coding Now
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </SpotlightButton>
                            </Link>
                            <a href="#features">
                                <SpotlightButton className="px-8 py-4 text-lg font-bold">
                                    See Features
                                </SpotlightButton>
                            </a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-foregroundMuted)]"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-[var(--color-accent)]">13+</span>
                                <span>Languages</span>
                            </div>
                            <div className="w-px h-6 bg-[var(--color-border)]" />
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-[var(--color-accent)]">0ms</span>
                                <span>Latency</span>
                            </div>
                            <div className="w-px h-6 bg-[var(--color-border)]" />
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-[var(--color-accent)]">∞</span>
                                <span>Possibilities</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Floating Coding Mascot - Scaled for Balance */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 80 }}
                        className="relative flex items-center justify-center lg:justify-end"
                        style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }} // Slight opposing parallax
                    >
                        <div className="relative scale-90 lg:scale-100">
                            <CodingMascot />
                        </div>
                    </motion.div>

                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-24 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-[var(--color-accent)]/50 flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
                        />
                    </div>
                </motion.div>
            </section>

            {/* ======= SCROLLING LANGUAGE MARQUEE SECTION - DUAL LAYER ======= */}
            <section className="relative py-6 bg-gradient-to-b from-[var(--color-background)] via-[var(--color-backgroundSecondary)] to-[var(--color-background)] border-y border-[var(--color-border)]/30 overflow-hidden">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent" />

                <LanguageMarquee />
            </section>

            {/* ======= FEATURES SECTION - UNIQUE LAYOUTS ======= */}
            <section id="features" className="relative py-32 overflow-hidden">
                {/* Scroll-reactive gradient background - blends with hero purple/violet theme */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: useTransform(
                            featuresScrollY,
                            [0, 0.5, 1],
                            [
                                'radial-gradient(ellipse at top, rgba(88, 28, 135, 0.12) 0%, var(--color-background) 55%)',
                                'radial-gradient(ellipse at center, rgba(76, 29, 149, 0.18) 0%, rgba(49, 46, 129, 0.08) 50%, var(--color-background) 75%)',
                                'radial-gradient(ellipse at bottom, rgba(49, 46, 129, 0.15) 0%, rgba(30, 27, 75, 0.05) 60%, var(--color-background) 85%)'
                            ]
                        )
                    }}
                />

                {/* Animated glow blob that fades in as you scroll */}
                <motion.div
                    className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                        opacity: useTransform(featuresScrollY, [0, 0.5, 1], [0, 0.5, 0.8])
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Secondary blob on left side */}
                <motion.div
                    className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)',
                        opacity: useTransform(featuresScrollY, [0, 0.5, 1], [0, 0.4, 0.7])
                    }}
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative z-10 max-w-7xl mx-auto px-6">

                    {/* Section Header */}
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-black mb-6"
                        >
                            Everything you need.
                            <br />
                            <span className="text-[var(--color-foregroundMuted)]">Nothing you don't.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-[var(--color-foregroundMuted)] max-w-2xl mx-auto"
                        >
                            Powerful tools designed for collaborative mastery.
                        </motion.p>
                    </div>

                    {/* Feature 1: Real-time Collaboration - Layout: LEFT */}
                    <FeatureSection
                        icon={Users}
                        title="Real-time Collaboration"
                        description="Code together with your team in perfect sync. See every keystroke, every cursor, every change — as it happens. No refresh. No lag. Just pure collaboration magic."
                        mockup={<CollabEditorMockup />}
                        layout="left"
                        delay={0}
                    />

                    {/* Feature 2: Multi-Language Support - Layout: RIGHT */}
                    <FeatureSection
                        icon={Globe}
                        title="13+ Languages. One Platform."
                        description="From Python to Rust, JavaScript to C++. Switch languages seamlessly with intelligent syntax highlighting and autocomplete. Your multi-lingual coding sidekick."
                        mockup={<MultiLanguageMockup />}
                        layout="right"
                        delay={0.2}
                    />

                    {/* Feature 3: Smart Terminal - Layout: LEFT */}
                    <FeatureSection
                        icon={Terminal}
                        title="Built-in Smart Terminal"
                        description="Execute commands, run scripts, and see beautiful ANSI-colored output. Integrated, powerful, and lightning-fast — your command line, elevated."
                        mockup={<SmartTerminalMockup />}
                        layout="left"
                        delay={0.4}
                    />

                    {/* Feature 4: Share with One Click - Layout: CENTER */}
                    <FeatureSection
                        icon={Share2}
                        title="Share with One Click"
                        description="Generate a secure invite link in milliseconds. Copy, share, and start collaborating. It's that simple."
                        mockup={<ShareLinkMockup />}
                        layout="center"
                        delay={0.6}
                    />

                </div>
            </section>

            {/* ======= FINAL CTA ======= */}
            <section className="relative py-32 overflow-hidden">
                {/* Base gradient layer */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-950/8 via-indigo-950/5 to-[var(--color-background)]" />

                {/* Scroll-reactive gradient overlay */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: useTransform(
                            ctaScrollY,
                            [0, 0.5, 1],
                            [
                                'radial-gradient(ellipse at top, rgba(76, 29, 149, 0.08) 0%, transparent 50%)',
                                'radial-gradient(ellipse at center, rgba(49, 46, 129, 0.15) 0%, transparent 60%)',
                                'radial-gradient(ellipse at bottom, rgba(49, 46, 129, 0.2) 0%, rgba(30, 27, 75, 0.1) 40%, transparent 70%)'
                            ]
                        ),
                        opacity: useTransform(ctaScrollY, [0, 1], [0.5, 1])
                    }}
                />

                {/* Animated accent blob */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
                        opacity: useTransform(ctaScrollY, [0, 0.5, 1], [0, 0.6, 0.9])
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="text-7xl">🚀</div>
                        <h2 className="text-5xl md:text-7xl font-black">
                            Ready to code in the future?
                        </h2>
                        <p className="text-xl text-[var(--color-foregroundMuted)]">
                            Join thousands of developers already building the next big thing.
                        </p>
                        <Link to="/home">
                            <SpotlightButton className="text-xl px-12 py-5 mt-8">
                                Launch Editor
                            </SpotlightButton>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-[var(--color-border)]/50 py-8 overflow-hidden">
                {/* Subtle purple gradient from top */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/5 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-sm text-[var(--color-foregroundMuted)]">
                    <p>© 2026 CoLab. Built with ❤️ for developers.</p>
                </div>
            </footer>

        </div>
    );
}

// ======= REUSABLE FEATURE SECTION COMPONENT =======
function FeatureSection({ icon: Icon, title, description, mockup, layout = "left", delay = 0 }) {
    const isCenter = layout === "center";
    const isRight = layout === "right";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay, duration: 0.6 }}
            className={`
                grid gap-12 items-center mb-32
                ${isCenter ? 'grid-cols-1 text-center' : 'grid-cols-1 lg:grid-cols-2'}
            `}
        >
            {/* Text Content */}
            <div className={`space-y-6 ${isRight ? 'lg:order-2' : ''} ${isCenter ? 'max-w-3xl mx-auto' : ''}`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-purple-600 flex items-center justify-center ${isCenter ? 'mx-auto' : ''}`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-4xl md:text-5xl font-black leading-tight text-[var(--color-foreground)]">
                    {title}
                </h3>
                <p className="text-lg md:text-xl text-[var(--color-foregroundMuted)] leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Visual Mockup */}
            <div className={`flex justify-center ${isRight ? 'lg:order-1' : ''}`}>
                {mockup}
            </div>
        </motion.div>
    );
}
