import express from "express";
import authRouter from "./authRouter.js";
import personnelRouter from "./admin/personnelRouter.js";
import adminHardwareRouter from "./admin/adminHardwareRouter.js";
import HardwareRouter from "./hardware/hardwareRouter.js";
import dutyRouter from "./admin/dutyRouter.js";
import shiftRouter from "./admin/shiftRouter.js";
import appDutyRouter from "./app/dutyRouter.js";
import app from "../app.js";

import Duty from "../models/Duty.js";
import Personnel from "../models/Personnel.js";
import Hardware from "../models/Hardware.js";
import Shift from "../models/Shift.js";
import Issue from "../models/Issue.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin/personnel", personnelRouter);
router.use("/admin/hardware", adminHardwareRouter);
router.use("/admin/duty", dutyRouter);
router.use("/admin/shift", shiftRouter);

router.use("/app/duty", appDutyRouter);

router.use("/hardware", HardwareRouter);

router.get("/dashboardStats", async(req, res) => {
    try {
        const duty = await Duty.countDocuments();
        const personnel = await Personnel.countDocuments();
        const hardware = await Hardware.countDocuments();
        const shift = await Shift.countDocuments();
        const issue = await Issue.countDocuments();

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Dashboard Stats fetched successfully',
            data: {
                duty,
                personnel,
                hardware,
                shift,
                issue
            }
        });
    } catch (error) {
        next(error);
    }
})

export default router;