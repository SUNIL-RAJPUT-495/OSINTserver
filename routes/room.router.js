import router from "express";
import { createRoom, deleteRoom, getAllRooms, getRoom, updateRoom} from "../controllers/room.controller.js";
import { authToken } from "../middleware/authToken.js";
import { isAdmin } from "../middleware/adminmiddleware.js";

const roomRouter = router.Router();

roomRouter.post("/CreateRoom",authToken,isAdmin, createRoom)
roomRouter.get("/GetAllRooms", getAllRooms)
roomRouter.get("/get-room/:id", getRoom);
roomRouter.put("/update-room/:id",authToken,isAdmin, updateRoom);
roomRouter.delete("/delete-room/:id",authToken,isAdmin, deleteRoom);

export default roomRouter;