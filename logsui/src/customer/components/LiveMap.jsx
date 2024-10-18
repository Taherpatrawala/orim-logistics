import { useEffect, useState, useRef } from "react";
import tw from "tailwind-styled-components";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine"; // Import Leaflet Routing Machine
import { io } from "socket.io-client"; // Import Socket.IO client

// Custom marker icons for pickup, dropoff, and driver
const pickupIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.freepik.com/256/12863/12863481.png?semt=ais_hybrid",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2206/2206368.png", // Add a driver marker icon
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

export const LiveMap = (props) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef(null); // Ref to store the map instance
  const driverMarkerRef = useRef(null); // Ref to store the driver's marker
  const socket = useRef(null); // Use ref to store socket instance

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([39.39172, -99.29011], 3);
      mapRef.current = map; // Save the map instance in the ref

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">Atlan Logistics</a> contributors',
      }).addTo(map);

      // Add pickup and dropoff markers with validation
      if (props.pickupCoordinates?.lat && props.pickupCoordinates?.lng) {
        addToMap(
          map,
          [props.pickupCoordinates.lat, props.pickupCoordinates.lng],
          pickupIcon
        );
      }

      if (props.dropoffCoordinates?.lat && props.dropoffCoordinates?.lng) {
        addToMap(
          map,
          [props.dropoffCoordinates.lat, props.dropoffCoordinates.lng],
          dropoffIcon
        );
      }

      if (props.pickupCoordinates?.lat && props.dropoffCoordinates?.lat) {
        L.Routing.control({
          waypoints: [
            L.latLng([
              props.pickupCoordinates.lat,
              props.pickupCoordinates.lng,
            ]),
            L.latLng([
              props.dropoffCoordinates.lat,
              props.dropoffCoordinates.lng,
            ]),
          ],
          lineOptions: { styles: [{ color: "blue", weight: 5, opacity: 0.7 }] },
          createMarker: (i, waypoint) => {
            const icon = i === 0 ? pickupIcon : dropoffIcon;
            return L.marker(waypoint.latLng, { icon });
          },
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
        }).addTo(map);
      }

      // Initialize the socket connection
      socket.current = io(import.meta.env.VITE_SERVER_LINK);

      // Join room for live driver updates
      socket.current.emit("customerJoinRoom", { bookingId: props.bookingId });
      socket.current.on("driverLocation", (location) => {
        // LiveMap the incoming data to lat and lng for consistency
        if (location?.latitude && location?.longitude) {
          setDriverLocation({
            lat: location.latitude,
            lng: location.longitude,
          });
        } else {
          console.error("Invalid driver location received:", location);
        }
      });
    }

    return () => {
      socket.current.disconnect(); // Clean up socket connection on unmount
    };
  }, [props.pickupCoordinates, props.dropoffCoordinates, props.bookingId]);

  // Effect to update the driver location on the map
  useEffect(() => {
    if (driverLocation?.lat && driverLocation?.lng) {
      const { lat, lng } = driverLocation;

      console.log("Driver location received:", lat, lng);

      // Update the driver's location on the map
      const map = mapRef.current;

      if (driverMarkerRef.current) {
        // Update the driver's marker position if it exists
        driverMarkerRef.current.setLatLng([lat, lng]);
      } else {
        // Create a new marker for the driver if it doesn't exist
        driverMarkerRef.current = L.marker([lat, lng], {
          icon: driverIcon,
        }).addTo(map);
      }

      // Focus the map on the driver's location
      map.setView([lat, lng], 15);
    } else {
      console.warn(
        "Driver location is invalid or not yet available:",
        driverLocation
      );
    }
  }, [driverLocation]);

  const addToMap = (map, coordinates, icon) => {
    if (
      coordinates &&
      coordinates.lng !== undefined &&
      coordinates.lat !== undefined
    ) {
      L.marker([coordinates.lat, coordinates.lng], { icon }).addTo(map);
    } else {
      console.error("Invalid coordinates for marker:", coordinates);
    }
  };

  return <Wrapper id="map"></Wrapper>;
};

export default LiveMap;

const Wrapper = tw.div`
  flex-1 h-1/2
`;
