import bcrypt from 'bcryptjs'; 
import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generatedToken.js'; 
import { Submission } from '../models/submission.model.js';

// --- CREATE USER ---
export const creatuser = async (req, res) => {
    try {
        const { fullName, mobileNumber, email, password, accessCode, role } = req.body;

        if (!fullName || !mobileNumber || !email || !password || !role) {
            return res.status(400).json({
                 message: "All fields are required",
                  error: true,
                   success: false
                 });
        }

        if (role === 'admin') {
            const existingAdmin = await User.findOne({ role: 'admin' });
            if (existingAdmin) {
                return res.status(403).json({ 
                    message: "Admin already exists.", 
                    error: true, 
                    success: false });
            }
        }

        if (role === "customer") {
            if (!accessCode) return res.status(400).json({
                 message: "Access Code required", 
                 error: true,
                  success: false 
                });
            if (accessCode !== "new2025")
                 return res.status(400).json({ 
                message: "Invalid Access Code",
                 error: true, 
                 success: false
                 });
        }

        const userExits = await User.findOne({ email });
        if (userExits) {
            return res.status(400).json({
                 message: "User already exists",
                  error: true, 
                  success: false
                 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName, mobileNumber, email,
            password: hashedPassword,
            accessCode, role
        });

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({ 
            message: error.message, 
            error: true, 
            success: false
         });
    }
}

// --- LOGIN USER ---
export const verifyUser = async (req, res) => {
    try {
        const { email, password, accessCode, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                 message: "All fields are required", 
                 success: false
                 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                 message: "User not found",
                  success: false 
                });
        }

        if (user.role === "customer") {
            if (accessCode !== "new2025") { 
                return res.status(400).json({
                     message: "Invalid Access Code",
                      success: false
                     });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                 message: "Invalid password", 
                 success: false
                 });
        }

        // Token Generation
        const token = await generateToken(user._id);

        const isProduction = process.env.NODE_ENV === "production";
        
        const cookieOption = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            path: "/"
        };

        return res
            .cookie("token", token, cookieOption)
            .status(200)
            .json({
                message: `Welcome back, ${user.fullName}`,
                success: true,
                token: token, 
                data: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            });

    } catch (err) {
        return res.status(500).json({
             message: err.message,
              success: false
             });
    }
}

export const getUser = async (req, res) => {
    try {
        const customers = await User.find({ role: "customer" }).select("-password");
        return res.status(200).json({
            message: "Data fetched",
            success: true,
            data: customers
        });
    } catch (err) {
        return res.status(500).json({
             message: err.message, 
             success: false
             });
    }
};

export const getAllUsersAnalytics = async (req, res) => {
    try {
        const userId = req.user?._id;

        if(!userId){
             return res.status(401).json({ 
                message: "Unauthorized Request", 
                success: false
             });
        }

        const users = await User.find({ role: 'customer' }).select('fullName email mobileNumber createdAt'); 

        const userAnalytics = await Promise.all(users.map(async (user) => {
            const submissions = await Submission.find({ user: user._id })
                .populate({
                    path: 'challenge',
                    select: 'title points room', 
                    populate: { path: 'room', select: 'title name' }
                });

            const earnedPoints = submissions
                .filter(s => s.isCorrect)
                .reduce((sum, sub) => sum + (sub.pointsEarned || 0), 0);

            return {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                totalPoints:  earnedPoints,
                attemptsCount: submissions.length,
                details: submissions.map(s => ({
                    challengeTitle: s.challenge?.title || "Unknown",
                    roomName: s.challenge?.room?.title || s.challenge?.room?.name || "Unassigned", 
                    submittedAnswer: s.submittedAnswer,
                    isCorrect: s.isCorrect,
                    pointsAwarded: s.pointsEarned,
                    timestamp: s.createdAt
                }))
            };
        }));

        res.status(200).json({ 
            success: true, 
            data: userAnalytics
         });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message });
    }
};


export const deductPoints = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { pointsToDeduct } = req.body; 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { totalPoints: -pointsToDeduct } }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Points deducted",
            remainingPoints: updatedUser.totalPoints
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};