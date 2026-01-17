import express from 'express';
import { getNote } from './controller.note.js';

const router = express.Router();

router.post('/note', getNote);

export const noteRouter = router;
