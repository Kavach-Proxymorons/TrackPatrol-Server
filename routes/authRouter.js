import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    res.status(200).send(`Username: ${username}, Password: ${password}`);
});

router.post("/signup", async(req, res) => {
    try {
        const { username, name, password, role } = req.body;
    
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ error: 'Username already exists' });
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
    
        return res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
});

export default router;