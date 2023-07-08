import User from "../models/User.js";
import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
    try {
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

    } catch (error) {
        next(error);
    }
}

export { checkAuth }
