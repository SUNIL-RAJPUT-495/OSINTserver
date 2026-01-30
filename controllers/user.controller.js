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
                    message: "Security Alert: Admin already exists.",
                    error: true,
                    success: false
                });
            }
        }

        if (role === "customer") {
            if (!accessCode) {
                return res.status(400).json({ message: "Access Code required", error: true, success: false });
            }
            const hiddenCode = "new2025";
            if (accessCode !== hiddenCode) { 
                return res.status(400).json({ message: "Invalid Access Code", error: true, success: false });
            }
        }

        const userExits = await User.findOne({ email });
        if (userExits) {
            return res.status(400).json({ message: "User already exists", error: true, success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName, mobileNumber, email,
            password: hashedPassword,
            accessCode, role
        });

        return res.status(201).json({
            message: "User created successfully",
            error: false,
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, error: true, success: false });
    }
}

// --- LOGIN USER (MOBILE & WEB COMPATIBLE) ---
export const verifyUser = async (req, res) => {
    try {
        const { email, password, accessCode, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required", error: true, success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", error: true, success: false });
        }

        if (user.role === "customer") {
            const hiddenCode = "new2025";
            if (accessCode !== hiddenCode) { 
                return res.status(400).json({ message: "Access Code invalid", error: true, success: false });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password", error: true, success: false });
        }

        const token = await generateToken(user._id);

        // --- COOKIE OPTION FIX (Localhost vs Production) ---
        const isProduction = process.env.NODE_ENV === "production";
        
        const cookieOption = {
            httpOnly: true,
            secure: isProduction, // Localhost par false, Live par true
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/"
        };

        return res
            .cookie("token", token, cookieOption)
            .status(200)
            .json({
                message: `Welcome back, ${user.fullName}`,
                error: false,
                success: true,
                token: token, // <-- Mobile ke liye token body me bhej rahe hain
                data: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            });

    } catch (err) {
        return res.status(500).json({ message: err.message, error: true, success: false });
    }
}

// --- GET USERS ---
export const getUser = async (req, res) => {
    try {
        // Middleware ne user check kar liya hai, seedha DB query karo
        const customers = await User.find({ role: "customer" }).select("-password");

        return res.status(200).json({
            message: "Data fetched",
            error: false,
            success: true,
            data: customers
        });

    } catch (err) {
        return res.status(500).json({ message: err.message, error: true, success: false });
    }
};

// --- GET ANALYTICS ---
export const getAllUsersAnalytics = async (req, res) => {
    try {
        // Verify ki Admin hai ya authenticated user hai
        if(!req.user || !req.user._id){
             return res.status(401).json({ message: "Unauthorized", success: false });
        }

        const users = await User.find({ role: 'customer' })
                                .select('fullName email mobileNumber createdAt'); 

        const userAnalytics = await Promise.all(users.map(async (user) => {
            const submissions = await Submission.find({ user: user._id })
                .populate({
                    path: 'challenge',
                    select: 'title points room', 
                    populate: {
                        path: 'room', 
                        select: 'title name' 
                    }
                });

            const earnedPoints = submissions
                .filter(s => s.isCorrect)
                .reduce((sum, sub) => sum + (sub.pointsEarned || 0), 0);

            return {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobileNumber: user.mobileNumber,
                totalPoints: 100 + earnedPoints,
                attemptsCount: submissions.length,
                details: submissions.map(s => ({
                    challengeTitle: s.challenge?.title || "Unknown Challenge",
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
        res.status(500).json({ success: false, message: error.message });
    }
};