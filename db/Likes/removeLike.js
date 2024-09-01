import {Like} from "../../models/Likes.model.js";
import {status} from "../../utils/status.js";

async function removeLike(userId, postId) {
    try {
        await Like.deleteOne({
            likedBy: userId,
            postId: postId
        });

        return {
            status: status.SUCCESS
        };
    }
    catch(error) {
        return {
            status: status.FAILURE,
            message: error
        }
    }
}

export default removeLike;