import router from "express";
import { createRoom, getAllRooms, getRoom} from "../controllers/room.controller.js";

const roomRouter = router.Router();

roomRouter.post("/CreateRoom", createRoom)
roomRouter.get("/GetAllRooms", getAllRooms)
roomRouter.get("/get-room/:id", getRoom);

export default roomRouter;