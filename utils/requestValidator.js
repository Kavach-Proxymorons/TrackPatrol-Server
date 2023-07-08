import { validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            status: 422,
            message: "Validation error", 
            errors: errors.array() 
        });
    } else {
        next();
    }
};

export default validateRequest;