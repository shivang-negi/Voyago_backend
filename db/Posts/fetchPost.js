import { Post } from "../../models/Post.model.js";
import { User } from "../../models/User.model.js";
import { status } from "../../utils/status.js";

export default async function fetchPost(postId) {
    try {
        const post = await Post.findById(postId).populate('createdBy');
        return {
            status: status.SUCCESS,
            message: post
        }
    }
    catch(error) {
        return {
            status: status.FAILURE,
            message: error
        }
    }
}