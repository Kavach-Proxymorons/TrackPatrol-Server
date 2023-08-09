import User from "../models/User.js";
import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
    try {
        // If authorization header not found
        if(!req.headers.authorization)
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Unauthorized : no authorization header found'
            });

        // Get the token from the header
        const token = req.headers.authorization.split(" ")[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user
        const user = await User.findById(decoded._id);

        // If user not found
        if(!user)
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Unauthorized'
            });

        // If user found
        // Remove the password from the user object
        user.password = undefined;

        // Add the user object and role to the request object
        req.user = user;
        req.role = user.role;

        next();

    } // catch jsonwebtoken.JsonWebTokenError
    catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            const err = new Error('Unauthorized');
            err.status = 401;
            next(err);
        } else {
            next(err);
        }
    }
}

// use checkAdmin after checkAuth
const checkAdmin = async (req, res, next) => {
    try {
        // return next(); // remove in production

        if(req.role === 'admin' || req.role === 'SP' || req.role === 'DSP' || req.role === 'CI' || req.role === 'SI' )
            return next();

        return res.status(403).json({
            success: false,
            status: 403,
            message: 'Forbidden'
        });
    } catch (error) {
        next(error);
    }
}

export { checkAuth, checkAdmin }
