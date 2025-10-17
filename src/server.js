import http from "http";
import dotenv from "dotenv";

import app from "./app.js";
import { loadBillboardChartData } from "./utils/BillboardCharts.js";
import { loadAllMusicData } from "./utils/musicData.js";
import connectDB from "./config/db.js";
import { handleStream } from "./controllers/music.controller.js";

import playdl from "play-dl";

dotenv.config();

const port = parseInt(process.env.PORT) || 3000;

const server = http.createServer(app);

(async () => {
  await loadBillboardChartData();
  await loadAllMusicData();
  await connectDB();
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
})();
