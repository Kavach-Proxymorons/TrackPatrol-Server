import express from "express";
import authRouter from "./authRouter.js";
import personnelRouter from "./admin/personnelRouter.js";
import adminHardwareRouter from "./admin/adminHardwareRouter.js";
import dutyRouter from "./admin/dutyRouter.js";
import shiftRouter from "./admin/shiftRouter.js";
import appDutyRouter from "./app/dutyRouter.js";
import app from "../app.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin/personnel", personnelRouter);
router.use("/admin/hardware", adminHardwareRouter);
router.use("/admin/duty", dutyRouter);
router.use("/admin/shift", shiftRouter);

router.use("/app/duty", appDutyRouter);

export default router;