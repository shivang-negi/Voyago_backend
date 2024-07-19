import { User } from "../models/User.model.js";
import bcrypt from 'bcrypt';

async function validateUser(mail,pw) {
    try {
        const user = await User.findOne({email: mail});
        if(user == null) {
            console.log('User doesn\'t exist.');
            return -1;
        }

        const isPasswordValid = await bcrypt.compare(pw,user['password']);
        if(isPasswordValid == false) {
            console.log('Password is invalid\n');
            return -1;
        }
        else {
            console.log('password is valid');
            return 1;
        }
    }
    catch(error) {
        console.log('Error validateing user: ' + error);
    }
}

export default validateUser;