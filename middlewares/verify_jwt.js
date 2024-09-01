import { status } from "../utils/status.js";
import jwt from 'jsonwebtoken';

const verifyJWT = async (req, res, next) => {
    const token = req.body.token;

    if (!token) {
        return res.status(401).json({ message: status.FAILURE, desc: 'Unauthorized: Missing token' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        console.log('token verified');
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return res.status(401).json({ message: status.FAILURE, desc: 'Unauthorized: Invalid token' });
    }
};

export default verifyJWT;