import jwt from 'jsonwebtoken';

export const authToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Authentication Failed: Please Login",
                error: true,
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            });
        }

        // User ID ko standard tarike se set karein
        req.user = { _id: decode.id || decode._id };
        
        next();

    } catch (err) {
        return res.status(400).json({
            message: "Invalid Token",
            error: true,
            success: false
        });
    }
};