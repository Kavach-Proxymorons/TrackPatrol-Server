import User from "../models/User.js";

const registerController = async (req, res) => {
    /*
        #swagger.tags = ['Auth']

        #swagger.description = 'Endpoint to register a new user'

        #swagger.responses[201] = {
            description: 'User registered successfully',
            schema: { 
                success: true,
                message: 'User registered successfully' 
            }
        }
        
        #swagger.responses[409] = {
            description: 'username already exists',
            schema: {
                success: false,
                message: 'username already exists'
            }
        }

        #swagger.responses[500] = {
            description: 'Internal server error',
            schema: { $ref : "#/definitions/Internal Server Error"}
        }
    */

    try {
        const { username, name, password, role } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'ussername already exists'
            });
        }

        // Create a new user
        const newUser = new User({
            username,
            name,
            password,
            role
        });

        // Save the user to the database
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

const loginController = async (req, res) => {
}

export { registerController, loginController };