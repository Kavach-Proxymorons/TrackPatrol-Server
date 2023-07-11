import express from 'express';
import { body } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js'
import { checkAuth, checkAdmin } from '../../middlewares/authMiddleware.js';

import { createShift } from '../../controllers/shiftController.js';

const Router = express.Router();

Router.post('/',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to create a new shift.'
        #swagger.summary = 'creates a new shift for a duty.'

        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: "#/definitions/Create shift req.body"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Shift created successfully',
            schema: { $ref: "#/definitions/Shift created successfully response" }
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
        body('shift_name').exists().withMessage('Shift name is required'),
        body('duty').exists().withMessage('Duty is required'),
        body('start_time').exists().withMessage('Start time is required'),
        body('end_time').exists().withMessage('End time is required'),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    createShift
);

export default Router;