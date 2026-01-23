import { Router } from "express";
import { creatuser, verifyUser } from "../controllers/user.controller.js";

const userRouter = Router();
userRouter.post('/create-user', creatuser);
userRouter.post('/verify-user', verifyUser);

export default userRouter;
