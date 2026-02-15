import { useEffect, useRef } from 'react';
import backgroundImage from '../../assets/pew-background.png';
import { colorToHex, TILE_SIZE, type Color, type Direction, type GameState } from './client-copies';
import { PlayerClient } from './client-copies/PlayerClient';
import { useGameKeyPress } from './useGameKeyPress';
import type { JoinRoomResponse } from './useJoinRoom';

interface GameBoardProps extends JoinRoomResponse {
  gameState: GameState;
  sendMessage: (message: unknown) => boolean;
}

const DRIFT_THRESHOLD = 8;
const LERP_FACTOR = 0.3;

export const GameBoard = ({ roomId, playerId, level, gameState, sendMessage }: GameBoardProps) => {
  const { players, bullets } = gameState;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  const playerClientRef = useRef<PlayerClient | null>(null);
  const isSpawningRef = useRef<boolean>(false);
  const otherPlayersLastPosRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Load background image
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      backgroundImageRef.current = img;
    };
  }, []);

  useEffect(() => {
    if (!playerId || playerClientRef.current) return;

    const currentPlayer = players?.find((p) => p.playerId === playerId);
    if (currentPlayer) {
      playerClientRef.current = new PlayerClient(currentPlayer.x, currentPlayer.y, currentPlayer.speed);
    }
  }, [playerId, players]);

  // Track spawning state
  useEffect(() => {
    if (!playerId) return;
    const currentPlayer = players?.find((p) => p.playerId === playerId);
    isSpawningRef.current = currentPlayer?.isSpawning ?? false;
  }, [playerId, players]);

  // Drift check and correction with lerp
  useEffect(() => {
    if (!playerId || !playerClientRef.current) return;

    const currentPlayer = players?.find((p) => p.playerId === playerId);
    if (!currentPlayer) return;

    if (currentPlayer.isSpawning || currentPlayer.isDestroyed) {
      playerClientRef.current.setPlayerPosition(currentPlayer.x, currentPlayer.y);
      return;
    }

    const dx = Math.abs(currentPlayer.x - playerClientRef.current.x);
    const dy = Math.abs(currentPlayer.y - playerClientRef.current.y);

    if (dx > DRIFT_THRESHOLD || dy > DRIFT_THRESHOLD) {
      const newX = playerClientRef.current.x + (currentPlayer.x - playerClientRef.current.x) * LERP_FACTOR;
      const newY = playerClientRef.current.y + (currentPlayer.y - playerClientRef.current.y) * LERP_FACTOR;
      playerClientRef.current.setPlayerPosition(newX, newY);
    }
  }, [playerId, players]);

  // Cleanup: remove disconnected players from interpolation map
  useEffect(() => {
    if (!players) return;

    const currentPlayerIds = new Set(players.map((p) => p.playerId));
    const storedPlayerIds = Array.from(otherPlayersLastPosRef.current.keys());

    storedPlayerIds.forEach((id) => {
      if (!currentPlayerIds.has(id)) {
        otherPlayersLastPosRef.current.delete(id);
      }
    });
  }, [players]);

  const handleMovement = (direction: Direction) => {
    if (roomId && playerId && playerClientRef.current && !isSpawningRef.current) {
      playerClientRef.current.updatePosition(direction, level);
      sendMessage({ type: 'update-movement', data: { direction } });
    }
  };

  const handleFire = (direction: Direction) => {
    if (roomId && playerId && !isSpawningRef.current) {
      sendMessage({ type: 'fire', data: { direction } });
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
        callback: () => handleFire('UP')
      },
      {
        key: 'ArrowLeft',
        callback: () => handleFire('LEFT')
      },
      {
        key: 'ArrowDown',
        callback: () => handleFire('DOWN')
      },
      {
        key: 'ArrowRight',
        callback: () => handleFire('RIGHT')
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

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (backgroundImageRef.current) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
    }

    // Draw the level
    level?.forEach((row, y) => {
      row.forEach((cell, x) => {
        switch (cell) {
          case 1:
            // Floor is transparent - don't draw anything
            break;
          case 2:
            createWall(ctx, x, y);
            break;
          case 3:
            createSpawnPoint(ctx, x, y);
            break;
        }
      });
    });

    // Draw all players
    players?.forEach((player) => {
      let drawPlayerProps = {
        playerName: player.playerName,
        playerColour: player.playerColour,
        x: player.x,
        y: player.y
      };

      // this player, uses client prediction above ^
      if (player.playerId === playerId && playerClientRef.current) {
        drawPlayerProps.x = playerClientRef.current.x;
        drawPlayerProps.y = playerClientRef.current.y;
      }
      // rest players
      else {
        // Skip interpolation for spawning/destroyed players - snap to position instantly
        if (player.isSpawning || player.isDestroyed) {
          // Clear stored position so we don't interpolate from death/old position
          otherPlayersLastPosRef.current.delete(player.playerId);
          // Use server position directly
          drawPlayerProps.x = player.x;
          drawPlayerProps.y = player.y;
        } else {
          // Normal interpolation for alive players
          const lastPos = otherPlayersLastPosRef.current.get(player.playerId);
          if (lastPos) {
            drawPlayerProps.x = lastPos.x + (player.x - lastPos.x) * LERP_FACTOR;
            drawPlayerProps.y = lastPos.y + (player.y - lastPos.y) * LERP_FACTOR;
          }
          // Update stored positions for next frame
          otherPlayersLastPosRef.current.set(player.playerId, {
            x: drawPlayerProps.x,
            y: drawPlayerProps.y
          });
        }
      }

      if (player.isSpawning) {
        drawSpawningPlayer(ctx, drawPlayerProps);
        return;
      }

      if (player.isInvincible) {
        drawInvinciblePlayer(ctx, drawPlayerProps);
        return;
      }

      drawPlayer(ctx, drawPlayerProps);
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

const createSpawnPoint = (_ctx: CanvasRenderingContext2D, _x: number, _y: number) => {
  _ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
  _ctx.beginPath();
  _ctx.arc(_x * TILE_SIZE + TILE_SIZE / 2, _y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 3, 0, 2 * Math.PI);
  _ctx.fill();
};

const createWall = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = 'gray';
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

type DrawPlayerProps = {
  playerName: string;
  playerColour: Color;
  x: number;
  y: number;
};

const drawPlayer = (ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) => {
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
};

const drawSpawningPlayer = (ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) => {
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.globalAlpha = 1.0;

  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
};

const invincibleFlashInterval = 100;
const drawInvinciblePlayer = (ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) => {
  const isTransparent = Math.floor(Date.now() / invincibleFlashInterval) % 2 === 0;

  ctx.globalAlpha = isTransparent ? 0.3 : 1.0;
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.globalAlpha = 1.0;

  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
};
