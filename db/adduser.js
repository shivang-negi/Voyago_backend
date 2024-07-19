import { User } from "../models/User.model.js";
import bcrypt from 'bcrypt';

async function addUser(name,mail,pw,dob) {

    try {
        const user = await User.findOne({email: mail});
        if(user) {
            console.log('User already exists');
            return -1;
        }

        const hashedPassword = await bcrypt.hash(pw, 10);
        const newUser = new User({
            username: name,
            email: mail,
            password: hashedPassword,
            DOB: dob
        });
        await newUser.save();
        return 1;
    }
    catch(error) {
        console.log('Error creating user: ' + error);
        return 0;
    }
}

export default addUser;