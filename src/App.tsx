import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer, { Track } from './components/MusicPlayer.tsx';
import BackgroundVisualizer from './components/BackgroundVisualizer.tsx';
import { motion } from 'motion/react';
import { Gamepad2, Info } from 'lucide-react';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-x-hidden">
      <BackgroundVisualizer />
      
      {/* Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-cyan flex items-center justify-center rounded-lg shadow-[0_0_15px_#00f3ff]">
            <Gamepad2 className="text-slate-950 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Rhythm <span className="text-neon-cyan">Viper</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
           <button className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white transition-colors">
             <Info className="w-4 h-4" /> HOW TO PLAY
           </button>
           <div className="h-6 w-px bg-slate-800" />
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
             <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">System Online</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 px-6 pb-12 z-10">
        
        {/* Left Side: Controls/Music */}
        <motion.section 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-1/3 flex flex-col gap-8 order-2 lg:order-1"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-[0.3em]">Audio Deck</h2>
            <MusicPlayer onTrackChange={setCurrentTrack} />
          </div>

          <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
             <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta" />
               MISSION STATUS
             </h3>
             <div className="space-y-3">
               {[
                 { label: "Sync Status", value: "OPTIMAL", color: "text-neon-cyan" },
                 { label: "Energy Level", value: "98%", color: "text-white" },
                 { label: "Vibration", value: currentTrack?.title || "IDLE", color: "text-neon-lime" }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                   <span className="text-[10px] font-mono text-slate-500 uppercase">{item.label}</span>
                   <span className={`text-[10px] font-mono ${item.color} font-bold`}>{item.value}</span>
                 </div>
               ))}
             </div>
          </div>
        </motion.section>

        {/* Center: The Game */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full lg:w-2/3 flex flex-col items-center lg:pt-8 order-1 lg:order-2"
        >
          <SnakeGame />
        </motion.section>

      </main>

      {/* Footer / Status Bar */}
      <footer className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-sm py-4 px-8 flex justify-between items-center z-50 overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" /> REC_STATE: ACTIVE
          </div>
          <div className="hidden sm:block text-[10px] font-mono text-slate-600/50 uppercase tracking-widest animate-pulse">
            NEON_FLUX_PROTOCOL_v4.2.0 // INITIALIZING_RHYTHM_ENGINE... // BUFFER_CLEAR // STAGE_LOAD_COMPLETE
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex gap-4">
           <span>VER_2026.04.21</span>
           <span className="text-white/20">|</span>
           <span className="text-neon-cyan">RAM: 12GB</span>
        </div>
      </footer>
    </div>
  );
}

