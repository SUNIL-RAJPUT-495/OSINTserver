import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { 
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    accessCode: {
        type: String,
        required: false, 
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'moderator'],
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    refreshToken: {
        type: String,
        default: "" 
    }
}, {timestamps:true});

export const User = mongoose.model('User', userSchema);