import jwt from 'jsonwebtoken';

export const authToken = async (req, res, next) => {
    try {
        // --- FIX 1: OPTIONAL CHAINING (?.) ---
        // 'req.cookies?.accessToken' likhein taaki agar cookies na ho to crash na kare
        // Aur 'Authorization' header check karein
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        // Debugging ke liye (Console me dekhein token mila ya nahi)
        console.log("Middleware Token Check:", token ? "Found" : "Missing");

        if (!token) {
            return res.status(401).json({
                message: "User not logged in (Token Missing)",
                error: true,
                success: false
            });
        }

        // --- FIX 2: SECRET KEY MATCH ---
        // Ensure karein ki ye wahi key hai jo Login me use hui thi (ACCESS_TOKEN_SECRET)
        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = { _id: decode.id || decode._id };
        next();

    } catch (err) {
        console.error("Middleware Error:", err.message);
        // 400 ki jagah 403 (Forbidden) ya 500 (Server Error) sahi rehta hai debugging ke liye
        return res.status(401).json({
            message: "Invalid or Expired Token",
            error: true,
            success: false
        });
    }
};