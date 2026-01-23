import { Elysia } from "elysia";
import { noteSchema, type NoteRequest } from "./models.note.js";
import { getNote } from "./service.note.js";

// Lazy Route
// /api/note is unrelated to gmac.dev and is used by a separate project.
// I just didn't want to spin up a new project for a single route 🤷‍♂️
export const noteRouter = new Elysia({ prefix: "/note" }).post(
  "/",
  ({ body }: { body: NoteRequest }) => getNote(body.code),
  { body: noteSchema }
);
