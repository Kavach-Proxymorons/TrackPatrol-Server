import express from 'express';
import { body, query } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js';
import { checkAuth, checkAdmin } from '../../middlewares/authMiddleware.js';
import { hardwareRegisterController,
    fetchAllHardwareController
} from '../../controllers/adminHardwareController.js';

const Router = express.Router();

Router.post("/",
    /*  #swagger.tags = ['Admin : Hardware']
        #swagger description = 'Endpoint to register a new Hardware',
        #swagger.summary = 'Register a new Hardware',
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/create hardware req.body" }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Hardware registered successfully',
            schema: { $ref: "#/definitions/Hardware created successfully response" }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }
        #swagger.responses[409] = {
            description: 'hardware_id already exists',
            schema: { $ref: "#/definitions/Hardware_id already exists response" }
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
        body("hardware_id").exists().withMessage("hardware_id is required"),
        body("secret").exists().withMessage("secret is required"),
        body("name").exists().withMessage("name is required"),
        body("description").exists().withMessage("description is required"),
        body("type").exists().withMessage("type is required"),
        body("status").exists().withMessage("status is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    hardwareRegisterController
);

Router.get("/",
    /*  #swagger.tags = ['Admin : Hardware']
        #swagger.description = 'Endpoint to fetch all Hardware',
        #swagger.summary = 'Endpoint to fetch all Hardware',
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'page number',
            required: true,
            type: 'integer'
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'limit per page',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Hardware fetched successfully',
            schema: { $ref: "#/definitions/Hardware fetched successfully response" }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
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
        query("page").exists().withMessage("page is required"),
        query("limit").exists().withMessage("limit is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    fetchAllHardwareController
);





export default Router;