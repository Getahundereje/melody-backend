import User from "./user.mongo.js";
import catchModelAsyncError from "../../utils/catchModelAsyncError.js";
import handleMongooseError from "../../utils/handleMongooseError.js";

const createUser = catchModelAsyncError(async (userData) => {
  return await User.create(userData);
}, handleMongooseError);

const checkEmail = catchModelAsyncError(async (email) => {
  return await User.findOne({ email }).select("+password");
});

export { createUser, checkEmail };
