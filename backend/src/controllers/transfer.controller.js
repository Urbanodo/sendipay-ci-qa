const Transfer = require('../models/Transfer');

const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const totalSent = transfers.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = transfers.reduce((sum, t) => sum + t.fees, 0);
    res.json({ transfers, stats: { totalSent, totalFees, count: transfers.length } });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la récupération des transferts.' });
  }
};

const createTransfer = async (req, res) => {
  const { amount, currency, provider, fees, exchangeRate, note } = req.body;
  try {
    const amountReceived = (amount - fees) * exchangeRate;
    const transfer = await Transfer.create({
      userId: req.user._id,
      amount, currency, provider, fees, exchangeRate, amountReceived, note
    });
    res.status(201).json({ transfer });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du transfert.' });
  }
};

const deleteTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!transfer) return res.status(404).json({ error: 'Transfert introuvable.' });
    res.json({ message: 'Transfert supprimé.' });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
};

module.exports = { getTransfers, createTransfer, deleteTransfer };
