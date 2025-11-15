const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const { isValidToken } = require('../utils/token.js');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user
        const existingUser = await User.findOne({
            where: { email }
        });

        if (!existingUser) {
            return res.status(400).json({ success: false, message: 'User not found', data: {} });
        }

        // 2. Compare passwords safely (async)
        const isValidPassword = await bcrypt.compare(password, existingUser.dataValues.password);

        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: 'Invalid password', data: {} });
        }

        // 3. Create token
        const token = jwt.sign(
            { id: existingUser.dataValues.id, role: existingUser.dataValues.role },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, message: 'Login successful', data: token });

    } catch (error) {
        // 4. Catch any errors
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ success: false, message: 'Server error during login', data: error.message });
    }
});

router.post('/check', async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token not found', data: {} })
    }

    const validToken = isValidToken(token);

    if (!validToken) {
        return res.status(400).json({ success: false, message: 'Token not valid', data: {} })
    }
    res.status(200).json({ success: true, message: 'Token is valid', data: {} })
})


module.exports = router;