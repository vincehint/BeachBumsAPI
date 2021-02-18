const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createUserToken } = require('../middleware/auth')

router.post('/login', (req, res)=> {
    User.findOne({email: req.body.email})
    .then(foundUser=>createdUserToken(req, foundUser))
    .then(token => res.json({token}))
    .catch(err=>console.log('Error Logging in', err))
})

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash=>({
        email: req.body.email,
        password: hash,
        motto: req.body.motto
    }))
    .then(hashedUser=>User.create(hashedUser))
    .then(createdUser=> createUserToken(req, createdUser))
    .then(token => res.json(token))
    .catch(err => console.log('ERROR CREATING USER', err))
})

module.exports = router