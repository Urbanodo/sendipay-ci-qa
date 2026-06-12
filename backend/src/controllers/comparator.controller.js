const axios = require('axios');

// Frais réels approximatifs par opérateur (source : remittanceprices.worldbank.org)
const PROVIDERS = [
  { name: 'Wave',          feePercent: 1.0, fixedFee: 0,    minAmount: 1,   maxAmount: 1000 },
  { name: 'Orange Money',  feePercent: 2.5, fixedFee: 2,    minAmount: 5,   maxAmount: 2000 },
  { name: 'WorldRemit',    feePercent: 2.0, fixedFee: 3.99, minAmount: 1,   maxAmount: 5000 },
  { name: 'Western Union', feePercent: 3.5, fixedFee: 5,    minAmount: 1,   maxAmount: 10000 }
];

const getComparison = async (req, res) => {
  const { amount = 100, from = 'EUR', to = 'XOF' } = req.query;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Montant invalide.' });
  }

  try {
    // Récupérer le taux de change actuel
    let exchangeRate = 655.957; // Taux fixe EUR/XOF comme fallback
    try {
      const rateRes = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}`,
        { timeout: 5000 }
      );
      exchangeRate = rateRes.data.conversion_rate;
    } catch {
      console.warn('API taux de change indisponible, utilisation du taux fixe EUR/XOF');
    }

    const results = PROVIDERS
      .filter(p => numAmount >= p.minAmount && numAmount <= p.maxAmount)
      .map(p => {
        const fees = parseFloat((numAmount * p.feePercent / 100 + p.fixedFee).toFixed(2));
        const amountAfterFees = numAmount - fees;
        const amountReceived  = parseFloat((amountAfterFees * exchangeRate).toFixed(0));
        const feesPercent     = parseFloat(((fees / numAmount) * 100).toFixed(2));
        return { name: p.name, fees, feesPercent, amountReceived, exchangeRate };
      })
      .sort((a, b) => b.amountReceived - a.amountReceived); // Du meilleur au moins bon

    res.json({
      amount: numAmount,
      from,
      to,
      exchangeRate,
      providers: results,
      bestProvider: results[0],
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la comparaison.' });
  }
};

module.exports = { getComparison };
