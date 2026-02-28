import { useEffect, useRef, type RefObject } from 'react';
import backgroundImage from '../../assets/pew-background.png';
import { colorToHex, TILE_SIZE, type Color, type GameState } from './client-copies';
import type { PlayerClient } from './client-copies/PlayerClient';

const LERP_FACTOR = 0.3;
const invincibleFlashInterval = 100;

interface GameCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  gameState: GameState;
  level: number[][];
  playerId: string | undefined;
  playerClientRef: RefObject<PlayerClient | null>;
}

type DrawPlayerProps = {
  playerId?: string;
  playerName: string;
  playerColour: Color;
  x: number;
  y: number;
  itemTime?: number;
  dyingFrame?: number;
};

const drawSpawnPoint = (ctx: CanvasRenderingContext2D, _x: number, _y: number) => {
  ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
  ctx.beginPath();
  ctx.arc(_x * TILE_SIZE + TILE_SIZE / 2, _y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 3, 0, 2 * Math.PI);
  ctx.fill();
};

const drawWall = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = '#686868';
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
};

const drawBullet = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, 2, 2);
};

const drawItem = (ctx: CanvasRenderingContext2D, x: number, y: number, itemName: string) => {
  const isTransparent = Math.floor(Date.now() / invincibleFlashInterval) % 2 === 0;
  ctx.globalAlpha = isTransparent ? 0.3 : 1.0;
  ctx.fillStyle = 'yellow';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'white';
  ctx.fillText(itemName, x - (itemName.length * 8) / itemName.length, y + 32);
  ctx.globalAlpha = 1.0;
};

const drawPlayer = (ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y, itemTime }: DrawPlayerProps) => {
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
  if (!itemTime) return;
  ctx.fillStyle = 'red';
  ctx.globalAlpha = 0.8;
  ctx.fillRect(x - 8, y - 16, TILE_SIZE + 16, 4);
  ctx.fillStyle = 'green';
  ctx.fillRect(x - 8, y - 16, (TILE_SIZE + 16) * (itemTime / 100), 4);
  ctx.globalAlpha = 1;
};

const drawDyingPlayer = (ctx: CanvasRenderingContext2D, { playerColour, x, y, dyingFrame = 0 }: DrawPlayerProps) => {
  const baseSize = TILE_SIZE * 2;
  const size = Math.max(0, baseSize - dyingFrame);
  const halfSize = size / 2;
  const now = Date.now();
  const angle = ((now % 1000) / 1000) * Math.PI * 3;
  const centerX = x + TILE_SIZE / 2;
  const centerY = y + TILE_SIZE / 2;
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(-halfSize, -halfSize, size, size);
  ctx.restore();
};

const drawSpawningPlayer = (ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) => {
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
};

const drawInvinciblePlayer = (ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) => {
  const isTransparent = Math.floor(Date.now() / invincibleFlashInterval) % 2 === 0;
  ctx.globalAlpha = isTransparent ? 0.3 : 1.0;
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
};

export const GameCanvas = ({ canvasRef, gameState, level, playerId, playerClientRef }: GameCanvasProps) => {
  const { players, bullets, items } = gameState;
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const otherPlayersLastPosRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const dyingFrameRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const bg = new Image();
    bg.src = backgroundImage;
    bg.onload = () => {
      backgroundImageRef.current = bg;
    };
  }, []);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImageRef.current) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
    }

    level?.forEach((row, y) => {
      row.forEach((cell, x) => {
        switch (cell) {
          case 1:
            break;
          case 2:
            drawWall(ctx, x, y);
            break;
          case 3:
            drawSpawnPoint(ctx, x, y);
            break;
        }
      });
    });

    players?.forEach((player) => {
      let drawPlayerProps = {
        playerId: player.playerId,
        playerName: player.playerName,
        playerColour: player.playerColour,
        x: player.x,
        y: player.y,
        health: 60
      };

      if (player.playerId === playerId && playerClientRef.current) {
        drawPlayerProps.x = playerClientRef.current.x;
        drawPlayerProps.y = playerClientRef.current.y;
      } else {
        if (player.isSpawning || player.isDestroyed) {
          otherPlayersLastPosRef.current.delete(player.playerId);
          drawPlayerProps.x = player.x;
          drawPlayerProps.y = player.y;
        } else {
          const lastPos = otherPlayersLastPosRef.current.get(player.playerId);
          if (lastPos) {
            drawPlayerProps.x = lastPos.x + (player.x - lastPos.x) * LERP_FACTOR;
            drawPlayerProps.y = lastPos.y + (player.y - lastPos.y) * LERP_FACTOR;
          }
          otherPlayersLastPosRef.current.set(player.playerId, {
            x: drawPlayerProps.x,
            y: drawPlayerProps.y
          });
        }
      }

      if (player.isDestroyed) {
        const currentFrame = dyingFrameRef.current.get(player.playerId) ?? 0;
        const nextFrame = currentFrame + 1;
        dyingFrameRef.current.set(player.playerId, nextFrame);
        drawDyingPlayer(ctx, { ...drawPlayerProps, dyingFrame: nextFrame });
        return;
      } else {
        dyingFrameRef.current.delete(player.playerId);
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

    bullets?.forEach((bullet) => {
      drawBullet(ctx, bullet.x, bullet.y);
    });

    items?.forEach((item) => {
      drawItem(ctx, item.x, item.y, item.itemName);
    });
  });

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
