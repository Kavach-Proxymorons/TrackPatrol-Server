import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js'
import { 
    checkAuth
} from '../../middlewares/authMiddleware.js';
import {
    getAssignedDuties,
    getShiftDetails,
    startDuty,
    stopDuty,
    pushGpsData
} from '../../controllers/appDutyController.js';

const Router = express.Router();

Router.get('/',
    /*  #swagger.tags = ['App : Duty']
        #swagger.summary = 'get all upcoming assigned duty shifts in sorted order'
        #swagger.description = 'Endpoint to get upcoming assigned duty shifts in sorted order between start_time and end_time'
        #swagger.security = [{
            "bearerAuth": []
        }]
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
        #swagger.parameters['start_time'] = {
            in: 'query',
            description: 'Start time',
            type: 'string'
        }
        #swagger.parameters['end_time'] = {
            in: 'query',
            description: 'End time',
            type: 'string',
        }
        #swagger.responses[200] = {
            description: 'Duty fetched successfully',
            schema: { $ref: "#/definitions/App get duty res.body" }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }
        #swagger.responses[404] = {
            description: 'Resouce not found',
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
        body('page').exists().withMessage('page is required'),
        body('limit').exists().withMessage('limit is required'),
        body('start_time').optional().isISO8601().withMessage('start_time must be a valid ISO8601 date'),
        body('end_time').optional().isISO8601().withMessage('end_time must be a valid ISO8601 date'),
    ],
    validateRequest,
    checkAuth,
    getAssignedDuties
)

Router.post("/:shift_id/start_duty",
    /*  #swagger.tags = ['App : Duty']
        #swagger.summary = 'start a duty shift by shift_id'
        #swagger.description = 'Endpoint to start a duty shift by shift_id'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.parameters['shift_id'] = {
            in: 'path',
            description: 'shift_id',
            required: true,
            type: 'string'
        }
        #swagger.requestBody = {
            in: 'body',
            description: 'Duty start_stop request body',
            required: true,
            schema: { $ref: "#/definitions/App start_stop duty req.body" }
        }
        #swagger.responses[200] = {
            description: 'Duty started successfully',
            schema: { $ref: "#/definitions/Duty started successfully" }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }
        #swagger.responses[404] = {
            description: 'Resouce not found',
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
        param('shift_id').exists().withMessage('id is required'),
        body('time').exists().withMessage('start_time is required'),
    ],
    validateRequest,
    checkAuth,
    startDuty
)

Router.post("/:shift_id/stop_duty",
    /*  #swagger.tags = ['App : Duty']
        #swagger.summary = 'stop a duty shift by shift_id'
        #swagger.description = 'Endpoint to stop a duty shift by shift_id'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.parameters['shift_id'] = {
            in: 'path',
            description: 'shift_id',
            required: true,
            type: 'string'
        }
        #swagger.requestBody = {
            in: 'body',
            description: 'Duty start_stop request body',
            required: true,
            schema: { $ref: "#/definitions/App start_stop duty req.body" }
        }
        #swagger.responses[200] = {
            description: 'Duty stopped successfully',
            schema: { $ref: "#/definitions/Duty stopped successfully" }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }
        #swagger.responses[404] = {
            description: 'Resouce not found',
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
        param('shift_id').exists().withMessage('id is required'),
        body('time').exists().withMessage('stop_time is required'),
    ],
    validateRequest,
    checkAuth,
    stopDuty
)

Router.get("/:shift_id",
    /*  #swagger.tags = ['App : Duty']
        #swagger.summary = 'get a details of a duty shift by shift_id'
        #swagger.description = 'Endpoint to get details of a duty shift by shift_id'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.parameters['shift_id'] = {
            in: 'path',
            description: 'Duty id',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: 'Duty fetched successfully',
            schema: { $ref: "#/definitions/App get duty res.body" }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }
        #swagger.responses[404] = {
            description: 'Resouce not found',
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
        param('shift_id').exists().withMessage('id is required'),
    ],
    validateRequest,
    checkAuth,
    getShiftDetails
)

Router.post("/:shift_id/push_gps_data",
    /*  #swagger.tags = ['App : Duty']
        #swagger.summary = 'push gps data of a duty shift by shift_id'
        #swagger.description = 'Endpoint to push gps data of a duty shift by shift_id'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.parameters['shift_id'] = {
            in: 'path',
            description: 'Duty id',
            required: true,
            type: 'string'
        }
        #swagger.requestBody = {
            in: 'body',
            description: 'Gps data push request body',
            required: true,
            schema: { $ref: "#/definitions/App push gps data req.body" }
        }
        #swagger.responses[200] = {
            description: 'Gps data pushed successfully',
            schema: { $ref: "#/definitions/Gps data pushed successfully" }
        }
        #swagger.responses[404] = {
            description: 'Resouce not found',
            schema: { $ref: "#/definitions/Resource not found" }
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
        param('shift_id').exists().withMessage('id is required'),
        body('').exists().withMessage('gps_data is required'),
    ],
    validateRequest,
    checkAuth,
    pushGpsData
)

export default Router;