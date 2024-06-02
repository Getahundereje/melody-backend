import jwt from "jsonwebtoken";

import { checkEmail, createUser } from "../models/user/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import AppError from "../utils/appError.js";

function createCookieWithJwtToken(payload, res) {
  const jwtToken = jwt.sign({ payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  res.cookie("user", jwtToken, {
    maxAge: 1000 * 60 * 10,
    signed: false,
    httpOnly: true,
  });
}

const signUp = catchAsyncError(async (req, res, next) => {
  const { email, fullName, password, confirmPassword } = req.body;

  if (!email || !fullName || !password)
    next(new AppError("Please provide all required fileds.", 400));

  if (password !== confirmPassword)
    next(new AppError("Please provide matching passwords."));

  const user = await createUser({ email, fullName, password });

  createCookieWithJwtToken(user.id, res);

  return res.status(200).json({
    status: "succuss",
    data: {
      user,
    },
  });
});

const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    next(new AppError("Please provide all required fields."));

  const user = await checkEmail(email);

  if (user && (await user.comparePassword(password))) {
    createCookieWithJwtToken(user.id, res);

    user.password = undefined;

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }

  next(new AppError("Please provide valide email and password.", 401));
});

export { signUp, signIn };
