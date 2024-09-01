import mongoose from "mongoose";

const post_schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postContent: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    }
})

export const Post = mongoose.model('Post',post_schema);