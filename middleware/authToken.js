import jwt from 'jsonwebtoken';

export const authToken = async (req, res, next) => {
    try {
        // --- OLD CODE (Sirf Cookie) ---
        // const token = req.cookies?.token;

        // --- NEW CODE (Cookie + Header Support) ---
        // Pehle Cookie check karega, agar nahi mili to Header check karega
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "User not logged in", // Token nahi mila
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Token is invalid or expired",
                    error: true,
                    success: false
                });
            }

            // User ID set karo taaki agle function ko mile
            // Dhyan de: decoded ke andar field ka naam '_id' hai ya 'id', wo generateToken function pe depend karta hai
            req.user = { _id: decoded._id || decoded.id };
            
            next(); // Aage badho
        });

    } catch (err) {
        res.status(400).json({
            message: err.message,
            error: true,
            success: false
        });
    }
};