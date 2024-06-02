import AppError from "./appError.js";

function handleMongooseError(err) {
  let statusCode = 500;
  let message = "Something went wrong";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)[0].message;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 400;
    message = "User with this email already exist.";
  } else if (err.name === "MongooseServerSelectionError") {
    statusCode = 503;
    message = "Database connection failed. Try again later.";
  }

  return new AppError(message, statusCode);
}

export default handleMongooseError;
