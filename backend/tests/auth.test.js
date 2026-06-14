const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret_sendipay';

describe('Authentification', () => {

  test('hache correctement un mot de passe', async () => {
    const password = 'monMotDePasse123';
    const hash = await bcrypt.hash(password, 12);
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  test('vérifie correctement un mot de passe', async () => {
    const password = 'monMotDePasse123';
    const hash = await bcrypt.hash(password, 12);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  test('rejette un mauvais mot de passe', async () => {
    const password = 'monMotDePasse123';
    const hash = await bcrypt.hash(password, 12);
    const isValid = await bcrypt.compare('mauvaisMotDePasse', hash);
    expect(isValid).toBe(false);
  });

  test('génère un token JWT valide', () => {
    const token = jwt.sign({ id: '123abc' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('123abc');
  });

  test('rejette un token JWT invalide', () => {
    expect(() => {
      jwt.verify('token_invalide', process.env.JWT_SECRET);
    }).toThrow();
  });

});