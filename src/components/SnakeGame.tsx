import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Point } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, GAME_SPEED } from '../constants';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(Direction.Up);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>(Direction.Up);

  const generateFood = useCallback((): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Don't spawn food on snake
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(Direction.Up);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    lastDirectionRef.current = Direction.Up;
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.Up: newHead.y -= 1; break;
        case Direction.Down: newHead.y += 1; break;
        case Direction.Left: newHead.x -= 1; break;
        case Direction.Right: newHead.x += 1; break;
      }

      // Check collisions with walls
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check collisions with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      lastDirectionRef.current = direction;
      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (lastDirectionRef.current !== Direction.Down) setDirection(Direction.Up);
          break;
        case 'ArrowDown':
          if (lastDirectionRef.current !== Direction.Up) setDirection(Direction.Down);
          break;
        case 'ArrowLeft':
          if (lastDirectionRef.current !== Direction.Right) setDirection(Direction.Left);
          break;
        case 'ArrowRight':
          if (lastDirectionRef.current !== Direction.Left) setDirection(Direction.Right);
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  // Rendering logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = '#39FF14'; // Theme green
      
      // Glow effect for snake
      ctx.shadowBlur = isHead ? 12 : 6;
      ctx.shadowColor = '#39FF14';
      
      ctx.beginPath();
      ctx.roundRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2,
        2
      );
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#FF00E5'; // Theme magenta
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00E5';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group p-4">
      {/* Stats Overlay - Styled as per theme */}
      <div className="absolute top-0 right-0 p-8 text-right z-30 pointer-events-none">
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-[1.5px] text-text-muted">Score</div>
          <div className="font-mono text-4xl text-neon-cyan neon-text-cyan">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[1.5px] text-text-muted">High Score</div>
          <div className="font-mono text-xl text-text-main opacity-50">1200</div>
        </div>
      </div>

      {/* Snake Board Container */}
      <div className="relative p-[2px] bg-neon-magenta/20 shadow-[0_0_30px_rgba(255,_0,_229,_0.2)] border-2 border-neon-magenta">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="bg-black block"
        />
        
        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-40">
            {isGameOver ? (
              <>
                <h2 className="text-4xl font-bold text-neon-magenta mb-4 tracking-[-2px] uppercase">Integrity Fault</h2>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 border border-neon-cyan text-neon-cyan font-mono hover:bg-neon-cyan/10 transition-colors uppercase tracking-[2px] text-xs rounded-none"
                >
                  Reconnect
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-neon-cyan mb-4 tracking-[-2px] uppercase">Suspended</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-neon-cyan text-black font-bold hover:scale-105 transition-transform uppercase tracking-[2px] text-xs"
                >
                  Uplink
                </button>
                <p className="mt-8 font-mono text-[10px] text-text-muted animate-pulse uppercase tracking-[2px]">Press Space to Activate</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-8 font-mono text-[10px] text-text-muted uppercase tracking-[3px] justify-center">
        <span>WASD Move</span>
        <span>•</span>
        <span>Space Sync</span>
      </div>
    </div>
  );
};

export default SnakeGame;
