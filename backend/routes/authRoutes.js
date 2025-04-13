const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../modules/User");
const BlackList = require("../modules/BlackList");

const {log} = require("debug");
const err = require("jsonwebtoken/lib/JsonWebTokenError");

const router = express.Router();
const blackList = new Set();

const SECRET_KEY = "usc12132345";

function getLoginToken(user){
    const payload = {
        _id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        profileImageUrl: user.profileImageUrl
    };
    const options = {'expiresIn': '1h'};
    return jwt.sign(payload, SECRET_KEY, options);
}

// ./auth/test
// Only for the testing purpose.
router.get('/test', (req, res) => {
    res.send('Hello');
})

// ./auth/login/:email/:password
// Professional realization
// router.post('/login', async (req, res) => {
// const {email, password} = req.body;
// Unprofessional realization. Only for the assignment 3.
router.get('/login/:email/:password', async (req, res) => {
    const {email, password} = req.params;
    console.log(`email:${email},\n password:${password}`);
    try{
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        console.log(user);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match){
            const login_token = getLoginToken(user);

            res.cookie('login_token', login_token,{
                httpOnly: true,
                // secure: process.env.NODE_ENV !== 'production',
                secure: false,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000,
            });

            res.status(200).json({
                message: 'Logged in successfully.',
                success: true,
                data: {
                    userId: user._id.toString(),
                    fullName: user.fullName,
                    email: user.email,
                    profileImageUrl: user.profileImageUrl
                }
            });
        }else{
            res.status(401).json({
                message: "Password or email is incorrect.",
                success: false
            });
        }

    } catch (err){
        res.status(500).json({
            message: "An unexpected error occurred.",
            success: false,
            error: err.message
        });
    }
});

// ./auth/logout
// Professional realization
// router.post('/logout', async (req, res) => {
// Unprofessional realization. Only for the assignment 3.
router.get('/logout', async (req, res) => {
    const login_token = req.cookies['login_token'];
    if (login_token){
        try {
            await BlackList.create({loginToken: login_token});
            res.clearCookie('login_token',{
                path: '/',
                httpOnly: true,
                // secure: process.env.NODE_ENV !== 'production',
                secure: false,
                sameSite: 'strict'
            });
            res.status(200).json({
                message: 'Logged out successfully.',
                success: true
            });
        } catch(err){
            res.status(500).json({
               message: "An unexpected error occurred.",
               success: false,
               error: err.message
            });
        }
    } else {
        res.status(401).json({
           message: "No login token provided.",
           success: false,
           error: err.message
        });
    }
});

// ./auth/me
// Professional realization
// router.post('/me', async (req, res) => {
// Unprofessional realization. Only for the assignment 3.
router.get('/me', async (req, res) => {
    const login_token = req.cookies['login_token'] || req.headers['authorization']?.replace('Bearer ', '');
    if (!login_token) {
        return res.status(401).json({
            message: 'Unauthorized.',
            success: false
        });
    }

    const blockedLoginToken = await BlackList.findOne({loginToken: login_token});
    if (blockedLoginToken) {
        return res.status(401).json({
            message: 'The login token is expired.',
            success: false
        })
    }

    try {
        const payload = jwt.verify(login_token, SECRET_KEY);
        res.status(200).json({
            message: 'User authenticated',
            success: true,
            data: {
                userId: payload._id,
                fullName: payload.fullName,
                email: payload.email,
                profileImageUrl: payload.profileImageUrl
            }
        });
    } catch (err){
        res.status(500).json({
            message: 'An unexpected error occurred.',
            success: false,
            error: err.message
        })
    }
});

// ./auth/register
// Professional realization
// router.post('/register', async (req, res) => {
// const {fullName, email, password} = req.body;
// Unprofessional realization. Only for the assignment 3.
router.get('/register/:fullName/:email/:password', async (req, res) => {
    const {fullName, email, password} = req.params;

    const user = await User.findOne({email: email});
    if (user) {
        return res.status(401).json({
            message: 'User with this email already exists.',
            success: false
        });
    }

    try{
        const newUser = new User ({
            fullName: fullName,
            email: email,
            password: password,
        });

        const savedUser = await newUser.save();

        const login_token = getLoginToken(savedUser);

        res.cookie('login_token', login_token,{
            httpOnly: true,
            // secure: process.env.NODE_ENV !== 'production',
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "User saved successfully.",
            success: true,
            data: {
                userId: savedUser._id.toString(),
                fullName: savedUser.fullName,
                email: savedUser.email,
                profileImageUrl: savedUser.profileImageUrl
            }
            // redirect: '/dashboard'
        });
    } catch (err){
        res.status(500).json({
            message: "An unexpected error occurred.",
            success: false,
            error: err.message});
    }
});

module.exports = router;
