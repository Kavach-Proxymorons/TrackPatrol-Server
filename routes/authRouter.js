import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    res.status(200).send(`Username: ${username}, Password: ${password}`);
});

export default router;