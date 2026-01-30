import jwt from 'jsonwebtoken';

export const generateToken = async (userId) => {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        console.error("CRITICAL ERROR: 'ACCESS_TOKEN_SECRET' .env file me nahi hai!");
        throw new Error("Server Misconfiguration: Secret Key Missing");
    }

    const token = await jwt.sign(
        { _id: userId }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '7d' } 
    );

    return token;
};