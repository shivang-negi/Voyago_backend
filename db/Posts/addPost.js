import {Post} from "../../models/Post.model.js";
import {status} from "../../utils/status.js";
import { v4 as uuidv4 } from 'uuid';

async function addPost(createdBy,createdOn,postContent) {
    try {
        const newPost = new Post({
            id: uuidv4(),
            createdBy: createdBy,
            createdOn: createdOn,
            postContent: postContent
        });
        newPost.save()
        .then(()=>{
            return status.SUCCESS;
        })
        .catch((error)=>{
            return status.FAILURE;
        });
    }
    catch(error) {
        return {
            status: status.FAILURE,
            message: error
        }
    }
};

export default addPost;