import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

const socket = io(import.meta.env.VITE_SERVER_LINK);

const Driver = () => {
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    async function getDriverData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_LINK}/api/driver/booking/getBookingId`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("driverToken")}`,
            },
          }
        );

        if (response.status === 200) {
          setBookingId(response.data.booking._id);
        } else {
          console.error("Error fetching booking ID:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching booking ID:", error);
      }
    }

    getDriverData();
  }, []);

  useEffect(() => {
    // socket = io(`${import.meta.env.VITE_SERVER_LINK}`);
    socket.on("connect", () => {
      console.log("Connected to the server :)");
    });
  }, []);

  useEffect(() => {
    if (bookingId) {
      console.log(`Connecting to room with bookingId: ${bookingId}`);
      // Connect the driver to the server and join the booking room
      socket.emit("driverJoinRoom", { bookingId });

      // Send driver's live location to the server every few seconds
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Emit location to server via Socket.IO
          socket.emit("driverLocationUpdate", { bookingId, location });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Cleanup on component unmount
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [bookingId]);

  return <div>Driver connected and sharing live location...</div>;
};

export default Driver;
