import { Challenge } from '../models/challange.model.js';
import { room } from '../models/room.model.js';
import { Submission } from '../models/submission.model.js';

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



export const updateChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const updateData = req.body;    
        const updatedChallenge = await Challenge.findByIdAndUpdate(challengeId, updateData, { new: true });

        if (!updatedChallenge) {    
            return res.status(404).json({
                message: 'Challenge not found',
                error: true,
                success: false
            });
        }
        res.status(200).json({
            message: 'Challenge updated successfully',
            error: false,
            success: true,
            data: updatedChallenge
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }

}



export const deleteChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const deletedChallenge = await Challenge.findByIdAndDelete(challengeId);
        if (!deletedChallenge) {
            return res.status(404).json({
                message: 'Challenge not found',
                error: true,
                success: false
            });
        }
        res.status(200).json({
            message: 'Challenge deleted successfully',
            error: false,
            success: true
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
        const userId = req.user?._id; 

        const challenges = await Challenge.find({ room: roomId });

        const userSubmissions = await Submission.find({ 
            user: userId, 
            challenge: { $in: challenges.map(c => c._id) } ,
            isCorrect: true
        });

        const solvedIds = userSubmissions.map(s => s.challenge.toString());
        
        const submissionsMap = {};
        userSubmissions.forEach(s => {
            submissionsMap[s.challenge] = s.submittedAnswer;
        });

        res.status(200).json({
            message: 'Challenges fetched successfully',
            success: true,
            error: false,
            data: challenges,
            solvedIds: solvedIds,        
            userSubmissions: submissionsMap 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message,
            success: false
        });
    }
}

export const submitChallenge = async (req, res) => {
    try {
        const { challengeId, answer } = req.body;
        const userId = req.user?._id;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found" });

        const alreadySolved = await Submission.findOne({ user: userId, challenge: challengeId, isCorrect: true });
        
        if (alreadySolved) {
            return res.status(200).json({
                success: true,
                correct: true, 
                message: "Already solved!",
                alreadySolved: true
            });
        }

        const isCorrect = challenge.correctAnswer === answer;

        const newSubmission = await Submission.create({
            user: userId,
            challenge: challengeId,
            submittedAnswer: answer,
            isCorrect,
            pointsEarned: isCorrect ? challenge.points : 0
        });

        res.status(200).json({
            success: true,
            correct: isCorrect,
            message: isCorrect ? "Correct Flag!" : "Wrong Answer, try again"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};