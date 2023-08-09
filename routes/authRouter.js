import express from "express";
import User from "../models/User.js";
import { checkAuth, checkAdmin } from "../middlewares/authMiddleware.js";
import { authController, registerController, loginController } from "../controllers/authController.js";
import { body, query, param } from "express-validator";
import validateRequest from "../utils/requestValidator.js";
const router = express.Router();

router.get("/",
    /*  #swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to get user auth details. Pass the JWT token in the authorization header as "Bearer <token>"'
        #swagger.summary = 'Get user auth details'
        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.responses[200] = {
            description: 'User auth details',
            schema: { $ref: "#/definitions/Authenticated" }
        }

        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }

        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: "#/definitions/Internal server error" }
        }

    */
    checkAuth,
    authController
)

router.post("/register",
    /*  #swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to register a new user'
        #swagger.summary = 'Register a new user'
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

router.post("/login",
    /*  #swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to login a user'
        #swagger.summary = 'Login a user'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/Login req.body" }
                }
            }
        }

        #swagger.responses[200] = {
            description: 'Login successful',
            schema: { $ref: "#/definitions/Login successful" }
        }

        #swagger.responses[401] = {
            description: 'incorrect username or password',
            schema: { $ref: "#/definitions/Unauthorized incorrect username or password" }
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
        body("password").exists().withMessage("password is required"),
    ],
    validateRequest,
    loginController
)

router.get('/allUser',  // To refactor this route
    /*  #swagger.tags = ['Auth']
        #swagger.description = 'Endpoint to get all users'
        #swagger.summary = 'Get all users'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'All users',
            schema: { $ref: "#/definitions/All users" }
        }
    */
    checkAuth,
    checkAdmin,
    async (req, res, next) => {
        try {
            const role = req.user.role;
            if (role === 'admin' || role === 'SP' || role === 'DSP') {
                const users = await User.find({}).select('-password');
                return res.status(200).json({
                    success: true,
                    status: 200,
                    message: 'All users',
                    data: users
                });
            } else {
                return res.status(403).json({
                    success: false,
                    status: 403,
                    message: 'Forbidden'
                });
            }
        } catch (error) {
            next(error);
        }
    }
)

export default router;