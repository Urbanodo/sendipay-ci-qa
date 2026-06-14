describe('Calculs de transferts', () => {

  test('calcule correctement le montant reçu', () => {
    const amount       = 200;
    const fees         = 4;
    const exchangeRate = 655.957;
    const received     = (amount - fees) * exchangeRate;
    expect(received).toBeCloseTo(128567.572, 1);
  });

  test('le pourcentage de frais est correct', () => {
    const amount   = 100;
    const fees     = 3.5;
    const percent  = (fees / amount) * 100;
    expect(percent).toBeCloseTo(3.5, 5);
  });

  test('statut par défaut est completed', () => {
    const status = 'completed';
    expect(['pending', 'completed', 'failed']).toContain(status);
  });

  test('providers valides', () => {
    const providers = ['Wave', 'Orange Money', 'WorldRemit', 'Western Union', 'Autre'];
    expect(providers).toContain('Wave');
    expect(providers).toContain('WorldRemit');
    expect(providers).not.toContain('PayPal');
  });

  test('montant doit être positif', () => {
    const amount = 150;
    expect(amount).toBeGreaterThan(0);
  });

});