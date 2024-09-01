import app from './app.js';
import connectToDB from './db/connection.js';

(async () => {
    try {
        await connectToDB();
        app.listen(5000, () => {
            console.log('Connected to Server');
        });
    } catch (error) {
        console.error('Error starting server: ' + error);
    }
})();
