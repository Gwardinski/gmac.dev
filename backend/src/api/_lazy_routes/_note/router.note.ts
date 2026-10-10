import { Elysia } from "elysia";
import { getNoteController } from "./controller.note.js";
import { noteSchema } from "./models.note.js";

// Lazy Route
// /api/note is unrelated to gmac.dev and is used by a separate project.
// I just didn't want to spin up a new project for a single route 🤷‍♂️
export const noteRouter = new Elysia({ prefix: "/note" }).post(
  "/",
  async ({ body, set }) => {
    const response = await getNoteController(body);
    // The note frontend relies on the HTTP status (response.ok) to detect a wrong code
    set.status = response.status;
    return response;
  },
  { body: noteSchema }
);
