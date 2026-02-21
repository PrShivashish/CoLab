import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "../components/ui/AuroraBackground";
import { GlassCard } from "../components/ui/GlassCard";
import { SpotlightButton } from "../components/ui/SpotlightButton";
import { motion, AnimatePresence } from "framer-motion";
import { User, Hash, ArrowRight, Command, Copy, Check, Link as LinkIcon, Sparkles } from "lucide-react";
import axios from 'axios';
import ParallaxLayer from "../components/ui/ParallaxLayer";
import CodingMascot from "../components/ui/CodingMascot";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const createRoomId = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Room ID generated", {
      style: {
        background: 'var(--color-backgroundSecondary)',
        color: 'var(--color-foreground)',
        border: '1px solid var(--color-border)'
      },
      iconTheme: {
        primary: 'var(--color-accent)',
        secondary: 'var(--color-background)',
      },
      icon: '🎲'
    });
  };

  const joinRoom = async () => {
    if (!roomId || !username) {
      toast.error("Room ID & Username required", {
        style: {
          background: 'var(--color-backgroundSecondary)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)'
        }
      });
      return;
    }

    // ✅ Persist username to sessionStorage
    sessionStorage.setItem('username', username);

    try {
      // Generate invite link
      const response = await axios.post(`${BACKEND_URL}/api/room/generate-link`, { roomId });

      if (response.data.success) {
        setInviteLink(response.data.inviteLink);

        // Navigate to editor
        navigate(`/editor/${roomId}`, {
          state: { username },
        });
      }
    } catch (error) {
      console.error('Link generation error:', error);
      // Still allow join even if link generation fails
      navigate(`/editor/${roomId}`, {
        state: { username },
      });
    }
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <AuroraBackground>
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 overflow-hidden">

        {/* Parallax Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <ParallaxLayer depth={-0.1}>
            <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--color-accent)]/10 rounded-full blur-[100px] mix-blend-screen" />
          </ParallaxLayer>
          <ParallaxLayer depth={0.1}>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />
          </ParallaxLayer>
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">

          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md mx-auto"
          >
            <div className="perspective-1000">
              <motion.div
                whileHover={{ rotateY: 5, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlassCard className="p-8 md:p-12 border-[var(--color-border)] bg-[var(--color-background)]/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">

                  {/* Decorative gradient blob inside card */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-accent)]/20 rounded-full blur-3xl group-hover:bg-[var(--color-accent)]/30 transition-all duration-500" />

                  {/* Header */}
                  <div className="text-center mb-10 relative z-10">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                      className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent)] to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[var(--color-accent)]/20"
                    >
                      <Command className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black tracking-tight text-[var(--color-foreground)] mb-3">Initialize Session</h2>
                    <p className="text-[var(--color-foregroundMuted)] text-lg">Enter the void. Code together.</p>
                  </div>

                  {/* Form */}
                  <div className="space-y-6 relative z-10">

                    {/* Room ID Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-foregroundMuted)] ml-1">Room ID</label>
                      <div className="group relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foregroundMuted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
                        <input
                          type="text"
                          className="w-full bg-[var(--color-backgroundSecondary)]/50 border border-[var(--color-border)] rounded-xl py-4 pl-12 pr-4 text-[var(--color-foreground)] placeholder:text-[var(--color-foregroundMuted)]/50 focus:outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-background)] transition-all shadow-sm"
                          placeholder="e.g. 880e92..."
                          onChange={(e) => setRoomId(e.target.value)}
                          value={roomId}
                          onKeyUp={handleInputEnter}
                        />
                      </div>
                    </div>

                    {/* Username Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-foregroundMuted)] ml-1">Identity</label>
                      <div className="group relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-foregroundMuted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
                        <input
                          type="text"
                          className="w-full bg-[var(--color-backgroundSecondary)]/50 border border-[var(--color-border)] rounded-xl py-4 pl-12 pr-4 text-[var(--color-foreground)] placeholder:text-[var(--color-foregroundMuted)]/50 focus:outline-none focus:border-[var(--color-accent)] focus:bg-[var(--color-background)] transition-all shadow-sm"
                          placeholder="Enter your username"
                          onChange={(e) => setUsername(e.target.value)}
                          value={username}
                          onKeyUp={handleInputEnter}
                        />
                      </div>
                    </div>

                    {/* Main Action */}
                    <SpotlightButton
                      className="w-full h-14 text-lg font-bold bg-[var(--color-accent)] hover:bg-[var(--color-accentHover)] border-none text-white shadow-lg shadow-[var(--color-accent)]/25 mt-4"
                      onClick={joinRoom}
                      variant="primary"
                    >
                      Join Room <ArrowRight className="w-5 h-5 ml-2" />
                    </SpotlightButton>

                    {/* Create Room Link */}
                    <div className="text-center mt-6 pt-4 border-t border-[var(--color-border)]/50">
                      <span className="text-[var(--color-foregroundMuted)]">No room ID? </span>
                      <button
                        onClick={createRoomId}
                        className="text-[var(--color-accent)] hover:text-[var(--color-accentLight)] font-bold transition-colors hover:underline decoration-2 underline-offset-4 flex items-center justify-center gap-2 mx-auto mt-2"
                      >
                        <Sparkles className="w-4 h-4" /> Generate New Session
                      </button>
                    </div>

                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: 3D Mascot - Hidden on Mobile */}
          <div className="hidden lg:flex justify-center items-center h-[600px] relative perspective-1000">
            <ParallaxLayer depth={0.2} className="relative z-10 w-full h-full flex items-center justify-center">
              {/* Floating Elements Background */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute inset-0"
              >
                <div className="absolute top-1/4 right-10 p-4 rounded-xl bg-[var(--color-background)]/80 border border-[var(--color-border)] shadow-xl backdrop-blur-md rotate-12 animate-float-slow">
                  <div className="w-8 h-2 bg-[var(--color-foreground)]/20 rounded mb-2" />
                  <div className="w-16 h-2 bg-[var(--color-foreground)]/10 rounded" />
                </div>
                <div className="absolute bottom-1/4 left-10 p-4 rounded-xl bg-[var(--color-background)]/80 border border-[var(--color-border)] shadow-xl backdrop-blur-md -rotate-6 animate-float-delayed">
                  <div className="w-12 h-12 rounded-full border-4 border-[var(--color-accent)] flex items-center justify-center">
                    <span className="text-[var(--color-accent)] font-bold font-mono">JS</span>
                  </div>
                </div>
              </motion.div>

              <div className="scale-125 transform transition-transform duration-500 hover:scale-150">
                <CodingMascot />
              </div>
            </ParallaxLayer>
          </div>

        </div>

        {/* Footer info */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-[var(--color-foregroundMuted)] font-mono opacity-60">
          SECURE CONNECTION • END-TO-END ENCRYPTED
        </div>

      </div>
    </AuroraBackground>
  );
}
