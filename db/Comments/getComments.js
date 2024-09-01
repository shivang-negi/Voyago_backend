import { Comment } from "../../models/Comment.model.js";
import { status } from "../../utils/status.js";
import mongoose from "mongoose";

async function getComments(postId) {
    try {
        const comments = await Comment.find({postId}).populate('userId');
        return {
            status: status.SUCCESS,
            message: comments
        }
    } catch (error) {
        console.log(error);
        return {
            status: status.FAILURE,
            message: error
        }
    }
}

export default getComments;