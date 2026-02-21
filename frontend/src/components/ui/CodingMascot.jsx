import React from 'react';
import { motion } from 'framer-motion';

export default function CodingMascot() {
    return (
        <div className="relative w-64 h-64 md:w-96 md:h-96">
            {/* Floating Elements - Parallax Container */}

            {/* Code Window Background */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col gap-4 shadow-2xl"
            >
                {/* Header */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>

                {/* Code Lines */}
                <div className="space-y-3 opacity-50">
                    <motion.div
                        animate={{ width: ["60%", "70%", "60%"] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="h-2 bg-white/20 rounded-full w-2/3"
                    />
                    <motion.div
                        animate={{ width: ["40%", "50%", "40%"] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        className="h-2 bg-[#7C3AED]/40 rounded-full w-1/2 ml-4"
                    />
                    <motion.div
                        animate={{ width: ["50%", "40%", "50%"] }}
                        transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
                        className="h-2 bg-[#7C3AED]/40 rounded-full w-1/3 ml-4"
                    />
                    <div className="h-2 bg-white/20 rounded-full w-1/4" />
                </div>
            </motion.div>

            {/* The Mascot - "Cody" The Bot */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 -bottom-12 w-48 h-48 md:w-64 md:h-64"
            >
                {/* Head */}
                <div className="relative w-full h-full">
                    {/* Face Shape */}
                    <div className="absolute inset-0 bg-[#18181b] border-4 border-[#7C3AED] rounded-[2rem] shadow-[0_0_50px_rgba(124,58,237,0.3)] overflow-hidden">
                        {/* Screen Grid */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(#7C3AED 1px, transparent 1px), linear-gradient(90deg, #7C3AED 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />

                        {/* Eyes Container */}
                        <div className="absolute top-1/3 left-0 right-0 flex justify-center gap-8 px-8">
                            {/* Left Eye */}
                            <motion.div
                                initial={{ scaleY: 1 }}
                                animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 4] }}
                                className="w-12 h-16 bg-[#00F0FF] rounded-full shadow-[0_0_20px_#00F0FF]"
                            />
                            {/* Right Eye */}
                            <motion.div
                                initial={{ scaleY: 1 }}
                                animate={{ scaleY: [1, 0.1, 1, 1, 1] }}
                                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 4] }}
                                className="w-12 h-16 bg-[#00F0FF] rounded-full shadow-[0_0_20px_#00F0FF]"
                            />
                        </div>

                        {/* Mouth */}
                        <motion.div
                            animate={{ width: ["20px", "40px", "20px"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 h-2 bg-[#00F0FF] rounded-full shadow-[0_0_10px_#00F0FF]"
                        />
                    </div>

                    {/* Antenna */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-8 bg-gray-600">
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_red]"
                        />
                    </div>

                    {/* Headphones */}
                    <div className="absolute top-1/2 -left-4 w-4 h-24 bg-gray-800 rounded-l-xl border-l border-gray-700" />
                    <div className="absolute top-1/2 -right-4 w-4 h-24 bg-gray-800 rounded-r-xl border-r border-gray-700" />
                </div>
            </motion.div>

            {/* Floating Syntax Symbols */}
            <ParallaxSymbol symbol="{" delay={0} x="-20%" y="-10%" color="#FF0099" />
            <ParallaxSymbol symbol="}" delay={1} x="100%" y="20%" color="#FF0099" />
            <ParallaxSymbol symbol="</>" delay={2} x="-10%" y="80%" color="#CCFF00" />
            <ParallaxSymbol symbol=";" delay={3} x="90%" y="-20%" color="#00F0FF" />

        </div>
    );
}

function ParallaxSymbol({ symbol, delay, x, y, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{
                opacity: { delay, duration: 0.5 },
                scale: { delay, duration: 0.5, type: "spring" },
                y: { duration: 3, repeat: Infinity, delay: delay * 2, ease: "easeInOut" }
            }}
            style={{ left: x, top: y, color }}
            className="absolute text-4xl md:text-6xl font-black font-mono drop-shadow-lg z-20"
        >
            {symbol}
        </motion.div>
    )
}
