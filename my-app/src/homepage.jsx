import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Homepage = () => {
  const mapRef = useRef(null);
  const mapContainer = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);
  const [startPoint, setStartPoint] = useState([37.7749, -122.4194]); // Default start point
  const [endPoint, setEndPoint] = useState(null);
  const [routeData, setRouteData] = useState(null);
  // const [routeDistance, setRouteDistance] = useState(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [error, setError] = useState(null);

  const isValidLatLng = (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  useEffect(() => {
    setIsQueryEnabled(
      startPoint && 
      endPoint && 
      isValidLatLng(startPoint[0], startPoint[1]) && 
      isValidLatLng(endPoint[0], endPoint[1])
    );
  }, [startPoint, endPoint]);

  const handleQueryClick = async () => {
    if (!isQueryEnabled) return;
    
    setIsQuerying(true);
    setError(null);
    
    try {
      const requestData = {
        start_lat: startPoint[0],
        start_lng: startPoint[1],
        end_lat: endPoint[0],
        end_lng: endPoint[1]
      };
      
      const response = await fetch('http://127.0.0.1:8000/api/route-info/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRouteData(data);
      console.log('Fetched routeData:', data);
    } catch (error) {
      console.error('Error fetching route data:', error);
      setError('Failed to fetch route data');
      setRouteData(null);
    } finally {
      setIsQuerying(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      const map = L.map(mapContainer.current).setView([37.7749, -122.4194], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

      map.on('click', function (e) {
        if (!startPoint || (startPoint && endPoint)) {
          setStartPoint([e.latlng.lat, e.latlng.lng]);
          setEndPoint(null);
        } else if (startPoint && !endPoint) {
          setEndPoint([e.latlng.lat, e.latlng.lng]);
        }
      });
    }

    // Update markers and route
    if (mapRef.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
      markersRef.current = [];

      // Add start marker
      if (startPoint) {
        const startMarker = L.marker(startPoint)
          .addTo(mapRef.current)
          .bindPopup("<b>Starting point</b>")
          .openPopup();
        markersRef.current.push(startMarker);
      }

      // Add end marker
      if (endPoint) {
        const endMarker = L.marker(endPoint)
          .addTo(mapRef.current)
          .bindPopup("<b>Destination</b>")
          .openPopup();
        markersRef.current.push(endMarker);
      }

      // Remove existing route
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      // Add new route if both points exist
      if (startPoint && endPoint) {
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(startPoint[0], startPoint[1]),
            L.latLng(endPoint[0], endPoint[1])
          ],
          routeWhileDragging: true,
          show: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          alternatives: true,
          lineOptions: {
            styles: [{ color: '#3388ff', opacity: 0.7, weight: 5 }]
          }
        }).addTo(mapRef.current);
      }
    }

    return () => {
      if (mapRef.current) {
        if (routingControlRef.current) {
          mapRef.current.removeControl(routingControlRef.current);
        }
        markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [startPoint, endPoint]);

  const formatRouteData = (value) => {
    if (value === null || value === undefined) return "Not Available";
    const num = Number(value);
    return isNaN(num) ? "Invalid Data" : num.toFixed(2);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Safe Route</h1>
      <div
        id="map"
        ref={mapContainer}
        style={{ width: "100%", height: "500px" }}
      ></div>

      {/* Control Panel */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        backgroundColor: "white",
        padding: "10px",
        zIndex: 1000,
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        maxWidth: "300px"
      }}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Starting point:
            <input
              type="text"
              value={startPoint ? startPoint.join(", ") : "Not set"}
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(",").map(Number);
                if (isValidLatLng(lat, lng)) {
                  setStartPoint([lat, lng]);
                } else {
                  setError("Invalid latitude or longitude for starting point!");
                }
              }}
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "5px"
              }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Destination:
            <input
              type="text"
              value={endPoint ? endPoint.join(", ") : "Not set"}
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(",").map(Number);
                if (isValidLatLng(lat, lng)) {
                  setEndPoint([lat, lng]);
                } else {
                  setError("Invalid latitude or longitude for destination!");
                }
              }}
              style={{
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "5px"
              }}
            />
          </label>
        </div>

        {/* Query Button */}
        <button 
          onClick={handleQueryClick}
          disabled={!isQueryEnabled || isQuerying}
          style={{
            padding: "8px 16px",
            backgroundColor: isQueryEnabled ? "#4CAF50" : "#cccccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isQueryEnabled ? "pointer" : "not-allowed",
            width: "100%",
            boxSizing: "border-box",
            marginBottom: "10px",
            fontWeight: "bold"
          }}
        >
          {isQuerying ? "Querying..." : "Get Route Info"}
        </button>

        {/* Error Message */}
        {error && (
          <div style={{ 
            color: "red", 
            marginBottom: "10px",
            fontSize: "0.9em"
          }}>
            {error}
          </div>
        )}

        {/* Route Information */}
        {isQuerying ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            Loading route data...
          </div>
        ) : routeData ? (
          <div style={{ marginTop: "10px", color: "black" }}>
            <h3 style={{ marginBottom: "10px", borderBottom: "1px solid #eee" }}>Route Information</h3>
            <p><strong>Light Intensity:</strong> {formatRouteData(routeData.light_intensity)}</p>
            <p><strong>Crowdedness:</strong> {formatRouteData(routeData.crowdedness)}</p>
            <p><strong>Cleanliness:</strong> {formatRouteData(routeData.cleanliness)}</p>
          </div>
        ) : (
          <div style={{ color: "#666", fontStyle: "italic" }}>
            {isQueryEnabled ? "Click 'Get Route Info' to fetch data" : "Set both points to enable query"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
