const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR'
  },
  targetRate: {
    type: Number,
    required: [true, 'Le taux cible est obligatoire'],
    min: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  triggeredAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
