import React from 'react';
import { motion } from 'motion/react';

export default function BackgroundVisualizer() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Moving Grids */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
          height: '200%'
        }}
      >
        <motion.div 
          animate={{ backgroundPositionY: [0, 40] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-full h-full"
        />
      </div>

      {/* Floating Blobs */}
      <motion.div 
         animate={{ 
           x: [0, 100, -50, 0],
           y: [0, -50, 100, 0],
           scale: [1, 1.2, 0.9, 1]
         }}
         transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 blur-[120px] rounded-full"
      />
      <motion.div 
         animate={{ 
           x: [0, -100, 50, 0],
           y: [0, 100, -50, 0],
           scale: [1, 0.9, 1.2, 1]
         }}
         transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
         className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-magenta/10 blur-[150px] rounded-full"
      />

      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(2,6,23,1)]" />
    </div>
  );
}
