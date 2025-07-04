const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('odometer'), async (req, res) => {
  const imagePath = req.file.path;
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    const match = text.match(/\d{3,6}/);
    const km = match ? parseInt(match[0]) : 0;

    const carbonSavedKg = km * 0.21;
    const carbonCreditINR = (carbonSavedKg / 1000) * 2200;

    fs.unlinkSync(imagePath); // Clean up

    res.json({ km, carbonSavedKg, carbonCreditINR });
  } catch (error) {
    res.status(500).json({ error: 'OCR failed', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
