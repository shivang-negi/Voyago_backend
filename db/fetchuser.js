import { User } from "../models/User.model.js";
import { status } from "../utils/status.js";

export default async function fetchUser(username) {
    try {
        const user = await User.findOne({email: username});
        console.log(user);
        return {
            result: status.SUCCESS,
            data: user
        }
    }
    catch(error) {
        return {
            result: status.FAILURE
        };
    }
}