import { Router } from "express";
import { 
    creatChallange, 
    deleteChallenge, 
    getChallengesByRoom, 
    submitChallenge, 
    updateChallenge 
} from "../controllers/challange.controller.js";
import { authToken } from "../middleware/authToken.js"; 

const challengRouter = Router();

challengRouter.post("/CreateChallenge", authToken, creatChallange);
challengRouter.get("/getchallenges/:id", authToken,getChallengesByRoom);
challengRouter.post("/submitchallenge", authToken, submitChallenge);

challengRouter.put("/updatechallenge/:challengeId", authToken, updateChallenge);
challengRouter.delete("/deletechallenge/:challengeId", authToken, deleteChallenge);

export default challengRouter;