import { User } from "../models/User.model.js";
import bcrypt from 'bcrypt';
import { login_status } from "../utils/status.js";

async function validateUser(mail,pw) {
    try {
        const user = await User.findOne({email: mail});
        if(user == null) {
            console.log('User doesn\'t exist.');
            return {status: login_status.USER_DOESNT_EXISTS};
        }

        const isPasswordValid = await bcrypt.compare(pw,user['password']);
        if(isPasswordValid == false) {
            console.log('Password is invalid\n');
            return {status: login_status.INVALID_PASSWORD};
        }
        else {
            console.log('password is valid');
            return {status: login_status.SUCCESS, user_data: user};
        }
    }
    catch(error) {
        console.log('Error validateing user: ' + error);
        return {status:login_status.FAILURE};
    }
}

export default validateUser;