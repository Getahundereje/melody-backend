import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("combined"));

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
