import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js'
import { checkAuth, checkAdmin } from '../../middlewares/authMiddleware.js';

import { 
    createShift, 
    getOngoingShifts, 
    getOneShift, 
    deleteShift, 
    addPersonnelToShift, 
    addHardwareToShift, 
    removePersonnelFromShift, 
    removeHardwareFromShift, 
    generateReport, 
    findAvailablePersonnels
} from '../../controllers/shiftController.js';

const Router = express.Router();

Router.post('/',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to create a new shift.'
        #swagger.summary = 'creates a new shift for a duty.'

        #swagger.security = [{
            "bearerAuth": []
        }]

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

Router.get('/ongoing',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to get all ongoing shifts.'
        #swagger.summary = 'Get all ongoing shifts.'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Ongoing Duty fetched successfully',
            schema: { $ref: "#/definitions/Get ongoing shifts res.body" }
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
    checkAdmin,
    getOngoingShifts,
)

Router.get('/:id',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to fetch a shift.'
        #swagger.summary = 'fetches a shift from a duty.'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Shift ID',
            required: true,
            type: 'string'
        }

        #swagger.responses[200] = {
            description: 'Shift fetched successfully',
            schema: { $ref: "#/definitions/Shift fetched successfully response" }
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
    getOneShift
);

Router.delete('/:id',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to delete a shift.'
        #swagger.summary = 'deletes a shift from a duty.'

        #swagger.security = [{
            "bearerAuth": []
        }]

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

Router.post('/:id/add_personnel',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to add one or more personnel to a shift.'
        #swagger.summary = 'adds personnels to a shift.'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Shift ID',
            required: true,
            type: 'string'
        }

        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: "#/definitions/Add personnel to shift req.body"
                    }
                }
            }
        }

        #swagger.responses[200] = {
            description: 'Personnels added to shift successfully',
            schema: { $ref: "#/definitions/Personnel added to the shift response" }
        }

        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }

        #swagger.responses[404] = {
            description: 'Shift not found',
            schema: { $ref: "#/definitions/Resource not found" }
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
        param('id').exists().withMessage('Shift ID is required'),
        body('personnel_array').exists().withMessage('Personnel_array is required'),
    ],
    
    validateRequest,
    checkAuth,
    checkAdmin,
    addPersonnelToShift
);

Router.post('/:id/remove_personnel',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to remove one or more personnel from a shift.'
        #swagger.summary = 'removes personnels from a shift.'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Shift ID',
            required: true,
            type: 'string'
        }

        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: "#/definitions/Add personnel to shift req.body"
                    }
                }
            }
        }

        #swagger.responses[200] = {
            description: 'Personnels removed from shift successfully',
            schema: { $ref: "#/definitions/Personnel removed from the shift response" }
        }

        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }

        #swagger.responses[404] = {
            description: 'Shift not found',
            schema: { $ref: "#/definitions/Resource not found" }
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
        param('id').exists().withMessage('Shift ID is required'),
        body('personnel_array').exists().withMessage('Personnel_array is required'),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    removePersonnelFromShift
);

Router.post('/:id/add_hardware',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to add one or more hardwares to a shift.'
        #swagger.summary = 'adds hardwares to a shift.'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'shift id',
            required: true,
            type: 'string'
        }

        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: "#/definitions/Add hardwares to shift req.body"
                    }
                }
            }
        }

        #swagger.responses[200] = {
            description: 'Hardware added to shift successfully',
            schema: { $ref: "#/definitions/hardware added to the shift response" }
        }

        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }

        #swagger.responses[404] = {
            description: 'Hardware not found',
            schema: { $ref: "#/definitions/Resource not found" }
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
        param('id').exists().withMessage('id (shift_id) is required'),
        body('hardware_array').exists().withMessage('Hardware_array is required'),
    ],
    
    validateRequest,
    checkAuth,
    checkAdmin,
    addHardwareToShift
);

Router.post('/:id/remove_hardware',
    /*  #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to remove one or more hardware from a shift.'
        #swagger.summary = 'removes hardwares from a shift.'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Shift ID',
            required: true,
            type: 'string'
        }

        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: "#/definitions/Add hardwares to shift req.body"
                    }
                }
            }
        }

        #swagger.responses[200] = {
            description: 'Hardwares removed from shift successfully',
            schema: { $ref: "#/definitions/Hardware removed from the shift response" }
        }

        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }

        #swagger.responses[404] = {
            description: 'Shift not found',
            schema: { $ref: "#/definitions/Resource not found" }
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
        param('id').exists().withMessage('Shift ID is required'),
        body('hardware_array').exists().withMessage('hardware_array is required'),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    removeHardwareFromShift
);

Router.get("/:id/report",
    /* #swagger.tags = ['Admin : Shift']
        #swagger.description = 'Endpoint to generate report API'
        #swagger.summary = 'report API'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Shift ID',
            required: true,
            type: 'string'
        }

        #swagger.responses[200] = {
            description: 'Report generated successfully',
            schema: { $ref: "#/definitions/Report generated successfully" }
        }

        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }

        #swagger.responses[404] = {
            description: 'Shift not found',
            schema: { $ref: "#/definitions/Resource not found" }
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
    generateReport
)

Router.get("/:id/availablePersonnel",
    checkAuth,
    checkAdmin,
    findAvailablePersonnels,
)

export default Router;