import jwt from 'jsonwebtoken';

export const authToken = async (req, res, next) => {
    try {
        
        const token = req.cookies?.token;

        
        if (!token) {
            return res.status(401).json({
                message: "User not logged in",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Token is invalid or expired",
                    error: true,
                    success: false
                });
            }

            
            req.userId = decoded.id;
            next(); 
        });

    } catch (err) {
        res.status(400).json({
            message: err.message,
            error: true,
            success: false
        });
    }
};