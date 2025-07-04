import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("odometer", image);

    const res = await fetch("https://greenkarma-backend.onrender.com", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-50 text-green-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">🌱 GreenKarma</h1>
      <p className="text-lg mb-6">Upload your EV odometer photo to calculate your carbon savings</p>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Upload & Calculate
      </button>

      {loading && <p className="mt-4 text-gray-600">Processing image...</p>}

      {result && (
        <div className="mt-6 bg-white shadow-md p-4 rounded text-center">
          <h2 className="text-xl font-semibold text-green-700 mb-2">🌿 Result</h2>
          <p><strong>Distance:</strong> {result.km} km</p>
          <p><strong>CO₂ Saved:</strong> {result.carbonSavedKg.toFixed(2)} kg</p>
          <p><strong>Value:</strong> ₹{result.carbonCreditINR.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
