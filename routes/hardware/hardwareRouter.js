import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js';
import { pushDataController } from '../../controllers/hardwareController.js';

const Router = express.Router();

Router.post('/pushData', 
    /*  #swagger.tags = ['Hardware']
        #swagger.description = 'Endpoint to push data from hardware to server.'
        #swagger.summary = 'Endpoint to push data from hardware to server.'
        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: "#/definitions/Hardware data push req.body"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Hardware data successfully pushed',
            schema: { $ref: "#/definitions/Hardware data successfully pushed" }
        }
        #swagger.responses[400] = {
            description: 'Hardware not attached to any shift',
            schema: { $ref: "#/definitions/Hardware not attached to any shift" }
        }
        #swagger.responses[404] = {
            description: 'Hardware not found',
            schema: { $ref: "#/definitions/Hardware not found" }
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
        body('hardware_id').exists().withMessage('hardware_id is required'),
        body('secret').exists().withMessage('secret is required'),
        body('timestamp').exists().withMessage('timestamp is required'),
        body('data').exists().withMessage('data is required'),
    ],
    validateRequest,
    pushDataController
);


export default Router;