import mongoose from 'mongoose';

const user_schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }, 
    DOB: {
        type: Date
    }
});

export const User = mongoose.model('User',user_schema);