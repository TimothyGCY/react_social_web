// import {genSalt, hash, compareSync } from "bcrypt";

const router = require('express').Router()
const jwt = require('jsonwebtoken')
let User = require('../model/user.model')
const VERIFY = require('./verify')
const bcrypt = require('bcrypt')

router.route('/').get((req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json('Error: ' + err))
})

router.route('/register').post(async (req, res) => {
    console.log("user input: ", req.body)

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })

    try {
        const savedUser = await user.save()
        res.send({
            user: savedUser._id,
        })
    } catch (err) {
        console.log(err)
        res.status(400).send('Error: ' + err)
    }
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        console.log("user not found")
        return res.status(400).json({success: false, message: "user not found"});
    }

    console.log(user.username + " is attempting to login")

    const validPass = await bcrypt.compareSync(req.body.password, user.password)
    console.log(validPass)
    if (!validPass) {
        console.log("password not match")
        return res.status(400).json({success: false, message: "password not match"})
    }

    //create token and add it to header
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-header', token)
    return res.status(200).json({
        success: true,
        message: 'Access granted',
    })
})

router.get('/auth', VERIFY, async (req, res) => {
    // console.log(req.user)
    const user = await User.findOne({_id: req.user._id})
    console.log(user)
    // if(!user)
    res.send(user.username)
})

module.exports = router
