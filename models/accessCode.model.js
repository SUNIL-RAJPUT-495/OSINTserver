import mongoose from 'mongoose';

const accessCodeSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    code: { 
        type: String, 
        required: true, 
        unique: true
     },
    isUsed: {
         type: mongoose.Schema.Types.ObjectId,
         default: false 
        },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: '24h' } 
});

export const AccessCode = mongoose.model('AccessCode', accessCodeSchema);