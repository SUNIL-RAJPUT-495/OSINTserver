import { room } from "../models/room.model.js"; 


export const createRoom = async (req, res) => {
  try {
    const { name, totalChallenges, totalPoints, difficulty, description } = req.body;

    if (!name || !description || !difficulty) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const newRoom = new room({
      name,
      targetChallenges: totalChallenges, 
      pointsReward: totalPoints, 
      difficulty,
      description
    });

    await newRoom.save();

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: newRoom
    });

  } catch (error) {
    console.error("Backend Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Room name already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};





export const getAllRooms = async (req, res) => {
  try {
    const rooms = await room.find().populate('challenges') 
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: rooms.length,
      message: "All rooms fetched successfully",
      data: rooms
    });

  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};




export const getRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const singleRoom = await room.findById(id).populate('challenges'); 

        if (!singleRoom) {
            return res.status(404).json({
                message: "Room not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Room details fetched",
            data: singleRoom,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server Error",
            success: false
        });
    }
};


export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await room.findByIdAndDelete(id);

        if (!deletedRoom) {
            return res.status(404).json({
                message: "Room not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Room deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server Error",
            success: false
        });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, totalChallenges, totalPoints, difficulty, description } = req.body;
        const updatedRoom = await room.findByIdAndUpdate(
            id,
            {
                name,
                targetChallenges: totalChallenges,
                pointsReward: totalPoints,
                difficulty,
                description
            },
            { new: true }
        );  
        if (!updatedRoom) {
            return res.status(404).json({
                message: "Room not found",
                success: false
            });
        } 
        return res.status(200).json({
            message: "Room updated successfully",
            data: updatedRoom,
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || "Server Error",
            success: false
        });
    }
};