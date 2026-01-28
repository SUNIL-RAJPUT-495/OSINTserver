import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; 
import userRouter from './routes/user.route.js';
import morgan from 'morgan'; 
import cors from 'cors';  
import roomRouter from './routes/room.router.js';
import challengRouter from './routes/challeng.router.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
const allowedOrigins = [
    "https://osint-client.vercel.app",
    "http://localhost:5173", 
    process.env.FRONTEND_URL?.replace(/\/$/, "")
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
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