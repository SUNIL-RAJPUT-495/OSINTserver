import router from "express";
import { createRoom, deleteRoom, getAllRooms, getRoom, updateRoom} from "../controllers/room.controller.js";

const roomRouter = router.Router();

roomRouter.post("/CreateRoom", createRoom)
roomRouter.get("/GetAllRooms", getAllRooms)
roomRouter.get("/get-room/:id", getRoom);
roomRouter.put("/update-room/:id", updateRoom);
roomRouter.delete("/delete-room/:id", deleteRoom);

export default roomRouter;