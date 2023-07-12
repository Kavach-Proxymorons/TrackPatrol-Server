import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js'
import { checkAuth, 
         checkAdmin 
} from '../../middlewares/authMiddleware.js';
import { createDuty,
         getDuty,
         getOneDuty,
} from '../../controllers/dutyController.js';

const Router = express.Router();

Router.post('/',
    /*  #swagger.tags = ['Admin : Duty']
        #swagger.description = 'Endpoint to create a new duty.' 
        #swagger.summary = 'create a new duty.'

        #swagger.requestBody = {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        $ref: "#/definitions/Create duty req.body"
                    }
                }
            }
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
        body('title').exists().withMessage('title is required'),
        body('description').exists().withMessage('description is required'),
        body('venue').exists().withMessage('venue is required'),
        body('location').exists().withMessage('location is required'),
        body('start_time').exists().withMessage('start_time is required'),
        body('note').exists().withMessage('note is required'),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    createDuty
);

Router.get('/',
    /*  #swagger.tags = ['Admin : Duty']
        #swagger.description = 'Endpoint to get all duty in sorted order.'
        #swagger.summary = 'Get all duty in sorted order.'
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            required: true
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Number of duty per page',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Duty fetched successfully',
            schema: { $ref: "#/definitions/Get duty res.body" }
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
        body('page').exists().withMessage('page is required'),
        body('limit').exists().withMessage('limit is required'),
    ],
    checkAuth,
    checkAdmin,
    getDuty
)

Router.get('/:id',
    /*  #swagger.tags = ['Admin : Duty']
        #swagger.description = 'Endpoint to get a duty by id.'
        #swagger.summary = 'Get a duty by id.'
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Duty id',
            required: true
        }
        #swagger.responses[200] = {
            description: 'Duty fetched successfully',
            schema: { $ref: "#/definitions/Get duty res.body" }
        }
        #swagger.responses[401] = {
            description: 'Unauthorized',
            schema: { $ref: "#/definitions/Unauthorized" }
        }
        #swagger.responses[404] = {
            description: 'Duty not found',
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
        param('id').exists().withMessage('id is required'),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    getOneDuty
)

export default Router;
