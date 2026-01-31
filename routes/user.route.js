import { Router } from "express";
import { creatuser, getUser, getAllUsersAnalytics, verifyUser, deductPoints } from "../controllers/user.controller.js";
import { authToken } from "../middleware/authToken.js";
import { isAdmin } from "../middleware/adminmiddleware.js";

const userRouter = Router();
userRouter.post('/create-user', creatuser);
userRouter.post('/verify-user', verifyUser);
userRouter.get("/get-user",authToken,isAdmin,getUser)
userRouter.get("/get-user-analytics",authToken,isAdmin,getAllUsersAnalytics)
userRouter.post("/deduct-points", authToken, deductPoints)

export default userRouter;
