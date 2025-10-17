import User from "./user.mongo.js";
import catchModelAsyncError from "../../utils/catchModelAsyncError.js";
import handleMongooseError from "../../utils/handleMongooseError.js";

export const userExists = catchModelAsyncError(async (userId) => {
  return await User.exists({ _id: userId });
});

export const createUser = catchModelAsyncError(async (userData) => {
  return await User.create(userData);
}, handleMongooseError);

export const checkEmail = catchModelAsyncError(async (email) => {
  return await User.findOne({ email }).select("+password");
});
