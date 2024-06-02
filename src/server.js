import http from 'http';
import dotenv from "dotenv"

import app from './app.js';
import connectDB from './db.js';

dotenv.config();

const port = parseInt(process.env.PORT) || 3000;

const server = http.createServer(app);

connectDB();
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});