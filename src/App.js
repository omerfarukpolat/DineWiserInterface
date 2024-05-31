import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './App.css';

const containerStyle = {
  width: '100%',
  height: '400px',
  marginBottom: '20px',
};

const center = {
  lat: 39.888470,
  lng: 32.827494,
};

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'API_KEY', // Replace with your actual API key
  });

  const [currentLocation, setCurrentLocation] = useState(center);
  const [cuisine, setCuisine] = useState('Steak');
  const [maxBudget, setMaxBudget] = useState(500);
  const [maxTime, setMaxTime] = useState(10);
  const [topN, setTopN] = useState(5);  // Number of top results to return
  const [results, setResults] = useState(null);

  const handleMapClick = useCallback((event) => {
    setCurrentLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/find-restaurant', { // Ensure this matches your backend port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLat: currentLocation.lat,
          currentLon: currentLocation.lng,
          cuisine,
          maxBudget,
          maxTime,
          topN,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data.topRestaurants);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const mapOptions = {
    draggableCursor: 'pointer',
  };

  return (
      <div className="App">
        <header>
          <h1>CMP:682 Artificial Intelligence Project</h1>
          <p>Group Members:</p>
          <p>1. Omer Faruk Polat: N23232076</p>
          <p>2. Fatih Arslan Tugay: N23232076</p>
        </header>
        <body>
        {isLoaded && (
            <div className="map-container">
              <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={currentLocation}
                  zoom={10}
                  onClick={handleMapClick}
                  options={mapOptions}
              >
                <Marker position={currentLocation} />
              </GoogleMap>
              <p>Click on the map to select your location.</p>
            </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cuisine:</label>
            <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Max Budget:</label>
            <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Max Time (minutes):</label>
            <input
                type="number"
                value={maxTime}
                onChange={(e) => setMaxTime(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Number of Results:</label>
            <input
                type="number"
                value={topN}
                onChange={(e) => setTopN(parseInt(e.target.value))}
            />
          </div>
          <button type="submit" className="submit-button">Find Restaurant</button>
        </form>
        {results && (
            <div className="results">
              <h2>Top {topN} Restaurants</h2>
              {results.map((restaurant, index) => (
                  <div key={index} className="result">
                    <p><strong>Name:</strong> {restaurant.name}</p>
                    <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                    <p><strong>Cost:</strong> {restaurant.cost}</p>
                    <p><strong>Reviews:</strong> {restaurant.reviews}</p>
                    <p><strong>Score:</strong> {restaurant.score}</p>
                    <p><strong>Latitude:</strong> {restaurant.lat}</p>
                    <p><strong>Longitude:</strong> {restaurant.lon}</p>
                    <p><strong>Time:</strong> {restaurant.time} minutes</p>
                  </div>
              ))}
            </div>
        )}
        </body>
      </div>
  );
}

export default App;
