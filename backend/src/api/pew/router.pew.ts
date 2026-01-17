import { Elysia } from "elysia";

// Pew REST Endpoints (if needed... 🤔)
export const pewRouter = new Elysia({ prefix: "/pew" })
  .get("/", () => ({
    message: "Pew game server - connect via Socket.IO on port 3002",
  }))
  .get("/health", () => ({
    status: "ok",
    game: "pew",
  }));
