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

router.get('/hello', (req, res) => {
    Post.find({})
    .then(posts => {
        res.send(posts)
    })
})

router.get('/hello/:id', (req, res) => {
    Post.find({_id: req.params.id})
    .then(posts => {
        console.log(posts)
        res.send(posts)
    })
})

router.put('/:id', (req, res) => {
    console.log(req.params.id)
    Post.findByIdAndUpdate(req.params.id, req.body, {upsert: true})
    .then(updatePost => {
        updatePost = req.body
        console.log(updatePost)
        res.status(200).send(updatePost)
    })
        .catch(err => {
            console.log(`error when creating comment: ${err}`)
            res.status(503).send({ message: 'Server Error'})
})
})

router.post('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(createdComment=> {
        createdComment.comments.push({
            content: req.body.content,
            author: req.body.author
        })
        console.log(createdComment)
        createdComment.save().then(() => {
           res.send('Success') 
        })
        
    })

    .catch(err => console.log('ERROR CREATING COMMENT', err))
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