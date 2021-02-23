const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createUserToken } = require('../middleware/auth')
const passport = require("passport")

router.post('/post', (req, res) => {
    Post.create({
        content: req.body.content,
        photo: req.body.photo,
        author: req.body.author
    })
    .then(createdPost=> createPostToken(req, createdPost))
    .then(token => res.status(201).json({token}))
    .catch(err => console.log('ERROR CREATING POST', err))
    })

router.put('/post/:id', (req, res) => {
   Post.findByIdAndUpdate(req.params.id, 
    {$push: {
        comments: req.body.content,
        author: req.body.author}
    }, req.body, {
         new: true
    })
   .then(createComment => {
        res.status(200).send(createComment)
   })
   .catch(err => {
       console.log(`error when creating comment: ${err}`)
       res.status(503).send({ message: 'Server Error'})
   })
})



router.delete('/post/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
    .then(() => {
        res.status(200).send({ message: 'Deleted Post' })
    })
    .catch(err => {
        console.log(`Error when deleting post: ${err}`)
        res.status(503).send( {message: 'Server-side error' })
    })
})





module.exports = router