import { Elysia } from "elysia";
import { returnWSResponse } from "../../responses.js";
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

      sendMessage(
        `Message from room ${roomId}, player ${playerId}: ${message.type}`
      );

      switch (message.type) {
        case "update-movement": {
          const { direction } = message.data;
          sendMessage(`Player ${playerId} moving: ${direction}`);

          const [gameState] = updatePlayerPosition(roomId, playerId, direction);

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

          const [gameState] = playerFire(roomId, playerId, direction);

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
