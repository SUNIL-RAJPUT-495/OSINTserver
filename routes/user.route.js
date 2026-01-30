import { Router } from "express";
import { creatuser, getUser, getAllUsersAnalytics, verifyUser } from "../controllers/user.controller.js";
import { authToken } from "../middleware/authToken.js";

const userRouter = Router();
userRouter.post('/create-user', creatuser);
userRouter.post('/verify-user', verifyUser);
userRouter.get("/get-user",authToken,getUser)
userRouter.get("/get-user-analytics",authToken,getAllUsersAnalytics)

export default userRouter;
