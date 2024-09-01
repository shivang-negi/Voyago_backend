import {Like} from "../../models/Likes.model.js";
import {status} from "../../utils/status.js";

async function likePost(userId,postId) {
    try {
        const newLike = new Like({
            likedBy: userId,
            postId: postId,
            timestamp: new Date()
        });
        
        await newLike.save();

        return {
            status: status.SUCCESS
        }
    }
    catch(error) {
        return {
            status: status.FAILURE,
            message: error
        }
    }
}

export default likePost;