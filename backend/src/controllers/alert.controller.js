const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la récupération des alertes.' });
  }
};

const createAlert = async (req, res) => {
  const { currency, targetRate } = req.body;
  if (!currency || !targetRate) {
    return res.status(400).json({ error: 'currency et targetRate sont obligatoires.' });
  }
  try {
    const alert = await Alert.create({ userId: req.user._id, currency, targetRate });
    res.status(201).json({ alert });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la création de l\'alerte.' });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!alert) return res.status(404).json({ error: 'Alerte introuvable.' });
    res.json({ message: 'Alerte supprimée.' });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
};

module.exports = { getAlerts, createAlert, deleteAlert };
