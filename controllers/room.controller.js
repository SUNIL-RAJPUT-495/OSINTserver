import { room } from "../models/room.model.js"; 

// --- 1. Create Room ---
export const createRoom = async (req, res) => {
  try {
    const { name, totalChallenges, totalPoints, difficulty, description } = req.body;

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

// --- 2. Get All Rooms (Dashboard List ke liye) ---
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await room.find()

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

// --- 3. Get Single Room (Room Detail Page ke liye) ---
// *YE FUNCTION MISSING THA, ISSE ADD KAREIN*
export const getRoom = async (req, res) => {
    try {
        const { id } = req.params;

        // IMPORTANT: .populate('challenges') yahan zaroori hai
        // Taaki jab kisi room par click karein to challenges ka data bhi aaye
        const singleRoom = await room.findById(id).populate('challenges'); 

        if (!singleRoom) {
            return res.status(404).json({
                message: "Room not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Room details fetched",
            data: singleRoom, // Frontend 'room' state mein ye data set karega
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server Error",
            success: false
        });
    }
};