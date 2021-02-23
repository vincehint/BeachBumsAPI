const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const bcrypt = require('bcrypt')
const { createPostToken } = require('../middleware/auth')
const passport = require("passport")

router.post('/new', (req, res) => {
    Post.create({
        content: req.body.content,
        photo: req.body.photo,
        author: req.body.author
    })
    .then(createdPost=> {
        console.log(createdPost)
        res.send('Success')
    })

    .catch(err => console.log('ERROR CREATING POST', err))
    })

router.put('/:id', (req, res) => {
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



router.delete('/:id', (req, res) => {
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