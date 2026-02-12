import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import figlet from "figlet";
import { CORS_ORIGINS } from "../env.js";
import { noteRouter } from "./_note/router.note.js";
import { pewRouter } from "./pew/router.pew.js";

const ELYSIA_PORT = 3001;

export function initServer() {
  console.log(`BUN BUN BUN`);
  console.log(`IT RHYMES WITH FUN!`);

  // Elysia REST API
  const app = initAPI();

  console.log(
    `gmac.api running on ${app.server?.hostname}:${app.server?.port}`
  );

  return { app };
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
