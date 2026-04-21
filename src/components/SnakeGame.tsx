import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = 'UP';
const SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check walls
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE || 
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self-collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl px-4">
      {/* Stats Board */}
      <div className="w-full flex justify-between items-center glass-panel rounded-xl p-4 neon-border-cyan">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Current Score</span>
          <span className="text-3xl font-bold font-mono neon-text-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-yellow" />
            <span className="text-3xl font-bold font-mono text-white">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="relative group">
        <div 
          className="grid bg-slate-900/60 p-1 border-2 border-slate-800 rounded-lg shadow-2xl relative overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {/* Background Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10 pointer-events-none">
             {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
               <div key={`grid-${i}`} className="border-[0.5px] border-slate-700" />
             ))}
          </div>

          <AnimatePresence>
            {/* Snake Body */}
            {snake.map((segment, i) => (
              <motion.div
                key={`${segment.x}-${segment.y}`}
                initial={i === 0 ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                className={`absolute rounded-sm shadow-sm transition-all duration-100 ${
                  i === 0 
                  ? 'bg-neon-lime z-20 shadow-[0_0_10px_#39ff14]' 
                  : 'bg-emerald-500/80 z-10'
                }`}
                style={{
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  left: `${(segment.x * 100) / GRID_SIZE}%`,
                  top: `${(segment.y * 100) / GRID_SIZE}%`,
                }}
              />
            ))}

            {/* Food */}
            <motion.div
              layoutId="food"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 0.8],
                boxShadow: ["0 0 5px #ff00ff", "0 0 15px #ff00ff", "0 0 5px #ff00ff"]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute bg-neon-magenta rounded-md z-30"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(food.x * 100) / GRID_SIZE}%`,
                top: `${(food.y * 100) / GRID_SIZE}%`,
              }}
            />
          </AnimatePresence>

          {/* Overlays */}
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-bold neon-text-magenta mb-2">GAME OVER</h2>
                  <p className="text-slate-400 mb-6 font-mono">Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-magenta text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-transform"
                  >
                    <RefreshCcw className="w-5 h-5" /> RESTART
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold neon-text-cyan mb-2">PAUSED</h2>
                  <p className="text-slate-400 mb-6 text-sm">Press Space or button to continue</p>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-3 bg-neon-cyan text-slate-950 font-bold rounded-full hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-current" /> RESUME
                  </button>
                </>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Game Glow Effect */}
        <div className="absolute -inset-4 bg-neon-cyan/5 blur-3xl -z-10 group-hover:bg-neon-cyan/10 transition-colors" />
      </div>

      {/* Mobile Controls / Info */}
      <div className="grid grid-cols-2 gap-4 w-full">
         <div className="glass-panel p-4 rounded-xl flex items-center justify-center gap-2 border-white/5">
             <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">ARROWS</kbd>
             <span className="text-xs text-slate-500 uppercase tracking-tight">to move</span>
         </div>
         <div className="glass-panel p-4 rounded-xl flex items-center justify-center gap-2 border-white/5">
             <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono">SPACE</kbd>
             <span className="text-xs text-slate-500 uppercase tracking-tight">to pause</span>
         </div>
      </div>
    </div>
  );
}
