import express from 'express';
import addUser from './db/adduser.js'; 
import validateUser from './db/validateuser.js';
import fetchUser from './db/fetchuser.js';
import verifyJWT from './middlewares/verify_jwt.js';
import rateLimit from 'express-rate-limit';

const app = express();
import cors from 'cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { login_status, signup_status, status } from './utils/status.js';
import addPost from './db/Posts/addPost.js';
import getPosts from './db/Posts/getPosts.js';
import likePost from './db/Likes/likePost.js';
import removeLike from './db/Likes/removeLike.js';
import fetchPost from './db/Posts/fetchPost.js';
import createComment from './db/Comments/createComment.js';
import getComments from './db/Comments/getComments.js';

import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import session from 'express-session';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(limiter)

app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
    }
}));

app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    
    try {
        if (!profile || !profile.emails || !profile.emails.length) 
          return done(new Error("No profile or email found"), null); // Error case
        
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };
        
        done(null, user);   // No errors, pass the user object to done
      } catch (err) {
        done(err, null);
      }
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});
  
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/loginFail', failureMessage: true }),
    async (req, res) => {

      const user = req.user;
      let user_id;

      const userExists = await fetchUser(user.email);
      if(userExists.result === status.SUCCESS) {
        if(userExists.data === null) {
            const userValue = await addUser(user.name,user.email,
                "temp_password",
                user.birthday
            )

            if(userValue.status === signup_status.FAILURE) res.send("Error checking database");
            user_id = userValue.user_data._id;
        }
        else user_id = userExists.data._id;
      }
      else res.send("Error checking database.");
      
      const token = jwt.sign({ name: user.name, email: user.email }, process.env.SECRET_KEY, {
        expiresIn: '7d',
      });

      console.log(user_id);
      
      res.cookie('jwt', token);
      res.cookie('email', user.email);
      res.cookie('name', user.name);
      res.cookie('id',user_id.toString());

      res.redirect('http://localhost:3000/oauthlogin')
    }
  );
  

app.use((req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    next();
});

app.get('/',async (req,res)=>{ 
    res.send('asdfs')
});

app.post('/login',async (req,res)=> {
    console.log('login request');
    const obj = req.body;
    const email = obj['email'];
    const password = obj['password'];

    const value = await validateUser(email,password);
    if(value.status == login_status.SUCCESS) { 
        const token = jwt.sign(obj,process.env.SECRET_KEY,{
            expiresIn: '7d'
        });
        res.send({message: value.status, token: token, user: value.user_data});
    }
    else res.send({message: value.status}); 
})

app.post('/signup',async (req,res)=> {
    console.log('signin request');
    const obj = req.body;
    const username = obj['username'];
    const email = obj['email'];
    const password = obj['password'];
    const date = obj['date']; 

    const [day, month, year] = date.split('/');
    const dateObject = new Date(year, month - 1, day);

    const value = await addUser(username,email,password,dateObject);
    console.log(value.status);
    if(value.status == signup_status.SUCCESS) {
        const token = jwt.sign(obj,process.env.SECRET_KEY,{
            expiresIn: '7d'
        });
        res.send({message: value.status, token: token, user: value.user_data});
    }
    else res.send({message: value});
})

app.post('/verify', verifyJWT ,async (req,res) => {
    const user = req.body.user;

    console.log(user);

    if (!user) {
        return res.status(401).json({ message: status.FAILURE, desc: 'Unauthorized: Missing user' });
    }
    
    try {
        const value = await fetchUser(user);
        console.log(value);
        if(value.result == status.FAILURE) 
            res.json({ message: status.FAILURE, desc: 'Error' });

        res.send({
            message: status.SUCCESS,
            email: value.data.email,
            username: value.data.username,
            id: value.data._id
        });  
    }
    catch(error) {
        return res.status(401).json({ message: status.FAILURE, desc: 'Unexpected Error' });
    }
})

app.post('/createPost', async (req,res)=>{

    const createdBy = req.body.createdBy;
    const createdOn = req.body.createdOn;
    const postContent = req.body.postContent;

    console.log(createdBy);
    console.log(createdOn);
    console.log(postContent);

    try {
        await addPost(createdBy,createdOn,postContent);
        res.json({
            status: status.SUCCESS
        });
    }
    catch(error) {
        res.json({
            status: status.FAILURE,
            message: error
        });
    }
});

app.post('/getPost', async (req,res)=>{
    const postId = req.body.postId;

    const data = await fetchPost(postId);
    res.send(data);
})

app.post('/findAll/:page?', async (req,res)=> {

    const page_no = req.params.page || 1;
    const userId = req.body.id;

    await getPosts(page_no,userId)
    .then((result)=>{
        res.send({  
            status: status.SUCCESS,
            message: result
        })
    })
    .catch(error=>{res.send({
        status: status.FAILURE,
        error: error
    })});
})

app.post('/likePost', async (req,res)=>{
    const userId = req.body.userId;
    const postId = req.body.postId;
    const msg = await likePost(userId, postId);

    console.log(msg);
    
    if(msg.status === status.SUCCESS) res.send("Success");
    else res.send("Failure");
})

app.post('/unlikePost', async (req,res)=>{
    const userId = req.body.userId;
    const postId = req.body.postId;
    const msg = await removeLike(userId, postId);
    
    console.log(msg);
    
    if(msg.status === status.SUCCESS) res.send("Success");
    else res.send("Failure");
})

app.post('/createComment', async (req,res)=>{
    const postId = req.body.postId;
    const userId = req.body.userId;
    const comment = req.body.comment;
    const commentRef = req.body.commentRef;

    const msg = await createComment(postId,userId,comment,commentRef);
    console.log(msg);
    if(msg.status === status.SUCCESS) res.send("Success");
    else res.send("Failure");
})

app.post('/getComments', async (req,res)=>{
    const postId = req.body.postId;

    const msg = await getComments(postId);
    if(msg.status === status.SUCCESS) res.send({
        status: status.SUCCESS,
        comments: msg.message
    });
    else res.send({
        status: status.FAILURE,
        error: msg.message
    });
})

export default app;