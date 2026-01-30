import router from "express";
import { createRoom, deleteRoom, getAllRooms, getRoom, updateRoom} from "../controllers/room.controller.js";
import { authToken } from "../middleware/authToken.js";

const roomRouter = router.Router();

roomRouter.post("/CreateRoom",authToken, createRoom)
roomRouter.get("/GetAllRooms",authToken, getAllRooms)
roomRouter.get("/get-room/:id",authToken, getRoom);
roomRouter.put("/update-room/:id",authToken, updateRoom);
roomRouter.delete("/delete-room/:id",authToken, deleteRoom);

export default roomRouter;