import { User } from "../models/User.model.js";
import bcrypt from 'bcrypt';
import {signup_status} from "../utils/status.js";


async function addUser(name,mail,pw,dob) {

    try {
        const user = await User.findOne({email: mail});
        if(user) {
            console.log('User already exists');
            return signup_status.USER_ALREADY_EXISTS;
        }

        const hashedPassword = await bcrypt.hash(pw, 10);
        const newUser = new User({
            username: name,
            email: mail,
            password: hashedPassword,
            DOB: dob
        });
        const val = await newUser.save();
        console.log(val);
        return {status: signup_status.SUCCESS, user_data: val};
    }
    catch(error) {
        console.log('Error creating user: ' + error);
        return signup_status.FAILURE;
    }
}

export default addUser;