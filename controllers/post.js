const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { createPostToken } = require('../middleware/auth')
const passport = require("passport")
router.get('/author/:id',(req,res)=>{
    Post.find({author:req.params.id})
    .then(postIDs=> {
        console.log(postIDs)
        res.send('Success')
    })
})
router.post('/new/:id', (req, res) => {
    Post.create({
        content: req.body.content,
        photo: req.body.photo,
        author: req.body.author
    })
    .then(createdPost=> {
        console.log(createdPost)
        User.findById(req.params.id).then((user) => {
            user.posts.push(createdPost)
                user.save().then(() => {
                    res.send('Success') 
            })
        })
    })
    .catch(err => console.log('ERROR CREATING POST', err))
    })

// likes
router.post('/like/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(likePost=> {
        likePost.likes.push(
            req.body.author
        )
        console.log(likePost)
        likePost.save().then(() => {
           res.send('Success liking') 
        })
    })
    .catch(err => console.log('ERROR LIKING POST', err))
})

router.put('/unlike/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id)
    .then(unlikePost=> {
        unlikePost.likes.pull(
            req.body.author
        )
        console.log(unlikePost)
        unlikePost.save().then(() => {
           res.send('Success unliking') 
        })
    })
    .catch(err => console.log('ERROR LIKING POST', err))
})

// router.post('/like/:id', (req, res) => {
//     let id = req.body.id;
//     let query = {_id: id};
//     let post = Post.findOne(query);
//     Post.findOneAndUpdate(query, {$inc : {'post.likes' : 1}}).exec(post);
// })

router.get('/hello', (req, res) => {
    Post.find({}).populate('author')
    .then(posts => {
        res.send(posts)
    })
})
router.get('/hello/:id', (req, res) => {
    Post.find({_id: req.params.id}).populate('author')
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
            content: req.body.contentComment,
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
router.delete('/delete/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(deleteComment=> {
            deleteComment.comments.pop({
                content: req.body.content,
                author: req.body.author
            })
            console.log(deleteComment)
            deleteComment.save().then(() => {
               res.send('DELETE COMMENT SUCCESS') 
            })
        })
        .catch(err => console.log('ERROR DELETING COMMENT', err))
        })
module.exports = router