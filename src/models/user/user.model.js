import User from "./user.mongo.js";
import catchModelAsyncError from "../../utils/catchModelAsyncError.js";
import handleMongooseError from "../../utils/handleMongooseError.js";

const createUser = catchModelAsyncError(async (userData) => {
  const user = await User.create(userData);

  return {
    ...user.toObject(),
    id: user._id,
    _id: undefined,
    password: undefined,
  };
}, handleMongooseError);

const checkEmail = catchModelAsyncError(async (email) => {
  return await User.findOne({ email }).select("+password");
});

export { createUser, checkEmail };
