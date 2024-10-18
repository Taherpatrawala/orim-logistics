import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.locatecontrol"; // Optional: for location button

// Function to track real-time location
function RealtimeLocation({ setPosition }) {
  const map = useMap();

  useEffect(() => {
    // Ask for location permission and get the user's current position
    map.locate({ setView: true, maxZoom: 16 });
    map.on("locationfound", (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      L.marker([lat, lng]).addTo(map).bindPopup("You are here!").openPopup();
    });

    map.on("locationerror", () => {
      console.error("Unable to retrieve location");
    });
  }, [map, setPosition]);

  return null;
}

function MapComponent() {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Map Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Real-time location marker */}
      <RealtimeLocation setPosition={setPosition} />

      {/* Default marker for position */}
      {position && (
        <Marker position={position}>
          <Popup>Your current location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapComponent;
