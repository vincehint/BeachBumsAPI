const mongoose = require('../db/connection')

const options = { 
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: (_doc, userDocToReturn) => {
            delete userDocToReturn.password
            return userDocToReturn
        }
    },
}

const commentSchema = new mongoose.Schema({
    content: String,
    author: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    created: {
        type: Date,
        default: Date.now
    }
})

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    likes: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    author: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    comments: [commentSchema]
}, options)

module.exports = mongoose.model('Post', postSchema)