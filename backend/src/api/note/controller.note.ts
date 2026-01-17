import type { Request, Response } from 'express';
import { CODE, NOTE_CONTENT, NOTE_TITLE } from '../../env.js';
import { returnAPIError, returnAPIResponse } from '../responses.js';

export const getNote = async (req: Request, res: Response) => {
  try {
    const { code } = req.body as { code: string };

    if (code.toUpperCase() !== CODE.toUpperCase()) {
      return returnAPIError(res, 'INVALID_CODE');
    }

    // Return Access Token as value
    return returnAPIResponse<{ title: string; content: string }>(res, {
      title: NOTE_TITLE,
      content: NOTE_CONTENT,
    });
  } catch (e) {
    return returnAPIError(res);
  }
};
