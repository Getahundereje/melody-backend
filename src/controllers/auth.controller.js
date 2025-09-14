import jwt from "jsonwebtoken";

import { checkEmail, createUser } from "../models/user/user.model.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import AppError from "../utils/appError.js";
import createJwtTokens from "../utils/createJwtTokens.js";

const signUp = catchAsyncError(async (req, res, next) => {
  const { email, fullName, password, confirmPassword } = req.body;

  if (!email || !fullName || !password)
    next(new AppError("Please provide all required fileds.", 400));

  if (password !== confirmPassword)
    next(new AppError("Please provide matching passwords."));

  const user = await createUser({ email, fullName, password });

  const { accessToken, refreshToken } = createJwtTokens({
    id: user.id,
    email: user.email,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(201).json({
    status: "success",
    data: {
      accessToken,
      user,
    },
  });
});

const signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide all required fields.", 401));

  const user = await checkEmail(email);

  if (user && (await user.comparePassword(password))) {
    user.password = undefined;

    const { accessToken, refreshToken } = createJwtTokens({
      id: user.id,
      email: user.email,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      status: "success",
      data: {
        accessToken,
        user,
      },
    });
  }

  next(new AppError("Please provide valide email and password.", 401));
});

export { signUp, signIn };
