import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "SynthAI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-cyan"
  },
  {
    id: 2,
    title: "Cyber Slither",
    artist: "ByteBeats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-magenta"
  },
  {
    id: 3,
    title: "Grid Glitcher",
    artist: "VoltViper",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-lime"
  }
];

interface MusicPlayerProps {
  onTrackChange?: (track: Track) => void;
}

export default function MusicPlayer({ onTrackChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    onTrackChange?.(currentTrack);
  }, [currentTrack, onTrackChange]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 w-full max-w-md shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute inset-0 opacity-10 blur-3xl transition-colors duration-1000 bg-${currentTrack.color}`} />
      
      <div className="relative z-10 flex items-center gap-4">
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center border-${currentTrack.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
        >
          <Music className={`w-8 h-8 text-${currentTrack.color}`} />
        </motion.div>
        
        <div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.h3 
              key={currentTrack.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-bold tracking-tight text-white"
            >
              {currentTrack.title}
            </motion.h3>
          </AnimatePresence>
          <p className="text-slate-400 text-sm font-mono">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full bg-${currentTrack.color} shadow-[0_0_10px_currentColor]`}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <button 
          onClick={handlePrev}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleTogglePlay}
          className={`p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-110 active:scale-95 border border-white/20`}
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        
        <button 
          onClick={handleNext}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2 text-slate-500">
        <Volume2 className="w-4 h-4" />
        <div className="flex-1 h-1 bg-slate-800 rounded-full">
           <div className="w-2/3 h-full bg-slate-600 rounded-full" />
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
