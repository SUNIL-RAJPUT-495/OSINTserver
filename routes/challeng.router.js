import { Router } from "express";
import { creatChallange, getChallengesByRoom } from "../controllers/challange.controller.js";

const challengRouter = Router();

challengRouter.post("/CreateChallenge", creatChallange);
challengRouter.get("/getchallenges",getChallengesByRoom)
export default challengRouter;