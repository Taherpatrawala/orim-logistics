import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Map from "./Map"; // Import the Map component

function BookingDetails() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const bearerToken = Cookies.get("driverToken");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_LINK
          }/api/driver/booking/details/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        if (response.status === 200) {
          setBookingDetails(response.data.booking);
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) return <p>Loading...</p>;

  if (!bookingDetails) return <p>No booking details available</p>;

  return (
    <Wrapper>
      <Title>Booking Details</Title>
      <DetailsWrapper>
        <p>Pickup Location: {bookingDetails.pickupLocation}</p>
        <p>Dropoff Location: {bookingDetails.dropOffLocation}</p>
        <p>Status: {bookingDetails.status}</p>
        <p>Estimated Price: ${bookingDetails.estimatedPrice}</p>
        <p>
          Coordinates (Pickup):{" "}
          {bookingDetails.pickupCoordinates.coordinates.join(", ")}
        </p>
        <p>
          Coordinates (Dropoff):{" "}
          {bookingDetails.dropOffCoordinates.coordinates.join(", ")}
        </p>
      </DetailsWrapper>

      {/* Map component for showing pickup and dropoff locations */}
      <MapWrapper>
        <Map
          pickupCoordinates={bookingDetails.pickupCoordinates.coordinates}
          dropoffCoordinates={bookingDetails.dropOffCoordinates.coordinates}
        />
      </MapWrapper>
    </Wrapper>
  );
}

export default BookingDetails;

const Wrapper = tw.div`
  flex flex-col items-center p-6
`;

const Title = tw.h1`
  text-xl font-semibold mb-4
`;

const DetailsWrapper = tw.div`
  bg-gray-100 p-4 rounded-lg shadow-md max-w-lg w-full mb-6
`;

const MapWrapper = tw.div`
  w-full h-96 max-w-lg
`;
