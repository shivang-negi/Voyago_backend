import mongoose from "mongoose";
import 'dotenv/config';

const uri = process.env.MONGO_URI;

async function connectToDB() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to Database");
    } catch (error) {
        console.error("Error connecting to Database: " + error);
        throw new Error("Database connection failed");
    }
}

export default connectToDB;