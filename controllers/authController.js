const registerController = async (req, res) => {
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