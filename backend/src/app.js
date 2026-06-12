const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes       = require('./routes/auth.routes');
const transferRoutes   = require('./routes/transfer.routes');
const comparatorRoutes = require('./routes/comparator.routes');
const alertRoutes      = require('./routes/alert.routes');

const app = express();

// Middlewares globaux
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Rate limiting — 100 requêtes par 15 minutes par IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes.' }
}));

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/transfers',  transferRoutes);
app.use('/api/comparator', comparatorRoutes);
app.use('/api/alerts',     alertRoutes);

// Route de santé (utile pour Render)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', app: 'SendiPay', version: '1.0.0' });
});

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

module.exports = app;
