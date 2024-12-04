const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const SALT_LENGTH = 12;

router.post('/signup', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username })
        if (userInDatabase) {
            return res.json({error: 'Username already taken.'})
        }
        const user = await User.create({
            username: req.body.username,
            hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH)
        })
        const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ user, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});



module.exports = router;
