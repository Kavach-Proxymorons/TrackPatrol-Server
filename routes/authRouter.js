import express from "express";
import { registerController, loginController } from "../controllers/authController.js";
import { body, query, param } from "express-validator";
import validateRequest from "../utils/requestValidator.js";
const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    res.status(200).send(`Username: ${username}, Password: ${password}`);
});

router.post("/register",
    [
        body("username").exists().withMessage("username is required"),
        body("name").exists().withMessage("name is required"),
        body("password").exists().withMessage("password is required"),
        body("role").exists().withMessage("role is required. enum: admin, personnel"),
    ],
    validateRequest,
    registerController
);

export default router;