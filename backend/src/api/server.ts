/* eslint-disable no-console */
import http from 'http';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { initGameServer } from './game/game-server.js';
import { noteRouter } from './note/router.note.js';

const app = express();
// Boilerplate
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.send('hello world');
});

// Routers
app.use('/api', noteRouter);

const server = http.createServer(app);

// Initialize game server with Socket.IO
initGameServer(server);

export async function initServer() {
  server.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
  });
}
