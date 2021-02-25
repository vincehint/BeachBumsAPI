const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createUserToken } = require('../middleware/auth')
const passport = require("passport")


router.post('/login', (req, res)=> {
    User.findOne({email: req.body.email}).populate('posts')
    .then(foundUser=>createUserToken(req, foundUser))
    .then(token => res.json({token}))
    .catch(err=>console.log('Error Logging in', err))
})

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash=>({
        email: req.body.email,
        password: hash
    }))
    .then(hashedUser=>User.create(hashedUser))
    .then(createdUser=> createUserToken(req, createdUser))
    .then(token => res.status(201).json({token}))
    .catch(err => console.log('ERROR CREATING USER', err))
})


router.post('/profile/edit', (req, res)=> {
    console.log('entrou update')
    bcrypt.hash(req.body.password, 10)
    .then(hash =>({
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
        console.log(hashedUser.password)
        User.findOneAndUpdate({_id: req.body.id},hashedUser,{new:true})
        .then(foundUser=> {
            console.log(foundUser)
            createUserToken(req, foundUser)
        })
        .then(token => res.json({token}))
    })
    .catch(err=>console.log('ERROR IN EDIT PROFILE', err))
  
})



router.get('/users', (req,res)=>{
    // console.log(req.params.id)
    // User.find({_id:{$ne:req.params.id}})
    User.find({})
    .then(foundUsers=>{
        console.log(foundUsers)
        res.json(foundUsers)
        // res.status(200).send({ message: 'Others Users selected' })
    })
    .catch(err=>console.log('Error in Getting all users', err))
})


router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(200).send({ message: 'Deleted User' })
    })
    .catch(err => {
        console.log(`Error when deleting user: ${err}`)
        res.status(503).send( {message: 'Server-side error' })
    })
})

//Private
//GET /api/private
router.get('/private', passport.authenticate('jwt', {session: false}), (req, res)=> {
    return res.json({"message": "Thou hath been granted permission to access this route!"})
})


module.exports = router
