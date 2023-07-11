import express from "express";
import { checkAuth, checkAdmin } from "../../middlewares/authMiddleware.js";
import { addPersonnel,
        bulkCreatePersonnel, 
        getPersonnelList, 
        getOnePersonnel, 
        deleteOnePersonnel, 
        searchPersonnel,
        bulkDeletePersonnel,
        updateOnePersonnel, 
} from "../../controllers/personnelController.js";
import { body, query, param } from "express-validator";
import validateRequest from "../../utils/requestValidator.js";
import uploadFile from "../../utils/uploads.js";

const router = express.Router();

router.post("/",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Create a new personnel (requires role : "admin" )'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/create personnel req.body" }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Personnel created successfully',
            schema: { $ref: "#/definitions/Personnel created successfully response" }
        }
        #swagger.responses[409] = {
            description: 'sid already exists',
            schema: { $ref: "#/definitions/Username already exists" }
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
        body("sid").exists().withMessage("SID is required"),
        body("official_name").exists().withMessage("Official name is required"),
        body("designation").exists().withMessage("Designation is required"),
        body("photograph").exists().withMessage("Photograph is required"),
        body("dob").exists().withMessage("Date of birth is required"),
        body("blood_group").exists().withMessage("Blood group is required"),
        body("identification_mark").exists().withMessage("Identification mark is required"),
        body("posted_at").exists().withMessage("Posted at is required"),
        body("address").exists().withMessage("Address is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    addPersonnel
);

router.get("/bulk_create/get_template",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Endpoint to get the csv template for bulk personnel creation (requires role : "admin" )'
        #swagger.security = [{
            "bearerAuth": []
        }]
    */
    checkAuth,
    checkAdmin,
    (req, res) => {
        res.download("uploads/bulk_create_personnel_template.csv");
    }
)

router.post("/bulk_create",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Endpoint to create multiple personnel records from a csv file (requires role : "admin") sample_file: https://docs.google.com/spreadsheets/d/1nREThXMnFuE5Rgo3XyY9hG5FYOPHe1J2o5NpZEsR26E/edit?usp=sharing'
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.consumes = ['multipart/form-data']
        #swagger.requestBody = {
            required: true,
            "@content": {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            csv_file: {
                                type: "string",
                                format: "binary"
                            }
                        },
                        required: ["csv_file"]
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: 'Personnel bulk created successfully',
            schema: { $ref: "#/definitions/Personnel bulk creation successful response" }
        }
        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref: "#/definitions/Internal server error" }
        }
    */
    uploadFile("csv_file"),
    validateRequest,
    checkAuth,
    checkAdmin,
    bulkCreatePersonnel
)

router.get("/",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Get all personnel with pagination (requires role : "admin" )'
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
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Personnel list',
            schema: { $ref: "#/definitions/Personnel list response" }
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
        query("page").exists().withMessage("Page number is required"),
        query("limit").exists().withMessage("Limit per page is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    getPersonnelList
);

router.get("/search",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Search personnel by sid or name (requires role : "admin" )'
        #swagger.parameters['q'] = {
            in: 'query',
            description: 'Search query',
            required: true,
            type: 'string'
        }
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
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Personnel list',
            schema: { $ref: "#/definitions/Personnel list response" }
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
        query("q").exists().withMessage("Search query is required"),
        query("page").exists().withMessage("Page number is required"),
        query("limit").exists().withMessage("Limit per page is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    searchPersonnel
);

router.get("/:sid",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Get personnel by sid (requires role : "admin" )'
        #swagger.parameters['sid'] = {
            in: 'path',
            description: 'SID of personnel',
            required: true,
            type: 'string'
        }
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Personnel details',
            schema: { $ref: "#/definitions/Personnel details response" }
        }
        #swagger.responses[404] = {
            description: 'Personnel not found response',
            schema: { $ref: "#/definitions/Personnel not found response" }
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
        param("sid").exists().withMessage("sid is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    getOnePersonnel
)

router.delete("/bulk_delete",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Delete multiple personnel by sid. (requires role : "admin" )'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/Bulk delete personnel req.body" }
                }
            }
        }
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Personnel deleted in bulk response',
            schema: { $ref: "#/definitions/Personnel deleted in bulk response" }
        }
        #swagger.responses[404] = {
            description: 'Personnel not found response',
            schema: { $ref: "#/definitions/Personnel not found response" }
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
        body("sids").exists().withMessage("sids is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    bulkDeletePersonnel 
)

router.delete("/:sid",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Delete personnel by sid. (requires role : "admin" )'
        #swagger.parameters['sid'] = {
            in: 'path',
            description: 'SID of personnel',
            required: true,
            type: 'string'
        }
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Personnel deleted successfully',
            schema: { $ref: "#/definitions/Personnel deleted successfully response" }
        }
        #swagger.responses[404] = {
            description: 'Personnel not found response',
            schema: { $ref: "#/definitions/Personnel not found response" }
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
        param("sid").exists().withMessage("sid is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    deleteOnePersonnel
)

router.put("/:sid",
    /*  #swagger.tags = ['Admin : Personnel']
        #swagger.description = 'Update personnel by sid. (requires role : "admin" )'
        #swagger.parameters['sid'] = {
            in: 'path',
            description: 'SID of personnel',
            required: true,
            type: 'string'
        }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/definitions/create personnel req.body" }
                }
            }
        }
        #swagger.security = [{
            "bearerAuth": []
        }]
        #swagger.responses[200] = {
            description: 'Personnel updated successfully',
            schema: { $ref: "#/definitions/Personnel updated successfully response" }
        }
        #swagger.responses[404] = {
            description: 'Personnel not found response',
            schema: { $ref: "#/definitions/Personnel not found response" }
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
        body("sid").exists().withMessage("SID is required"),
        body("official_name").exists().withMessage("Official name is required"),
        body("designation").exists().withMessage("Designation is required"),
        body("photograph").exists().withMessage("Photograph is required"),
        body("dob").exists().withMessage("Date of birth is required"),
        body("blood_group").exists().withMessage("Blood group is required"),
        body("identification_mark").exists().withMessage("Identification mark is required"),
        body("posted_at").exists().withMessage("Posted at is required"),
        body("address").exists().withMessage("Address is required"),
    ],
    validateRequest,
    checkAuth,
    checkAdmin,
    updateOnePersonnel
)
        


export default router;