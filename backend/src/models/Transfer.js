const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Le montant est obligatoire'],
    min: [1, 'Le montant doit être positif']
  },
  currency: {
    type: String,
    required: true,
    default: 'EUR'
  },
  provider: {
    type: String,
    required: true,
    enum: ['Wave', 'Orange Money', 'WorldRemit', 'Western Union', 'Autre']
  },
  fees: {
    type: Number,
    required: true,
    min: 0
  },
  exchangeRate: {
    type: Number,
    required: true
  },
  amountReceived: {
    type: Number,  // Montant reçu en devise locale (XOF)
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  note: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Index pour améliorer les requêtes par utilisateur
transferSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transfer', transferSchema);
