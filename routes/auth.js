const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());

router.post("/register", async (req, res) => {
    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 400,
                message: "Please fill all input."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = new User({
            username,
            password: hashedPassword
        })

        const userResponse = await userData.save()

        const token = jwt.sign({ userId: userResponse._id }, process.env.SECRET_KEY)

        res.status(200).json({
            status: 200,
            userId: userResponse._id,
            username: username,
            message: 'Registered successfully',
            token: token
        })

    } catch (error) {

        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username && !password) {
            return res.status(400).json({
                status: 400,
                message: "Please fill all input"
            });
        }

        const validUser = await User.findOne({ username })

        if (!validUser) {
            return res.status(409).json({
                status: 409,
                message: 'Please enter valid username'
            })
        }

        const passwordMatch = await bcrypt.compare(password, validUser.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign({ userId: validUser._id }, process.env.SECRET_KEY);

        res.status(200).json({
            status: 200,
            message: 'Login successfully',
            userId: validUser._id,
            username: username,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
});

module.exports = router;