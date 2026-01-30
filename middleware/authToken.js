import jwt from 'jsonwebtoken';

export const authToken = async (req, res, next) => {
    try {

        const token = req.cookies.accessToken || request?.headers?.authorization?.split(" ")[1]


        if (!token) {
            return res.status(401).json({
                message: "User not logged in",
                error: true,
                success: false
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        if (!decode) {
            return response.status(401).json({
                message: "unauthorized access",
                error: true,
                success: false
            })
        }


        req.userId = decode.id
        next();
    

} catch (err) {
    res.status(400).json({
        message: err.message,
        error: true,
        success: false
    });
}
};