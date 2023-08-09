import express from 'express';
import { body, param, query } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js'
import Issue from '../../models/Issue.js';
import { 
    checkAuth
} from '../../middlewares/authMiddleware.js';
import {
    getAssignedDuties,
    getShiftDetails,
    startDuty,
    stopDuty,
    pushGpsData,
    bulkPushGpsData,
    postIssueController
} from '../../controllers/appDutyController.js';

const Router = express.Router();

Router.get('/getIssues', async(req, res, next) => {
    try{
        const issues = await Issue.find({}).populate("issue_creator").exec();
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Issues fetched successfully',
            data: issues
        })
    } catch (err) {
        next(err);
    }
});

Router.get('/markComplete/:issue_id', async(req, res, next) => {
    try{
        const { issue_id } = req.params;
        const requiredIssue = await Issue.findById(issue_id).exec();
        if(!requiredIssue){
            const err = new Error('Issue not found');
            err.status = 404;
            throw err;
        }
        requiredIssue.issue_status = "completed";
        await requiredIssue.save();
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Issue marked as completed successfully',
            data: requiredIssue
        })
    } catch (err) {
        next(err);
    }
});

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
        query('page').exists().withMessage('page is required'),
        query('limit').exists().withMessage('limit is required'),
        query('start_time').optional().isISO8601().withMessage('start_time must be a valid ISO8601 date'),
        query('end_time').optional().isISO8601().withMessage('end_time must be a valid ISO8601 date'),
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

Router.post("/:shift_id/post_issue",
    /*
        #swagger.tags = ['App : Duty']
        #swagger.summary = 'post an issue for a duty shift by shift_id'
        #swagger.description = 'Endpoint to post an issue for a duty shift by shift_id'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.parameters['shift_id'] = {
            in: 'path',
            description: 'shift_id',
        }
        #swagger.requestBody = {
            in: 'body',
            description: 'Duty post issue request body',
            required: true,
            schema: { $ref: "#/definitions/App post issue req.body" }
        }
        #swagger.responses[200] = {
            description: 'Issue posted successfully',
            schema: { $ref: "#/definitions/Issue posted successfully" }
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
    param('shift_id').exists().withMessage('shift_id is required'),
    body('issue_category').exists().withMessage('issue is required'),
    body('description').exists().withMessage('description is required'),
   ],
    validateRequest,
    checkAuth,
    postIssueController
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
        #swagger.responses[400] = {
            description: 'Duty state conflict',
            schema: { $ref: "#/definitions/Duty_state_conflict" }
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
    ],
    validateRequest,
    checkAuth,
    pushGpsData
)

Router.post("/:shift_id/push_gps_data_bulk",
    /*
        #swagger.tags = ['App : Duty']
        #swagger.summary = 'push gps data of a duty after app become online. '
        #swagger.description = 'Endpoint to push gps data of a duty after app become online. '
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
            description: 'Gps bulk data push request body',
            required: true,
            schema: { $ref: "#/definitions/App bulk push gps data req.body" }
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
    ],
    validateRequest,
    checkAuth,
    bulkPushGpsData,
)

export default Router;