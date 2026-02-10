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
  playerServiceGet,
  removePlayerFromGame,
  updatePlayerPosition,
} from "./service.player.pew.js";

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
        ws.send(gameErr);
        ws.close();
        return;
      }

      // check player exists
      const [player, playerErr] = playerServiceGet(roomId, playerId);
      if (!player || playerErr) {
        ws.send(playerErr);
        ws.close();
        return;
      }

      // send welcome message
      sendMessage(
        `Player ${player.playerName}-${playerId} connected to room: ${roomId}`,
        true
      );

      // send game state
      ws.send(
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

          const [gameState, gameStateErr] = updatePlayerPosition(
            roomId,
            playerId,
            direction
          );

          if (gameStateErr) {
            ws.send(gameStateErr);
            return;
          }

          if (gameState) {
            ws.send(
              returnWSResponse<WSSendMessageType, Game>("game-state", gameState)
            );
          }
          break;
        }

        case "fire": {
          const { direction } = message.data;
          sendMessage(`Player ${playerId} firing: ${direction}`);

          const [gameState, gameStateErr] = playerFire(
            roomId,
            playerId,
            direction
          );

          if (gameStateErr) {
            ws.send(gameStateErr);
            return;
          }

          if (gameState) {
            ws.send(
              returnWSResponse<WSSendMessageType, Game>("game-state", gameState)
            );
          }
          break;
        }
      }
    },

    close(ws) {
      const { roomId, playerId } = ws.data.query;
      sendMessage(`Player ${playerId} disconnected from room: ${roomId}`);

      const [gameState] = removePlayerFromGame(roomId, playerId);

      if (gameState) {
        ws.send(
          returnWSResponse<WSSendMessageType, Game>("game-state", gameState)
        );
      }
    },
  });

function sendMessage(message: string, external: boolean = false) {
  console.log(message);
  if (external) {
    // send to messages
  }
}
