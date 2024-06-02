import http from 'http';
import dotenv from "dotenv"

import app from './app.js';

dotenv.config();

const port = parseInt(process.env.PORT) || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});