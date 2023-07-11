import express from 'express';
import { body } from 'express-validator';
import { createDuty,
} from '../../controllers/dutyController.js';

const Router = express.Router();

Router.post('/',
    /*  #swagger.tags = ['Admin : Duty']
        #swagger.description = 'Endpoint to create a new duty.' 

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
    createDuty
);


export default Router;
