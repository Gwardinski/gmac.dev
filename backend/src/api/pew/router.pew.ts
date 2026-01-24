import { Elysia } from "elysia";

export const pewRouter = new Elysia({ prefix: "/pew" })
  .get("/", () => ({
    message: "Pew game server - connect via WebSocket on port 3001",
  }))
  .get("/health", () => ({
    status: "ok",
    game: "pew",
  }))
  // Simple "Hello World" WebSocket route using Elysia's native WebSocket
  // This is separate from the Socket.IO implementation for now
  .ws("/hello", {
    // Called when a new WebSocket connection is established
    open(ws) {
      console.log("WebSocket connected");
      ws.send("Welcome! You're connected to Elysia WebSocket 🚀");
    },

    // Called when the server receives a message from the client
    message(ws, message) {
      console.log("Received message:", message);
      // Echo the message back to the client
      ws.send(`Server received: ${message}`);
    },

    // Called when the WebSocket connection is closed
    close(ws) {
      console.log("WebSocket disconnected");
    },
  });
