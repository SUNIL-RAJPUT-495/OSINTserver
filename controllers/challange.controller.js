import { Challenge } from '../models/challange.model.js';
import { room } from '../models/room.model.js'; 

export const creatChallange = async (req, res) => {
    try {
        const { title, description, points, roomId } = req.body;

        if (!title || !description || !points || !roomId) {
            return res.status(400).json({
                message: 'All fields are required',
                error: true,
                success: false
            });
        }

        const newChallenge = new Challenge({
            title,
            description,
            points,
            room: roomId
        });

        const savedChallenge = await newChallenge.save();

        await room.findByIdAndUpdate(roomId, {
            $push: { challenges: savedChallenge._id }
        });

        res.status(201).json({
            message: 'Challenge created successfully',
            error: false,
            success: true,
            data: savedChallenge
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
}

export const getChallengesByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        
        const challenges = await Challenge.find({ room: roomId }); 
        
        res.status(200).json({
            message: 'Challenges fetched successfully',
            success: true,
            error: false,
            data: challenges
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
            success: false
        });
    }
}