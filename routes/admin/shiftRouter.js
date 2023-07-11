import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js'
import { checkAuth, checkAdmin } from '../../middlewares/authMiddleware.js';

import { createShift, deleteShift } from '../../controllers/shiftController.js';

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

Router.delete('/:id',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to delete a shift.'
        #swagger.summary = 'deletes a shift from a duty.'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Shift ID',
            required: true,
            type: 'string'
        }

        #swagger.responses[200] = {
            description: 'Shift deleted successfully',
            schema: { $ref: "#/definitions/Success" }
        }

        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }

        #swagger.responses[404] = {
            description: 'Shift not found',
            schema: { $ref: "#/definitions/Resource not found" }
        }

        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: "#/definitions/Internal server error" }
        }
    */
    [
        param('id').exists().withMessage('Shift ID is required'),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    deleteShift
);




export default Router;