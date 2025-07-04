import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [monthlyDistance, setMonthlyDistance] = useState('');
  const [fossilFuelType, setFossilFuelType] = useState('diesel');
  const [result, setResult] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setYearlyData(null);

    const distanceNum = parseFloat(monthlyDistance);
    if (isNaN(distanceNum) || distanceNum < 0) {
      setError('Please enter a valid positive number for distance.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyDistance: distanceNum, fossilFuelType }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch calculation');
      }
      const data = await response.json();
      setResult(data);

      // Fetch yearly data
      const yearlyResponse = await fetch('http://localhost:5000/calculate-yearly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyDistance: distanceNum, fossilFuelType }),
      });
      if (!yearlyResponse.ok) {
        throw new Error('Failed to fetch yearly data');
      }
      const yearlyData = await yearlyResponse.json();
      setYearlyData(yearlyData.yearlyWorth);
    } catch (err) {
      setError('Error calculating carbon credits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = yearlyData
    ? {
        labels: yearlyData.map((item) => item.year),
        datasets: [
          {
            label: 'Lowest Carbon Credit Worth (USD)',
            data: yearlyData.map((item) => item.worthLow),
            borderColor: 'rgba(40, 167, 69, 0.8)',
            backgroundColor: 'rgba(40, 167, 69, 0.4)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Highest Carbon Credit Worth (USD)',
            data: yearlyData.map((item) => item.worthHigh),
            borderColor: 'rgba(21, 87, 36, 0.8)',
            backgroundColor: 'rgba(21, 87, 36, 0.4)',
            fill: true,
            tension: 0.3,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Year-wise Carbon Credit Worth (2022 - 2030)',
        color: '#155724',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Worth (USD)',
          color: '#155724',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Year',
          color: '#155724',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div className="app-container">
      <h1 className="title">Green Karma's EV Carbon Credit Calculator</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Monthly Distance Driven (km):
          <input
            type="number"
            value={monthlyDistance}
            onChange={(e) => setMonthlyDistance(e.target.value)}
            min="0"
            step="any"
            required
            className="input-field"
          />
        </label>
        <label>
          Fossil Fuel Type:
          <select
            value={fossilFuelType}
            onChange={(e) => setFossilFuelType(e.target.value)}
            className="select-field"
          >
            <option value="diesel">Diesel (0.200 kg CO₂e/km)</option>
            <option value="petrol">Petrol (0.165 kg CO₂e/km)</option>
          </select>
        </label>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {result && (
        <div className="result-container">
          <h2>Results</h2>
          <p>Annual Distance Driven: {result.annualDistance} km</p>
          <p>CO₂ Saved: {result.co2SavedKg} kg</p>
          <p>
            Estimated Carbon Credit Worth: ${result.worthUSDLow} - ${result.worthUSDHigh}
          </p>
        </div>
      )}
      {yearlyData && (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      <footer className="footer">
        <p>© 2024 Green Karma</p>
      </footer>
    </div>
  );
}

export default App;
