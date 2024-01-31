'use client'

import Link from 'next/link';
import { FireIcon, PowerIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Point {
  x: number;
  y: number;
}

const SnakeGame: React.FC = () => {
 const getRandomPoint = (): Point => ({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
   });
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>(getRandomPoint());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % GRID_SIZE;
          break;
      }

      newSnake.unshift(head);

      // Check if the snake eats the food
      if (head.x === food.x && head.y === food.y) {
        setFood(getRandomPoint());
      } else {
        newSnake.pop();
      }

      // Check if the snake collides with itself
      const isCollidingWithItself = newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);

      if (isCollidingWithItself) {
        setIsGameOver(true);
      }

      return newSnake;
    });
  }, [direction, food, isGameOver]);

  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setDirection('UP');
        break;
      case 'ArrowDown':
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
        setDirection('LEFT');
        break;
      case 'ArrowRight':
        setDirection('RIGHT');
        break;
    }
  };

  useEffect(() => {
    intervalRef.current = setInterval(moveSnake, 200);

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [moveSnake]);

  useEffect(() => {
    // Listen for arrow key presses
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup key event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPoint());
    setDirection('RIGHT');
    setIsGameOver(false);
  };

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      {isGameOver ? (
        <div>
          <h1>Game Over!</h1>
          <button onClick={restartGame}>Restart</button>

          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log out</span> <PowerIcon className="w-5 md:w-6" />
          </Link>
        </div>


      ) : (
        <div>
          <h1>Snake Game</h1>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Quit</span> <PowerIcon className="w-5 md:w-6" />
          </Link>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)` }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnakeSegment = snake.some((segment) => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #ccc',
                    backgroundColor: isSnakeSegment ? '#333' : isFood ? 'red' : 'white',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
