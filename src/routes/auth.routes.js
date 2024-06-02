import express from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/auth/signup/", signUp);
authRouter.post("/auth/signin", signIn);

export default authRouter;
