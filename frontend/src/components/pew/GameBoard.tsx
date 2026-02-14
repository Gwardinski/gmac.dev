import { useEffect, useRef } from 'react';
import { TILE_SIZE, type Direction, type GameState } from './client-copies';
import { PlayerClient } from './client-copies/PlayerClient';
import { useGameKeyPress } from './useGameKeyPress';
import type { JoinRoomResponse } from './useJoinRoom';

interface GameBoardProps extends JoinRoomResponse {
  gameState: GameState;
  sendMessage: (message: unknown) => boolean;
}

const DRIFT_THRESHOLD = 4;

export const GameBoard = ({ roomId, playerId, level, gameState, sendMessage }: GameBoardProps) => {
  const { players, bullets } = gameState;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playerClientRef = useRef<PlayerClient | null>(null);

  useEffect(() => {
    if (!playerId || playerClientRef.current) return;

    const currentPlayer = players?.find((p) => p.playerId === playerId);
    if (currentPlayer) {
      playerClientRef.current = new PlayerClient(currentPlayer.x, currentPlayer.y, currentPlayer.speed);
    }
  }, [playerId, players]);

  // Drift check and correction
  useEffect(() => {
    if (!playerId || !playerClientRef.current) return;

    const currentPlayer = players?.find((p) => p.playerId === playerId);
    if (!currentPlayer) return;

    const dx = Math.abs(currentPlayer.x - playerClientRef.current.x);
    const dy = Math.abs(currentPlayer.y - playerClientRef.current.y);

    if (dx > DRIFT_THRESHOLD || dy > DRIFT_THRESHOLD) {
      playerClientRef.current.setPlayerPosition(currentPlayer.x, currentPlayer.y);
    }
  }, [playerId, players]);

  const handleMovement = (direction: Direction) => {
    if (roomId && playerId && playerClientRef.current) {
      playerClientRef.current.updatePosition(direction, level);
      sendMessage({ type: 'update-movement', data: { direction } });
    }
  };

  useGameKeyPress(
    [
      {
        key: 'w',
        callback: () => handleMovement('UP')
      },
      {
        key: 'a',
        callback: () => handleMovement('LEFT')
      },
      {
        key: 's',
        callback: () => handleMovement('DOWN')
      },
      {
        key: 'd',
        callback: () => handleMovement('RIGHT')
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
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      });
    });

    // Draw all players
    players?.forEach((player) => {
      // Use client position for local player, server position for others
      const isLocalPlayer = player.playerId === playerId;
      const x = isLocalPlayer && playerClientRef.current ? playerClientRef.current.x : player.x;
      const y = isLocalPlayer && playerClientRef.current ? playerClientRef.current.y : player.y;

      ctx.fillStyle = player.playerColour.toLowerCase();
      ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = 'white';
      ctx.fillText(player.playerName, x, y + 32);
    });

    // Draw all bullets
    bullets?.forEach((bullet) => {
      ctx.fillStyle = 'white';
      ctx.fillRect(bullet.x, bullet.y, 2, 2);
    });
  }); // No dependencies - run on every render

  if (!roomId || !playerId) {
    return null;
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="game-canvas"
        tabIndex={0}
        width={level[0].length * TILE_SIZE}
        height={level.length * TILE_SIZE}
        className="mx-auto w-full bg-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};
