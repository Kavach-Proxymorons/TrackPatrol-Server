import User from "../models/User.js";
import jwt from "jsonwebtoken";

const authController = async (req, res, next) => {
    try{
        // Remove the password from the user object
        req.user.password = undefined;

        // Send the response
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Authorized',
            data: req.user
        });
    } catch(error){
        next(error);
    }
}

const registerController = async (req, res, next) => {
    try {
        const { username, name, password, role, police_station } = req.body;

        // Create a new user
        const newUser = new User({
            username,
            name,
            password,
            police_station,
            role
        });

        // Save the user
        await newUser.save();

        // Remove the password from the user object
        newUser.password = undefined;

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'User registered successfully',
            data: newUser
        });

    } catch (error) {
        next(error);
    }
}

const loginController = async (req, res, next) => {
    try{
        const { username, password } = req.body;

        // Find the user
        const user = await User.findOne({ username });

        // If user not found
        if(!user)
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Incorrect username or password'
            });

        // If user found
        // Compare the password
        const isMatch = await user.comparePassword(password);

        // If password doesn't match
        if(!isMatch)
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Incorrect username or password'
            });

        // If password matches
        // Generate the token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

        // Update the last login
        await User.findByIdAndUpdate(user._id, { last_login: new Date() });
        
        // remove the password from the user object
        user.password = undefined;
        

        // Send the response
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Login successful',
            data: {
                token,
                expires_in: process.env.JWT_EXPIRY,
                user
            }
        });   
    }
    catch(error){
        next(error);
    }
}

export { 
    authController, 
    registerController, 
    loginController 
};