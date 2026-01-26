import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: {
     type: String, 
     required: true
     },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
    default: 'Beginner'
  },
  category: { 
    type: String, 
    default: 'OSINT Investigation'},
  pointsReward: { 
    type: Number, 
    default: 0
  },
  targetChallenges: { 
    type: Number,
    default: 0
  },
  challenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }]
}, { timestamps: true });

export const room = mongoose.model('Room', RoomSchema);