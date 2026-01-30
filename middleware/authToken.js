import jwt from 'jsonwebtoken';

export const authToken = async (req, res, next) => {
    try {
        // 1. Token dhoondo (Cookie se YA Header se)
        // Mobile ke liye Header, Web ke liye Cookie
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        // Debug log
        // console.log("Middleware Token Check:", token ? "Found" : "Missing");

        if (!token) {
            return res.status(401).json({
                message: "Authentication Failed: Please Login",
                error: true,
                success: false
            });
        }

        // 2. Token Verify karo (SAME Secret Key se)
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        // 3. User ID set karo
        req.user = { _id: decode._id || decode.id };
        
        next();

    } catch (err) {
        // console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({
            message: "Session Expired or Invalid Token",
            error: true,
            success: false
        });
    }
};