import React, { useState } from 'react';

export default function App() {
  const [mode, setMode] = useState("upload"); // "upload" or "manual"
  const [image, setImage] = useState(null);
  const [prevReading, setPrevReading] = useState("");
  const [currReading, setCurrReading] = useState("");
  const [result, setResult] = useState(null);

  const backendURL = "https://greenkarma-backend.onrender.com"; // Change if needed

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${backendURL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const distance = currReading - prevReading;

    // Venna formula (1 km = 0.105 kg CO2 saved for EV)
    const co2 = (distance * 0.105).toFixed(2);
    const creditValue = (co2 * 4.5).toFixed(2); // ₹4.5 per kg CO2

    setResult({ distance, co2, creditValue });
  };

  return (
    <div className="min-h-screen bg-green-50 text-gray-900 p-6 font-sans">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10">
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">GreenKarma</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Upload your odometer photo or enter readings manually to see how much CO₂ you've saved 🌱
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode("upload")}
            className={`px-4 py-2 rounded-l ${mode === "upload" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-r ${mode === "manual" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Enter Manually
          </button>
        </div>

        {mode === "upload" && (
          <div>
