import { useEffect, useRef } from 'react';
import { useGameKeyPress } from './useGameKeyPress';
import { useGetGameState } from './useGetGameState';
import type { JoinRoomResponse } from './useJoinRoom';

export const GameBoard = ({ roomId, playerId, level }: JoinRoomResponse) => {
  const { gameState, sendMessage } = useGetGameState(roomId, playerId);
  const { players, bullets } = gameState;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log('bullets', bullets);

  // Set up fluid keyboard controls using useKeyPress
  useGameKeyPress(
    [
      {
        key: 'w',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'update-movement', data: { direction: 'UP' } });
          }
        }
      },
      {
        key: 'a',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'update-movement', data: { direction: 'LEFT' } });
          }
        }
      },
      {
        key: 's',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'update-movement', data: { direction: 'DOWN' } });
          }
        }
      },
      {
        key: 'd',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'update-movement', data: { direction: 'RIGHT' } });
          }
        }
      },
      {
        key: 'ArrowUp',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'fire', data: { direction: 'UP' } });
          }
        }
      },
      {
        key: 'ArrowLeft',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'fire', data: { direction: 'LEFT' } });
          }
        }
      },
      {
        key: 'ArrowDown',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'fire', data: { direction: 'DOWN' } });
          }
        }
      },
      {
        key: 'ArrowRight',
        callback: () => {
          if (roomId && playerId) {
            sendMessage({ type: 'fire', data: { direction: 'RIGHT' } });
          }
        }
      }
    ],
    canvasRef
  );

  useEffect(() => {
    if (!roomId || !playerId) {
      return;
    }
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, [roomId, playerId]);

  useEffect(() => {
    if (!roomId || !playerId) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear the entire canvas before redrawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the level
    level?.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.fillStyle = cell === 1 ? 'black' : 'gray';
        ctx.fillRect(x * 16, y * 16, 16, 16);
      });
    });

    // Draw all players
    players?.forEach((player) => {
      ctx.fillStyle = player.playerColour.toLowerCase();
      ctx.fillRect(player.x, player.y, 16, 16);
      ctx.fillStyle = 'white';
      ctx.fillText(player.playerName, player.x, player.y + 32);
    });

    // Draw all bullets
    bullets?.forEach((bullet) => {
      ctx.fillStyle = 'white';
      ctx.fillRect(bullet.x, bullet.y, 2, 2);
    });
  }); // No dependencies - run on every render to ensure canvas is always up to date

  if (!roomId || !playerId) {
    return null;
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="game-canvas"
        tabIndex={0}
        width={level[0].length * 16}
        height={level.length * 16}
        className="mx-auto w-full bg-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};
