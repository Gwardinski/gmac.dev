import { Elysia, t } from "elysia";
import { joinRoomController, listRoomsController } from "./controllers.pew.js";
import { roomJoinSchema } from "./models.pew.js";
import { getGameState } from "./service.pew.js";

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
  // WebSocket route for game state - requires roomId query parameter
  // Usage: ws://localhost:3001/pew/game?roomId=room-123
  .ws("/game", {
    // Validate that roomId is provided as a query parameter
    query: t.Object({
      roomId: t.String(),
    }),

    // Called when a player connects to the game WebSocket
    open(ws) {
      const { roomId } = ws.data.query;
      console.log(`Player connected to room: ${roomId}`);

      // Get and send the current game state
      const [gameState, error] = getGameState(roomId);

      if (error || !gameState) {
        ws.send(
          JSON.stringify({
            error: error || "Room not found",
          })
        );
        ws.close();
        return;
      }

      // Send the current game state to the newly connected player
      ws.send(
        JSON.stringify({
          type: "game-state",
          data: gameState,
        })
      );
    },

    // Called when the server receives a message from the client
    message(ws, message) {
      const { roomId } = ws.data.query;
      console.log(`Message from room ${roomId}:`, message);

      // For now, just echo back - later this will handle player movements
      ws.send(
        JSON.stringify({
          type: "echo",
          data: message,
        })
      );
    },

    // Called when the player disconnects
    close(ws) {
      const { roomId } = ws.data.query;
      console.log(`Player disconnected from room: ${roomId}`);
    },
  });
