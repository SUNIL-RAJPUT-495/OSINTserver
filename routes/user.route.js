import { Router } from "express";
import { creatuser, getUser, getAllUsersAnalytics, verifyUser } from "../controllers/user.controller.js";

const userRouter = Router();
userRouter.post('/create-user', creatuser);
userRouter.post('/verify-user', verifyUser);
userRouter.get("/get-user",getUser)
userRouter.get("/get-user-analytics",getAllUsersAnalytics)

export default userRouter;
