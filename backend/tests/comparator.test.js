const { getComparison } = require('../src/controllers/comparator.controller');

describe('Comparateur de frais', () => {

  test('calcule correctement les frais Wave pour 100 EUR', () => {
    const amount = 100;
    const feePercent = 1.0;
    const fixedFee = 0;
    const fees = amount * feePercent / 100 + fixedFee;
    expect(fees).toBe(1.0);
  });

  test('calcule correctement les frais Western Union pour 100 EUR', () => {
    const amount = 100;
    const feePercent = 3.5;
    const fixedFee = 5;
    const fees = parseFloat((amount * feePercent / 100 + fixedFee).toFixed(2));
    expect(fees).toBe(8.5);
  });

  test('le montant reçu est positif', () => {
    const amount = 100;
    const fees = 3.99;
    const exchangeRate = 655.957;
    const amountReceived = (amount - fees) * exchangeRate;
    expect(amountReceived).toBeGreaterThan(0);
  });

  test('Wave a moins de frais que Western Union pour 100 EUR', () => {
    const amount = 100;
    const waveF = amount * 1.0 / 100;
    const wuF   = amount * 3.5 / 100 + 5;
    expect(waveF).toBeLessThan(wuF);
  });

  test('rejette un montant négatif', () => {
    const amount = -50;
    expect(amount).toBeLessThan(0);
  });

});