import { useEffect } from "react";
import tw from "tailwind-styled-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine"; // Import Leaflet Routing Machine

// Custom marker icons for pickup and dropoff
const pickupIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.freepik.com/256/12863/12863481.png?semt=ais_hybrid", // Replace with a custom pickup marker URL or use a locally stored image
  iconSize: [30, 40], // Size of the icon
  iconAnchor: [15, 40], // Point of the icon which will correspond to marker's location
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Replace with a custom dropoff marker URL
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

export const Map = (props) => {
  console.log(
    "Rendered map",
    props.pickupCoordinates,
    props.dropoffCoordinates
  );

  useEffect(() => {
    // Initialize the Leaflet map
    const map = L.map("map").setView([39.39172, -99.29011], 3);

    // Add Tile Layer (OpenStreetMap in this case)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker for pickup coordinates with custom icon
    if (props.pickupCoordinates) {
      addToMap(map, flipCoordinates(props.pickupCoordinates), pickupIcon);
    }

    // Add marker for dropoff coordinates with custom icon
    if (props.dropoffCoordinates) {
      addToMap(map, flipCoordinates(props.dropoffCoordinates), dropoffIcon);
    }

    // If both pickup and dropoff coordinates exist, plot the route
    if (props.pickupCoordinates && props.dropoffCoordinates) {
      L.Routing.control({
        waypoints: [
          L.latLng(flipCoordinates(props.pickupCoordinates)),
          L.latLng(flipCoordinates(props.dropoffCoordinates)),
        ],
        lineOptions: {
          styles: [{ color: "blue", weight: 5, opacity: 0.7 }],
        },
        createMarker: (i, waypoint, n) => {
          const icon = i === 0 ? pickupIcon : dropoffIcon; // Use different icons for pickup and dropoff
          return L.marker(waypoint.latLng, { icon });
        },
        // Hide routing instructions panel
        routerOptions: { show: false },
        show: false,
      }).addTo(map);
    }
  }, [props.pickupCoordinates, props.dropoffCoordinates]);

  // Function to add a marker to the map
  const addToMap = (map, coordinates, icon) => {
    L.marker(coordinates, { icon }).addTo(map);
  };

  // Helper function to swap [longitude, latitude] to [latitude, longitude]
  const flipCoordinates = (coords) => [coords[1], coords[0]];

  return <Wrapper id="map"></Wrapper>;
};

export default Map;

const Wrapper = tw.div`
  flex-1 h-1/2
`;
