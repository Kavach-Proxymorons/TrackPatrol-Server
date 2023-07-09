import express from "express";
import authRouter from "./authRouter.js";
import personnelRouter from "./personnelRouter.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/personnel", personnelRouter);

export default router;