import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from '../backend/config/db.js';
import userRouter from './routes/user.route.js';
import morgan from 'morgan'; 
import cors from 'cors';  
import roomRouter from './routes/room.router.js';
import challengRouter from './routes/challeng.router.js';
const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,             
    methods: ["GET", "POST", "PUT", "DELETE"], 
}));
dotenv.config();


const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello, World! dfd');
});

app.use("/api/user",userRouter)
app.use("/api/room",roomRouter);
app.use("/api/challenge",challengRouter);


connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});