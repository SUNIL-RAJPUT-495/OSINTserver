import bcrypt from 'bcryptjs'; 
import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generatedToken.js';

// ---------------------- CREATE USER ----------------------
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
                    message: "Security Alert: Admin already exists. Multiple admins not allowed.",
                    error: true,
                    success: false
                });
            }
        }

        if (role === "customer" && !accessCode) {
            return res.status(400).json({
                message: "Access Code is required for customer role",
                error: true,
                success: false
            });
        }
        if (role === "customer") {
            const hiddenCode = "new2025";
            if (accessCode !== hiddenCode) { 
                return res.status(400).json({
                    message: "Access Code is not valid",
                    error: true,
                    success: false
                });
            }
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
            fullName,
            mobileNumber,
            email,
            password: hashedPassword,
            accessCode,
            role: role
        });

        return res.status(201).json({
            message: "User created successfully",
            error: false,
            success: true,
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Register Error:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

// ---------------------- VERIFY USER (LOGIN) ----------------------
export const verifyUser = async (req, res) => {
    try {
        const { email, password, accessCode, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.role === "customer") {
            const hiddenCode = "new2025";
            if (accessCode !== hiddenCode) { 
                return res.status(400).json({
                    message: "Access Code is not valid",
                    error: true,
                    success: false
                });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                error: true,
                success: false
            });
        }

        const token = await generateToken(user._id);
        user.refreshToken = token;
        await user.save();

        const cookieOption = {
            httpOnly: true,
            secure: true, 
            sameSite: 'None',
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
                token: token,
                data: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            });

    } catch (err) {
        console.log("Login Error:", err);
        return res.status(500).json({
            message: "Internal server error",
            error: true,
            success: false
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const customers = await User.find({ role: "customer" }).select("-password");

        return res.status(200).json({
            message: "Customer data fetched successfully",
            error: false,
            success: true,
            data: customers
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: true,
            success: false
        });
    }
};