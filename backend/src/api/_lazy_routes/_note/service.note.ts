import { CODE, NOTE_CONTENT, NOTE_TITLE } from "../../../env.js";
import { returnServiceResponse } from "../../../responses.js";
import type { ServiceResponse } from "../../../types.js";
import type { NoteResponse } from "./models.note.js";

export const getNote = async (
  code: string
): Promise<ServiceResponse<NoteResponse>> => {
  try {
    const valid = code.toUpperCase() === CODE.toUpperCase();
    if (!valid) {
      return returnServiceResponse<NoteResponse>("INVALID_CODE");
    }

    return returnServiceResponse({
      title: NOTE_TITLE,
      content: NOTE_CONTENT,
    });
  } catch (e) {
    return returnServiceResponse<NoteResponse>("UNKNOWN");
  }
};
