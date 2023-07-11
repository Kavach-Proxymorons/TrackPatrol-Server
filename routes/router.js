import express from "express";
import authRouter from "./authRouter.js";
import personnelRouter from "./admin/personnelRouter.js";
import adminHardwareRouter from "./admin/adminHardwareRouter.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin/personnel", personnelRouter);
router.use("/admin/hardware", adminHardwareRouter);

export default router;