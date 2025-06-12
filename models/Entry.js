import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['MNP', 'New Sim', 'Replacement'],
    required: true
  },
  fromProvider: String, // Only for MNP
  toProvider: String,   // Only for MNP
  simProvider: String,  // Only for New Sim
  rechargeAmount: Number, // Only for New Sim
  price: {
    type: String, // "Free" or a number as string
    required: true
  },
  number: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  notified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('Entry', entrySchema);