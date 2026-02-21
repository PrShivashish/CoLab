import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Loader2, Link, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import ParallaxLayer from '../components/ui/ParallaxLayer';
import CodingMascot from '../components/ui/CodingMascot';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function JoinViaLink() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('validating'); // 'validating' | 'success' | 'error'
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setError('No invite token found in URL');
            return;
        }

        validateAndJoin(token);
    }, [searchParams]);

    const validateAndJoin = async (token) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/room/validate-token`, { token });

            if (response.data.success) {
                const { roomId } = response.data;

                // Get username from sessionStorage or prompt
                const username = sessionStorage.getItem('username');

                if (!username) {
                    // Redirect to home with roomId and token stored
                    sessionStorage.setItem('pendingRoomToken', token);
                    sessionStorage.setItem('pendingRoomId', roomId);
                    navigate('/', {
                        state: {
                            message: 'Please enter your username to join the room',
                            roomId
                        }
                    });
                    return;
                }

                // Store token for socket authentication
                sessionStorage.setItem('roomToken', token);

                setStatus('success');

                // Navigate to editor after brief delay
                setTimeout(() => {
                    navigate(`/editor/${roomId}`, { state: { username, token } });
                }, 1500); // Slightly longer delay to show success animation
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setStatus('error');
            setError(error.response?.data?.error || 'Invalid or expired invite link');

            setTimeout(() => {
                navigate('/');
            }, 3500);
        }
    };

    return (
        <AuroraBackground>
            <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 overflow-hidden">

                {/* Parallax Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <ParallaxLayer depth={-0.2}>
                        <div className="absolute top-10 left-1/4 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-[80px] mix-blend-screen" />
                    </ParallaxLayer>
                    <ParallaxLayer depth={0.2}>
                        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] mix-blend-screen" />
                    </ParallaxLayer>
                </div>

                {/* 3D Mascot Floating Behind - Subtle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-30 scale-150 blur-sm">
                    <CodingMascot />
                </div>


                <GlassCard className="max-w-md w-full p-10 border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    {/* Status Indicators */}
                    <div className="text-center relative z-10">
                        {status === 'validating' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="relative w-20 h-20 mx-auto">
                                    <div className="absolute inset-0 rounded-full border-4 border-[var(--color-accent)]/30 animate-ping" />
                                    <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-accent)] animate-spin" />
                                    <div className="absolute inset-2 bg-[var(--color-backgroundSecondary)] rounded-full flex items-center justify-center shadow-inner">
                                        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--color-foreground)] mb-2 tracking-tight">Accessing Neural Link</h2>
                                    <p className="text-[var(--color-foregroundMuted)] font-mono text-sm animate-pulse">Validating credentials...</p>
                                </div>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    type="spring"
                                    className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--color-foreground)] mb-2 tracking-tight">Access Granted</h2>
                                    <p className="text-[var(--color-foregroundMuted)]">Warping to session...</p>
                                </div>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    type="spring"
                                    className="w-20 h-20 bg-red-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-red-500/30"
                                >
                                    <XCircle className="w-10 h-10 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl font-black text-[var(--color-foreground)] mb-2 tracking-tight">Connection Failed</h2>
                                    <p className="text-red-400 font-medium mb-4">{error}</p>
                                    <p className="text-xs text-[var(--color-foregroundMuted)] font-mono bg-[var(--color-backgroundSecondary)] py-2 rounded">Redirecting to home base...</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </AuroraBackground>
    );
}
