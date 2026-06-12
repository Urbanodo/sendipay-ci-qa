# SendiPay 🌍

Plateforme de comparaison et de suivi des transferts d'argent pour la diaspora africaine.

## Structure du projet

```
sendipay/
├── backend/          ← API Node.js + Express + MongoDB
└── frontend/         ← Interface React + Vite + Tailwind
```

## Lancer le projet en local

### 1. Backend
```bash
cd backend
copy .env.example .env      # Windows
# Remplir les variables dans .env
npm install
npm run dev                  # http://localhost:5000
```

### 2. Frontend (autre terminal)
```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```
