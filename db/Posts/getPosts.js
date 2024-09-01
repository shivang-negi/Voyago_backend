import {Post} from "../../models/Post.model.js";
import {Like} from "../../models/Likes.model.js";
import {status} from "../../utils/status.js";
import fetchPost from "./fetchPost.js";

async function getPosts(page_no,userId) {
    try {
        let totalPosts = await Post.countDocuments();
        let latestPosts = await Post.find()
            .sort({ createdOn: -1 }) 
            .skip((page_no-1)*5)
            .limit(5); 

        const likedPosts = [];

        let posts = await Promise.all(latestPosts.map(async (x)=> {
            let post = await fetchPost(x._id);
            let liked = await Like.findOne({
                likedBy: userId,
                postId: post.message._id
            });
            if(liked) likedPosts.push({favorite:1, id: post.message._id});
            else likedPosts.push({favorite:0, id: post.message._id});
            if(post.status == status.FAILURE) throw "Error retrieving data from database";
            return post.message;
        }));

        return {
            status: status.SUCCESS,
            postCount: totalPosts,
            posts: posts,
            favorite: likedPosts
        }
    } 
    catch (err) {
        return {
            status: status.FAILURE,
            message: err
        }
    }
}

export default getPosts;