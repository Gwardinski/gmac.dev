import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import figlet from "figlet";
import { Server as SocketIOServer } from "socket.io";
import { CORS_ORIGINS } from "../env.js";
import { noteRouter } from "./_note/router.note.js";
import { pewRouter } from "./pew/router.pew.js";
import { initPewGame } from "./pew/socketio.pew.js";

const ELYSIA_PORT = 3001;

export function initServer() {
  console.log(`bun bun bun, it rhymes with fun!`);

  // Elysia REST API
  const app = initAPI();

  // Socket.IO Websockets - attach to the same server
  const io = initWebsockets(app.server);

  console.log(
    `gmac.api (REST) and Socket.IO running: ${app.server?.hostname}:${app.server?.port}`
  );

  return { app, io };
}

function initAPI() {
  // Elysia REST API
  const app = new Elysia()
    .use(
      cors({
        origin: CORS_ORIGINS,
        credentials: true,
      })
    )
    .get("/", () => {
      const body = figlet.textSync("gmac.api");
      return body;
    })
    .use(noteRouter)
    .use(pewRouter)
    .listen(ELYSIA_PORT);

  return app;
}

function initWebsockets(server: any) {
  const io = new SocketIOServer({
    cors: {
      origin: CORS_ORIGINS,
      credentials: true,
    },
  });

  // Attach Socket.IO to the existing Bun server
  io.attach(server);

  initPewGame(io);
  return io;
}
