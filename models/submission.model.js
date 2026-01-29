import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge', 
        required: true
    },
    submittedAnswer: {
        type: String,
        required: true,
        trim: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    pointsEarned: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

export const Submission = mongoose.model('Submission', submissionSchema);