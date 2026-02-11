import { Elysia } from "elysia";
import { returnAPIError, returnWSResponse } from "../../responses.js";
import {
  joinRoomController,
  listRoomsController,
} from "./controllers.room.pew.js";
import {
  roomJoinSchema,
  wsMessageSchema,
  wsQuerySchema,
  type Game,
  type WSSendMessageType,
} from "./models.pew.js";
import { getGameState } from "./service.game.pew.js";
import {
  playerFire,
  playerServiceGetById,
  updatePlayerPosition,
} from "./service.player.pew.js";
import { sendMessage } from "./util.pew.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const roomConnections = new Map<string, Set<any>>();

export const pewRouter = new Elysia({ prefix: "/pew" })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      const validationErrors = "all" in error ? error.all : [];
      const response = returnAPIError("BAD_REQUEST", 400, validationErrors);
      set.status = response.status;
      return response;
    }

    // TODO: Handle other errors
    const response = returnAPIError("UNKNOWN", 500);
    set.status = response.status;
    return response;
  })
  .onAfterResponse(() => {
    // roomServiceDeleteEmpty();
  })
  .get("/", () => ({
    message: "Pew game server - connect via WebSocket on port 3001",
  }))
  .get("/health", () => ({
    status: "ok",
    game: "pew",
  }))
  .get("/rooms", () => listRoomsController())
  .post("/join-room", ({ body }) => joinRoomController(body), {
    body: roomJoinSchema,
  })
  // Usage: ws://localhost:3001/pew/game?roomId=room-123
  .ws("/game", {
    query: wsQuerySchema,
    body: wsMessageSchema,
    open(ws) {
      const { roomId, playerId } = ws.data.query;
      // check game exists
      const [gameState, gameErr] = getGameState(roomId);
      if (!gameState || gameErr) {
        ws.send(JSON.stringify({ error: gameErr || "Game not found" }));
        ws.close();
        return;
      }

      // check player exists
      const [player, playerErr] = playerServiceGetById(roomId, playerId);
      if (!player || playerErr) {
        ws.send(JSON.stringify({ error: playerErr || "Player not found" }));
        ws.close();
        return;
      }

      // Add connection to room
      if (!roomConnections.has(roomId)) {
        roomConnections.set(roomId, new Set());
      }
      roomConnections.get(roomId)!.add(ws);

      // send welcome message
      sendMessage(
        `Player ${player.playerName}-${playerId} connected to room: ${roomId}`,
        true
      );

      // send game state to all players in room
      broadcastToRoom(
        roomId,
        returnWSResponse<WSSendMessageType, Game>("game-state", gameState)
      );
    },

    message(ws, message) {
      const { roomId, playerId } = ws.data.query;

      const [gameState, gameErr] = getGameState(roomId);
      if (!gameState || gameErr) {
        ws.send(gameErr);
        ws.close(); // should close?
        return;
      }

      switch (message.type) {
        case "update-movement": {
          const { direction } = message.data;
          sendMessage(`Player ${playerId} moving: ${direction}`);

          const [updatedGameState, gameStateErr] = updatePlayerPosition(
            roomId,
            playerId,
            direction
          );

          if (gameStateErr) {
            ws.send(JSON.stringify({ error: gameStateErr }));
            return;
          }

          if (updatedGameState) {
            // Broadcast to all players in the room
            broadcastToRoom(
              roomId,
              returnWSResponse<WSSendMessageType, Game>(
                "game-state",
                updatedGameState
              )
            );
          }
          break;
        }

        case "fire": {
          const { direction } = message.data;
          sendMessage(`Player ${playerId} firing: ${direction}`);

          const [updatedGameState, gameStateErr] = playerFire(
            roomId,
            playerId,
            direction
          );

          if (gameStateErr) {
            ws.send(JSON.stringify({ error: gameStateErr }));
            return;
          }

          if (updatedGameState) {
            // Broadcast to all players in the room
            broadcastToRoom(
              roomId,
              returnWSResponse<WSSendMessageType, Game>(
                "game-state",
                updatedGameState
              )
            );
          }
          break;
        }
      }
    },

    close(ws, code, reason) {
      const { roomId, playerId } = ws.data.query;

      // Remove connection from room
      const connections = roomConnections.get(roomId);
      if (connections) {
        connections.delete(ws);
        if (connections.size === 0) {
          roomConnections.delete(roomId);
        }
      }

      sendMessage(
        `Player ${playerId} disconnected from room: ${roomId} (code: ${code}, reason: ${reason})`
      );

      // Don't remove player immediately - allows for React Strict Mode reconnections
      // and quick page refreshes. Players will be cleaned up when rooms are cleaned up.
      // TODO: Consider adding a timeout to remove players after extended disconnection
    },
  });

function broadcastToRoom(roomId: string, message: string) {
  const connections = roomConnections.get(roomId);
  if (!connections) {
    return;
  }

  connections.forEach((ws) => {
    try {
      ws.send(message);
    } catch (error) {
      console.error("Error broadcasting to WebSocket:", error);
    }
  });
}
