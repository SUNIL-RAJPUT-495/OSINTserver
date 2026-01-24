import { Challenge } from '../models/challange.model.js';
export const creatChallange = async(req, res) => {

    try {
        const { title, description, points, flag, roomId } = req.body;

        if(!title || !description || !points || !flag || !roomId) {
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
            flag,
            roomId
        });
        await newChallenge.save();
        res.status(201).json({
            message: 'Challenge created successfully',
            error: false,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
}


export const getChallengesByRoom = async(req, res) => {
    try {
        const { roomId } = req.params;
        const challenges = await Challenge.find({ room: roomId }).select('-flag'); // Flag ko exclude kar rahe hain
        res.status(200).json({
            message: 'Challenges fetched successfully',
            success: true,
            error: false,
            data: challenges
        });
    }  catch(error){
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
            success: false
        });}}