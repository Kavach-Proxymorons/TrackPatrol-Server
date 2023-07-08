import User from "../models/User.js";
import jwt from "jsonwebtoken";

const registerController = async (req, res, next) => {
    try {
        const { username, name, password, role } = req.body;

        // Create a new user
        const newUser = new User({
            username,
            name,
            password,
            role
        });

        // Save the user
        await newUser.save();

        
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

const loginController = async (req, res) => {
}

export { registerController, loginController };