import { Elysia } from "elysia";
import { returnAPIError, returnWSResponse } from "../../responses.js";
import {
  getChatsController,
  sendChatController,
} from "./controllers.chat.pew.js";
import {
  joinRoomController,
  listRoomsController,
} from "./controllers.room.pew.js";
import {
  isGameEngineRunning,
  startGameEngine,
  stopGameEngine,
} from "./engine.js";
import {
  wsMessageSchema,
  wsQuerySchema,
  type WSSendMessageType,
} from "./models/base.models.pew.js";
import type { GameSerialized } from "./models/game.model.pew.js";
import { addChat } from "./service.chat.pew.js";
import {
  getGameSerialisedState,
  removeGamePlayer,
} from "./service.game.pew.js";
import {
  playerFire,
  playerServiceGetSerialisedById,
  updatePlayerPosition,
} from "./service.player.pew.js";
import { roomJoinSchema, sendChatSchema } from "./validation.js";

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
    message: "sup",
  }))
  .get("/health", () => ({
    status: "ok",
    game: "pew",
  }))
  .get("/rooms", () => listRoomsController())
  .post("/join-room", ({ body }) => joinRoomController(body), {
    body: roomJoinSchema,
  })
  .get("/chats/:roomId", ({ params }) => getChatsController(params.roomId))
  .post(
    "/chats/:roomId",
    ({ params, body }) => sendChatController(params.roomId, body),
    {
      body: sendChatSchema,
    }
  )
  // Usage: ws://localhost:3001/pew/game?roomId=roomId&playerId=playerId
  .ws("/game", {
    query: wsQuerySchema,
    body: wsMessageSchema,
    open(ws) {
      const { roomId, playerId } = ws.data.query;
      // check game exists
      const [gameState, gameErr] = getGameSerialisedState(roomId);
      if (!gameState || gameErr) {
        ws.send(JSON.stringify({ error: gameErr || "Game not found" }));
        ws.close();
        return;
      }

      // check player exists
      const [player, playerErr] = playerServiceGetSerialisedById(
        roomId,
        playerId
      );
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

      // Start Game Engine
      if (!isGameEngineRunning(roomId)) {
        startGameEngine(roomId, broadcastToRoom);
      }

      // send game state to all players in room
      broadcastToRoom(
        roomId,
        returnWSResponse<WSSendMessageType, GameSerialized>(
          "game-state",
          gameState
        )
      );
    },

    message(ws, message) {
      const { roomId, playerId } = ws.data.query;

      const [gameState, gameErr] = getGameSerialisedState(roomId);
      if (!gameState || gameErr) {
        ws.send(gameErr);
        ws.close(); // todo: keep close or ignore?
        return;
      }

      switch (message.type) {
        case "leave-room": {
          const [removedGame, removedGameError] = removeGamePlayer(
            roomId,
            playerId
          );
          if (!removedGame || removedGameError) {
            ws.send(JSON.stringify({ error: removedGameError }));
            return;
          }

          broadcastToRoom(
            roomId,
            returnWSResponse<WSSendMessageType, GameSerialized>(
              "game-state",
              removedGame
            )
          );

          break;
        }
        case "update-movement": {
          const { direction } = message.data;

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
            // Broadcasts to all players in the room
            broadcastToRoom(
              roomId,
              returnWSResponse<WSSendMessageType, GameSerialized>(
                "game-state",
                updatedGameState
              )
            );
          }
          break;
        }

        case "fire": {
          const { direction } = message.data;

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
            // Broadcasts to all players in the room
            broadcastToRoom(
              roomId,
              returnWSResponse<WSSendMessageType, GameSerialized>(
                "game-state",
                updatedGameState
              )
            );
          }
          break;
        }

        case "send-chat": {
          const { chatContent } = message.data;

          const [newChat, chatError] = addChat(
            roomId,
            playerId,
            chatContent,
            false
          );

          if (chatError || !newChat) {
            ws.send(JSON.stringify({ error: chatError }));
            return;
          }

          // Broadcast new chat to all players in the room
          broadcastToRoom(
            roomId,
            returnWSResponse<WSSendMessageType, typeof newChat>(
              "new-chat",
              newChat
            )
          );
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
          stopGameEngine(roomId);
        }
      }

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
