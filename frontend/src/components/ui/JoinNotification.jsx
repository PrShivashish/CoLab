import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

export function JoinNotification({ username }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-900/20 min-w-[280px]"
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#DB2777] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-900/30">
                    {username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#030303] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</span>
                </div>
                <div className="text-sm font-semibold text-white truncate mt-0.5">
                    {username}
                </div>
            </div>

            {/* Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7C3AED] to-[#DB2777] rounded-l-xl" />
        </motion.div>
    );
}
