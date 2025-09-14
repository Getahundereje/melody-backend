import http from 'http';
import dotenv from "dotenv"

import app from './app.js';
import { loadBillboardTopTenData } from './utils/BillboardTopTen.js';
import { loadSpotifyTopTen } from './utils/spotifyTopTen.js';
import connectDB from './config/db.js';

dotenv.config();

const port = parseInt(process.env.PORT) || 3000;

const server = http.createServer(app);

(async () => {
  await loadBillboardTopTenData();
  await loadSpotifyTopTen();
  await connectDB();
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
})()
