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
    /*  #swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to register a new user'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/Registration req.body" }
                }
            }
        }

        #swagger.responses[200] = {
            description: 'Registration successful',
            schema: { $ref: "#/definitions/Registration successful" }
        }

        #swagger.responses[409] = {
            description: 'Username already exists',
            schema: { $ref: "#/definitions/Username already exists" }
        }

        #swagger.responses[422] = {
            description: 'Validation error',
            schema: { $ref: "#/definitions/Validation error" }
        }

        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: "#/definitions/Internal server error" }
        }         
    */
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