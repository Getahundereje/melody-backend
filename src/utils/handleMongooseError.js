import AppError from "./appError.js";

function handleMongooseError(err) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)[0].message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    const field =
      Object.keys(err.keyValue)[0] === "_id"
        ? "id"
        : Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const modelName = err.collection
      ? err.collection.split(".")[1]
      : "Document";
    message = `A ${modelName} with this ${field} already exists: ${value}`;
    statusCode = 400;
  } else if (err.name === "MongooseServerSelectionError") {
    statusCode = 503;
    message = "Database connection failed. Try again later.";
  }

  return new AppError(message, statusCode);
}

export default handleMongooseError;
