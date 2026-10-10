import { returnAPIError, returnAPIResponse } from "../../../responses.js";
import type { APIResponse } from "../../../types.js";
import type { NoteRequest, NoteResponse } from "./models.note.js";
import { getNote } from "./service.note.js";

export const getNoteController = async (
  body: NoteRequest
): Promise<APIResponse<NoteResponse>> => {
  const [note, error] = await getNote(body.code);
  if (!note || error) {
    return returnAPIError(error);
  }
  return returnAPIResponse(note);
};
