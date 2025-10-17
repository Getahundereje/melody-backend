import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import musicRouter from "./routes/music.route.js";
import playlistRouter from "./routes/playlist.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("combined"));

app.use(authRouter);
app.use(musicRouter);
app.use("/playlists", playlistRouter);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found.`,
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;
