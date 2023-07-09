import express from "express";
import { checkAuth, checkAdmin } from "../middlewares/authMiddleware.js";
import { addPersonnel, getPersonnelList } from "../controllers/personnelController.js";
import { body, query, param } from "express-validator";
import validateRequest from "../utils/requestValidator.js";

const router = express.Router();

router.post("/",
    /*  #swagger.tags = ['Personnel']
        #swagger.description = 'Create a new personnel'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/create personnel req.body" }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Personnel created successfully',
            schema: { $ref: "#/definitions/Personnel created successfully response" }
        }
        #swagger.responses[409] = {
            description: 'sid already exists',
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
        body("sid").exists().withMessage("SID is required"),
        body("official_name").exists().withMessage("Official name is required"),
        body("designation").exists().withMessage("Designation is required"),
        body("photograph").exists().withMessage("Photograph is required"),
        body("dob").exists().withMessage("Date of birth is required"),
        body("blood_group").exists().withMessage("Blood group is required"),
        body("identification_mark").exists().withMessage("Identification mark is required"),
        body("posted_at").exists().withMessage("Posted at is required"),
        body("address").exists().withMessage("Address is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    addPersonnel
);

router.get("/",
    /*  #swagger.tags = ['Personnel']
        #swagger.description = 'Get all personnel with pagination'
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Limit per page',
            required: true,
            type: 'integer'
        }
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Personnel list',
            schema: { $ref: "#/definitions/Personnel list response" }
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
        query("page").exists().withMessage("Page number is required"),
        query("limit").exists().withMessage("Limit per page is required"),
    ],
    validateRequest,
    // checkAuth,
    getPersonnelList
);

export default router;