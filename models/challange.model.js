import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    required: false, 
    default: ""
  },
  flag:{
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
}, { timestamps: true });

export const Challenge = mongoose.model('Challenge', ChallengeSchema);