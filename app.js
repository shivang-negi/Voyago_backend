import express from 'express';
import addUser from './db/adduser.js'; 
import validateUser from './db/validateuser.js';

const app = express();
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/',async (req,res)=>{ 
    res.send('asdfs')
});

app.post('/',async (req,res)=> {
    console.log('login request');
    const obj = req.body;
    const email = obj['email'];
    const password = obj['password'];

    const value = await validateUser(email,password);
    if(value == 1) {
        const token = jwt.sign(obj,process.env.SECRET_KEY,{
            expiresIn: '7d'
        });
        res.send({message: value, token: token});
    }
    else res.send({message: value});
})

app.post('/signup',async (req,res)=> {
    const obj = req.body;
    const username = obj['username'];
    const email = obj['email'];
    const password = obj['password'];
    const date = obj['date'];

    const [day, month, year] = date.split('/');
    const dateObject = new Date(year, month - 1, day);

    const value = await addUser(username,email,password,dateObject);
    if(value == 1) {
        const token = jwt.sign(obj,process.env.SECRET_KEY,{
            expiresIn: '7d'
        });
        res.send({message: value, token: token});
    }
    else res.send({message: value});
})

app.post('/verify', async (req,res) => {
    const obj = req.body;
    const token = obj['token'];

    if(!token) res.send({message: 0});
    else {
        jwt.verify(token, process.env.SECRET_KEY, (err,decoded) => {
            if(err) {
                res.send({message: 0})
            }
	    console.log('token verified');
            res.send({message: 1});
        })
    }
})

export default app;