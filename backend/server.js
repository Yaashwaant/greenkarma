const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Static carbon credit price range per kg CO2e (placeholder)
const CARBON_CREDIT_PRICE_LOW = 0.03; // lowest price in USD per kg CO2e
const CARBON_CREDIT_PRICE_HIGH = 0.07; // highest price in USD per kg CO2e

// Emission factors in kg CO2e per km
const EMISSION_FACTORS = {
  diesel: 0.200,
  petrol: 0.165,
};

app.post('/calculate', (req, res) => {
  const { monthlyDistance, fossilFuelType } = req.body;

  if (
    typeof monthlyDistance !== 'number' ||
    monthlyDistance < 0 ||
    !EMISSION_FACTORS.hasOwnProperty(fossilFuelType)
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Calculate annual distance
  const annualDistance = monthlyDistance * 12;

  // Calculate CO2 saved using ER = Distance_ev × EF_fossil_per_km
  const ef = EMISSION_FACTORS[fossilFuelType];
  const co2SavedKg = annualDistance * ef;

  // Calculate worth of carbon credits range
  const worthUSDLow = co2SavedKg * CARBON_CREDIT_PRICE_LOW;
  const worthUSDHigh = co2SavedKg * CARBON_CREDIT_PRICE_HIGH;

  res.json({
    annualDistance,
    co2SavedKg: co2SavedKg.toFixed(2),
    worthUSDLow: worthUSDLow.toFixed(2),
    worthUSDHigh: worthUSDHigh.toFixed(2),
  });
});

// New endpoint to calculate yearly worth from 2022 to 2030
app.post('/calculate-yearly', (req, res) => {
  const { monthlyDistance, fossilFuelType } = req.body;

  if (
    typeof monthlyDistance !== 'number' ||
    monthlyDistance < 0 ||
    !EMISSION_FACTORS.hasOwnProperty(fossilFuelType)
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const ef = EMISSION_FACTORS[fossilFuelType];
  const annualDistance = monthlyDistance * 12;
  const co2SavedKg = annualDistance * ef;

  // Simulate carbon credit price increase from 2022 to 2030
  const startYear = 2022;
  const endYear = 2030;
  const years = [];
  const priceLowStart = CARBON_CREDIT_PRICE_LOW;
  const priceHighStart = CARBON_CREDIT_PRICE_HIGH;
  const priceLowEnd = priceLowStart * 2; // assume price doubles by 2030
  const priceHighEnd = priceHighStart * 2;

  for (let year = startYear; year <= endYear; year++) {
    const t = (year - startYear) / (endYear - startYear);
    const priceLow = priceLowStart + t * (priceLowEnd - priceLowStart);
    const priceHigh = priceHighStart + t * (priceHighEnd - priceHighStart);
    const worthLow = co2SavedKg * priceLow;
    const worthHigh = co2SavedKg * priceHigh;
    years.push({
      year,
      worthLow: worthLow.toFixed(2),
      worthHigh: worthHigh.toFixed(2),
    });
  }

  res.json({
    annualDistance,
    co2SavedKg: co2SavedKg.toFixed(2),
    yearlyWorth: years,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
