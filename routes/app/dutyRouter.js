import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../../utils/requestValidator.js'
import { 
    checkAuth,
    checkAdmin
} from '../../middlewares/authMiddleware.js';
import {
    getAssignedDuties
} from '../../controllers/appDutyController.js';

const Router = express.Router();

Router.get('/',
    /*  #swagger.tags = ['App : Duty']
        #swagger.summary = 'get all upcoming assigned duties in sorted order.'
        #swagger.description = 'Endpoint to get upcoming assigned duties in sorted order.'
        #swagger.security = [{
            "bearerAuth": []
        }]
    */
    checkAuth,
    getAssignedDuties
)

export default Router;