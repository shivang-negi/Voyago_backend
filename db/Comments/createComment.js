import { Comment } from "../../models/Comment.model.js";
import { status } from "../../utils/status.js";

async function createComment(postId, userId, comment, commentRef = null) {

    try {
        const commentData = new Comment({
            postId: postId,
            userId: userId,
            comment: comment,
            commentRef: commentRef
        })
        await commentData.save();

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

export default createComment;