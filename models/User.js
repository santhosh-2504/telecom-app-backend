import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // exclude by default
  },
  role: {
    type: String,
    enum: ['admin', 'worker'],
    default: 'worker'
  },
  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry'
  }],
  pushToken: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
