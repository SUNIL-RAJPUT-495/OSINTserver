import {room} from "../models/room.model.js" 

export const createRoom = async (req, res) => {
  try {
    const { name, totalChallenges, totalPoints, difficulty,description } = req.body;

    if (!name || !totalChallenges || !totalPoints || !difficulty) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    const newRoom = new room({
      name,
      targetChallenges: totalChallenges, 
      pointsReward: totalPoints, 
      difficulty,description
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
    const rooms = await room.find()
      .populate('challenges') 
      .sort({ createdAt: -1 });
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