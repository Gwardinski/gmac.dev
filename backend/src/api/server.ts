import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import figlet from "figlet";
import { CORS_ORIGINS } from "../env.js";
// Lazy Routes. I need one-off endpoints for other unrelated projects and I cba creating dedicated backends for them
import { noteRouter } from "./_lazy_routes/index.js";
import { pewRouter } from "./pew/router.pew.js";

const ELYSIA_PORT = 3001;

export function initServer() {
  console.log(console.log("gmac.api"));
  console.log(console.log("BUN BUN BUN"));
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
      try {
        const body = figlet.textSync("gmac.api");
        return body;
      } catch (error) {
        return "gmac.api";
      }
    })
    .use(noteRouter)
    .use(pewRouter)
    .listen(ELYSIA_PORT);

  return app;
}
