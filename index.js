import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; 
import userRouter from './routes/user.route.js';
import morgan from 'morgan'; 
import cors from 'cors';  
import roomRouter from './routes/room.router.js';
import challengRouter from './routes/challeng.router.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL 
        ? process.env.FRONTEND_URL.trim().replace(/\/$/, "") 
        : "https://osint-client.vercel.app", 
    credentials: true,             
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get('/', (req, res) => {
  res.send('Cyber API is running...');
});

app.use("/api/user", userRouter);
app.use("/api/room", roomRouter);
app.use("/api/challenge", challengRouter);

connectDB();

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;