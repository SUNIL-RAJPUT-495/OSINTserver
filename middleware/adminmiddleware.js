import { User } from "../models/user.model.js";
export const isAdmin = async (req, res, next) => {
    try {
        const userid = req.userId;
        const user = await User.findById(userid);
        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                error: true,
                success: false
            });
        }

    next();
    }catch (err) {
        res.status(400).json({
            message: err.message,
            error: true,
            success: false
        });
    }
};