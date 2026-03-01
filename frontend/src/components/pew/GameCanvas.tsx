import { useEffect, useRef, type RefObject } from 'react';
import backgroundImage from '../../assets/pew-background.png';
import { colorToHex, TILE_SIZE, type Color } from './client-copies';
import type { PlayerClient } from './client-copies/PlayerClient';
import { useLocalGameState } from './useGetGameState';

const LERP_FACTOR = 0.3;
const invincibleFlashInterval = 100;

interface GameCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export const GameCanvas = ({ canvasRef }: GameCanvasProps) => {
  const level = useLocalGameState((s) => s.level);
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

  // 60 FPS render loop: read state from store each frame so canvas updates regardless of React state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId: number;

    const tick = () => {
      const c = canvasRef.current;
      if (!c) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      const ctx = c.getContext('2d');
      if (!ctx) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const { gameState, level: lvl, playerId: pid, playerClient, otherPlayers, serverPlayer } = useLocalGameState.getState();
      const { bullets, items } = gameState;

      ctx.clearRect(0, 0, c.width, c.height);

      if (backgroundImageRef.current) {
        ctx.drawImage(backgroundImageRef.current, 0, 0, c.width, c.height);
      }

      lvl?.forEach((row, y) => {
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

      if (otherPlayers) {
        const currentPlayerIds = new Set(otherPlayers.map((p) => p.id));
        Array.from(otherPlayersLastPosRef.current.keys()).forEach((id) => {
          if (!currentPlayerIds.has(id)) otherPlayersLastPosRef.current.delete(id);
        });
        otherPlayers.forEach((otherPlayer) => {
          drawOtherPlayers(ctx, otherPlayer, pid, otherPlayersLastPosRef, dyingFrameRef);
        });
      }

      if (serverPlayer) {
        drawPlayerServerPosition(ctx, serverPlayer);
      }

      if (playerClient) {
        drawPlayerClient(ctx, playerClient, dyingFrameRef);
      }

      bullets?.forEach((bullet) => {
        drawBullet(ctx, bullet.x, bullet.y);
      });

      items?.forEach((item) => {
        drawItem(ctx, item.x, item.y, item.itemName);
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [canvasRef]);

  if (!level) return null;

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

type DrawPlayerProps = {
  playerId?: string;
  playerName: string;
  playerColour: Color;
  x: number;
  y: number;
  dyingFrame?: number;
};

/** Draws the local player's server position at 0.5 opacity (ghost). */
function drawPlayerServerPosition(ctx: CanvasRenderingContext2D, serverPlayer: PlayerClient) {
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = colorToHex(serverPlayer.colour);
  ctx.fillRect(serverPlayer.x, serverPlayer.y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'white';
  ctx.fillText(serverPlayer.name, serverPlayer.x, serverPlayer.y + 32);
  ctx.restore();
}

function drawPlayerClient(ctx: CanvasRenderingContext2D, playerClient: PlayerClient, dyingFrameRef: RefObject<Map<string, number>>) {
  if (!playerClient) return;
  const drawPlayerProps: DrawPlayerProps = {
    playerId: playerClient.id,
    playerName: playerClient.name,
    playerColour: playerClient.colour,
    x: playerClient.x,
    y: playerClient.y
  };

  if (playerClient.isDestroyed) {
    const currentFrame = dyingFrameRef.current.get(playerClient.id) ?? 0;
    const nextFrame = currentFrame + 1;
    dyingFrameRef.current.set(playerClient.id, nextFrame);
    drawDyingPlayer(ctx, { ...drawPlayerProps, dyingFrame: nextFrame });
    return;
  }
  dyingFrameRef.current.delete(playerClient.id);

  if (playerClient.isSpawning) {
    drawSpawningPlayer(ctx, drawPlayerProps);
    return;
  }

  if (playerClient.isInvincible) {
    drawInvinciblePlayer(ctx, drawPlayerProps);
    return;
  }

  drawNormalPlayer(ctx, drawPlayerProps);
}

function drawOtherPlayers(
  ctx: CanvasRenderingContext2D,
  player: PlayerClient,
  playerClientId: string | null,
  otherPlayersLastPosRef: RefObject<Map<string, { x: number; y: number }>>,
  dyingFrameRef: RefObject<Map<string, number>>
) {
  let drawPlayerProps = {
    playerId: player.id,
    playerName: player.name,
    playerColour: player.colour,
    x: player.x,
    y: player.y,
    health: 60
  };

  if (player.id === playerClientId) {
    return;
  }

  if (player.isSpawning || player.isDestroyed) {
    otherPlayersLastPosRef.current.delete(player.id);
    drawPlayerProps.x = player.x;
    drawPlayerProps.y = player.y;
  } else {
    const lastPos = otherPlayersLastPosRef.current.get(player.id);
    if (lastPos) {
      drawPlayerProps.x = lastPos.x + (player.x - lastPos.x) * LERP_FACTOR;
      drawPlayerProps.y = lastPos.y + (player.y - lastPos.y) * LERP_FACTOR;
    }
    otherPlayersLastPosRef.current.set(player.id, {
      x: drawPlayerProps.x,
      y: drawPlayerProps.y
    });
  }

  if (player.isDestroyed) {
    const currentFrame = dyingFrameRef.current.get(player.id) ?? 0;
    const nextFrame = currentFrame + 1;
    dyingFrameRef.current.set(player.id, nextFrame);
    drawDyingPlayer(ctx, { ...drawPlayerProps, dyingFrame: nextFrame });
    return;
  } else {
    dyingFrameRef.current.delete(player.id);
  }

  if (player.isSpawning) {
    drawSpawningPlayer(ctx, drawPlayerProps);
    return;
  }

  if (player.isInvincible) {
    drawInvinciblePlayer(ctx, drawPlayerProps);
    return;
  }

  drawNormalPlayer(ctx, drawPlayerProps);
}

function drawNormalPlayer(ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) {
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
}

function drawDyingPlayer(ctx: CanvasRenderingContext2D, { playerColour, x, y, dyingFrame = 0 }: DrawPlayerProps) {
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
}

function drawSpawningPlayer(ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) {
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
}

function drawInvinciblePlayer(ctx: CanvasRenderingContext2D, { playerName, playerColour, x, y }: DrawPlayerProps) {
  const isTransparent = Math.floor(Date.now() / invincibleFlashInterval) % 2 === 0;
  ctx.globalAlpha = isTransparent ? 0.3 : 1.0;
  ctx.fillStyle = colorToHex(playerColour);
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = 'white';
  ctx.fillText(playerName, x, y + 32);
}

function drawSpawnPoint(ctx: CanvasRenderingContext2D, _x: number, _y: number) {
  ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
  ctx.beginPath();
  ctx.arc(_x * TILE_SIZE + TILE_SIZE / 2, _y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 3, 0, 2 * Math.PI);
  ctx.fill();
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#686868';
  ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawBullet(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, 2, 2);
}

function drawItem(ctx: CanvasRenderingContext2D, x: number, y: number, itemName: string) {
  const isTransparent = Math.floor(Date.now() / invincibleFlashInterval) % 2 === 0;
  ctx.globalAlpha = isTransparent ? 0.3 : 1.0;
  ctx.fillStyle = 'yellow';
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = 'white';
  ctx.fillText(itemName, x - (itemName.length * 8) / itemName.length, y + 32);
  ctx.globalAlpha = 1.0;
}
