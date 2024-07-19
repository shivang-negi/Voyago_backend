import app from './app.js';
import connectToDB from './db/connection.js';

connectToDB()
.then(
    ()=> {
        app.listen(5000,()=> {
            console.log('Connected to Server');
        })
    }
)
.catch(
    ()=> {
        console.log('Error connecting to server')
    }
)