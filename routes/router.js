import express from "express";
import authRouter from "./authRouter.js";

const router = express.Router();

router.get("/auth", authRouter);

export default router;