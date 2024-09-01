import mongoose from "mongoose";

const like_schema = mongoose.Schema({
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    timestamp: {
        type: Date
    }
})

export const Like = mongoose.model('Like',like_schema);