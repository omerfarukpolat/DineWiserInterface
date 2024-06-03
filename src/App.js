import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './App.css';
import Result from './Result';

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
    googleMapsApiKey: 'AIzaSyAJ_S6KsYvGHwh-RbmALeJsoA6Pf1eTCvo',
  });

  const [currentLocation, setCurrentLocation] = useState(center);
  const [cuisine, setCuisine] = useState('');
  const [maxBudget, setMaxBudget] = useState(500);
  const [maxTime, setMaxTime] = useState(10);
  const [resultsGenetic, setResultsGenetic] = useState(null);
  const [resultGreedy, setResultGreedy] = useState(null);
  const [cuisines, setCuisines] = useState([]);

  const handleMapClick = useCallback((event) => {
    setCurrentLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleSubmit = async (event) => {
    // control values are not empty
    if (!cuisine || !maxBudget || !maxTime) {
        alert('Please fill out all fields');
        return;
    }
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
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data:', data);
      setResultsGenetic(data.bestRestaurantGenetic.results)
      setResultGreedy(data.bestRestaurantGreedy.results)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/cuisines');
        const data = await response.json();
        data.sort();
        setCuisines(data);
      } catch (error) {
        console.error('Error fetching cuisines:', error);
      }
    };

    fetchCuisines();
  }, []);


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
        <div>
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
              <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                <option value="">Select Cuisine</option>
                {cuisines.length > 0 && cuisines.map((cuisine, index) => (
                    <option key={index} value={cuisine}>
                      {cuisine}
                    </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Max Budget:</label>
              <input
                  type="number"
                  value={maxBudget}
                  min={0}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Max Time (minutes):</label>
              <input
                  type="number"
                  value={maxTime}
                  min={0}
                  onChange={(e) => setMaxTime(parseInt(e.target.value))}
              />
            </div>
            <button type="submit" className="submit-button">
              Find Restaurant
            </button>
          </form>
          {resultsGenetic && (
              <div className="results">
                <h2>Genetic Algorithm</h2>
                <Result result={resultsGenetic} />
              </div>
          )}
            {resultGreedy && (
                <div className="results">
                    <h2>Greedy Algorithm</h2>
                    <Result result={resultGreedy} />
                </div>
            )}
        </div>
      </div>
  );
}

export default App;
