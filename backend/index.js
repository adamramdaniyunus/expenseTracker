import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './config/Database.js';
import router from './routes/web.js';
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(router);

db.on('error', (error) => {
    console.log(error);
})

db.once('open', () => {
    console.log('Database Connected');
});


app.listen(process.env.PORT, () => {
    console.log("Server Running..");
});