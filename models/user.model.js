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
        default: 'customer',
        validate: {
        validator: async function(value) {
            if (value === 'admin') {
                const adminCount = await mongoose.models.User.countDocuments({ role: 'admin' });
                return adminCount === 0 || this.role !== 'admin'; 
            }
            return true;
        },
        message: 'System Error: Only one Admin is allowed in the database.'
    }
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