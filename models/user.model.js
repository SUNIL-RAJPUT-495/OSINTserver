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
                    const adminExists = await mongoose.models.User.findOne({ role: 'admin' });
                    
                    if (adminExists && adminExists._id.toString() !== this._id?.toString()) {
                        return false;
                    }
                }
                return true;
            },
            message: 'Security Alert: Only one Admin account is allowed in the system.'
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
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);