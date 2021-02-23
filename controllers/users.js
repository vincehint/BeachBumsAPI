const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createUserToken } = require('../middleware/auth')
const passport = require("passport")

router.post('/login', (req, res)=> {
    User.findOne({email: req.body.email})
    .then(foundUser=>createUserToken(req, foundUser))
    .then(token => res.json({token}))
    .catch(err=>console.log('Error Logging in', err))
})

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash=>({
        email: req.body.email,
        password: hash,
        username: req.body.username,
        birthdate: req.body.birthdate,
        photo: req.body.photo
    }))
    .then(hashedUser=>User.create(hashedUser))
    .then(createdUser=> createUserToken(req, createdUser))
    .then(token => res.status(201).json({token}))
    .catch(err => console.log('ERROR CREATING USER', err))
})

router.post('/profile/edit', (req, res)=> {
    bcrypt.hash(req.body.password, 10)
    .then(hash=>({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        birthdate: req.body.birthdate,
        location: req.body.location,
        about: req.body.about,
        photo: req.body.photo
    }))
    .then(hashedUser =>{
        console.log(hashedUser)
        User.findOneAndUpdate({_id: req.body.id},hashedUser,{new:true})
        .then(foundUser=> {
            console.log(foundUser)
            createUserToken(req, foundUser)
        })
        .then(token => res.json({token}))
    })
    .catch(err=>console.log('ERROR IN EDIT PROFILE', err))
})

router.delete('/:id', (req, res)=> {
    console.log('entrou')
    User.deleteOne({_id: req.params.id})
    .catch(err=>console.log('ERROR IN Delete Account', err))
})

//Private
//GET /api/private
router.get('/private', passport.authenticate('jwt', {session: false}), (req, res)=> {
    return res.json({"message": "Thou hath been granted permission to access this route!"})
})

module.exports = router




  