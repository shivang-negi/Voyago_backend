import mongoose from "mongoose";
import 'dotenv/config';

const uri = process.env.MONGO_URI;

async function connectToDB() {
    mongoose.connect(uri)
    .then(
        ()=>{
            console.log("Connected to Database")
        }
    )
    .catch(
        (error)=>{
            console.log("Error connecting to Database: " + error)
        }
    )
}

export default connectToDB;