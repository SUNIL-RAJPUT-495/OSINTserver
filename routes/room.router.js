import router from "express";
import { createRoom, getAllRooms} from "../controllers/room.controller.js";

const roomRouter = router.Router();

roomRouter.post("/CreateRoom", createRoom)
roomRouter.get("/GetAllRooms", getAllRooms)

export default roomRouter;