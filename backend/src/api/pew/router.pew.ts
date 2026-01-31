import { Elysia } from "elysia";
import { returnWSResponse } from "../../responses.js";
import { joinRoomController, listRoomsController } from "./controllers.pew.js";
import {
  roomJoinSchema,
  wsMessageSchema,
  wsQuerySchema,
  type Game,
  type WSSendMessageType,
} from "./models.pew.js";
import {
  connectPlayerToGame,
  playerFire,
  removePlayerFromGame,
  updatePlayerPosition,
} from "./service.pew.js";

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
      const { roomId, playerId, playerName, playerColour } = ws.data.query;

      console.log(
        `Player ${playerName}-${playerId} connected to room: ${roomId}`
      );

      const [gameState, error] = connectPlayerToGame(
        roomId,
        playerId,
        playerName,
        playerColour
      );

      if (error || !gameState) {
        console.log("Room not found");
        ws.send(
          JSON.stringify({
            error: error || "Room not found",
          })
        );
        ws.close();
        return;
      }

      ws.send(
        JSON.stringify({
          type: "game-state",
          data: gameState,
        })
      );
    },

    message(ws, message) {
      const { roomId, playerId, playerName } = ws.data.query;

      console.log(
        `Message from room ${roomId}, player ${playerName}-${playerId}:`,
        message.type
      );

      switch (message.type) {
        case "update-movement": {
          const { direction } = message.data;
          console.log(`Player ${playerName}-${playerId} moving: ${direction}`);

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
          console.log(`Player ${playerName}-${playerId} firing: ${direction}`);

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
      console.log(`Player ${playerId} disconnected from room: ${roomId}`);

      const [gameState] = removePlayerFromGame(roomId, playerId);

      if (gameState) {
        ws.send(
          returnWSResponse<WSSendMessageType, Game>("game-state", gameState)
        );
      }
    },
  });
