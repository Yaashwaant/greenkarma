# 🌱 GreenKarma – Carbon Credit Estimator

GreenKarma is a full-stack MERN platform that lets electric vehicle (EV) users upload their odometer photos and calculate how much CO₂ they’ve saved — and the potential ₹ value in carbon credits.

## 🚀 Features
- Upload odometer image → OCR extracts distance
- Calculates CO₂ saved using Venna-prescribed formula (0.21 kg/km)
- Shows ₹ value using live/stable carbon credit prices
- Simple React dashboard with Google login (optional)
- Fallback survey for users who can't upload images

## 🛠️ Tech Stack
- Frontend: React, TailwindCSS
- Backend: Node.js, Express, Tesseract.js (OCR)
- Firebase (Auth), Render (API Hosting), Vercel (Frontend)

## 📦 Setup Instructions

### Frontend (React)
```bash
cd client
npm install
npm start
```

### Backend (Express)
```bash
cd server
npm install
node index.js
```

Make sure to point the React `fetch()` calls to your deployed backend URL (Render or localhost).

## 📷 Sample Use Case
- User uploads photo showing 1234 km → system extracts it
- Saves: 1234 × 0.21 = 259.14 kg CO₂
- Credit earned: ₹568.11 (using ₹2200/ton CO₂)

---

## 🙌 Contribute
GreenKarma is open for collaboration! Want to integrate WhatsApp uploads, Aadhaar rewards, or real carbon marketplaces? Fork it!

---

Made with 💚 by GreenKarma Labs.
