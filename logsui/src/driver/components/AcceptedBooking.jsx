import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Driver from "./Driver";

function DriverAcceptedBookings() {
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const bearerToken = Cookies.get("driverToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcceptedBookings = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_LINK
          }/api/driver/booking/getAcceptedBookings`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setAcceptedBookings(response.data.bookings);
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedBookings();
  }, []);

  const handleViewDetails = (bookingId) => {
    // Navigate to the booking details page for this specific booking
    navigate(`/driver/booking/accepted/details/${bookingId}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Wrapper>
      <Driver />
      <Title>Accepted Bookings</Title>
      {acceptedBookings.length > 0 ? (
        <BookingList>
          {acceptedBookings.map((booking, index) => (
            <BookingItem key={index}>
              <Details>
                <Location>{`From: ${booking.pickupLocation} To: ${booking.dropOffLocation}`}</Location>
                <Price>{`Price: $${booking.estimatedPrice}`}</Price>
                <Status>{`Status: ${booking.status}`}</Status>
              </Details>
              <ViewButton onClick={() => handleViewDetails(booking._id)}>
                View Details
              </ViewButton>
            </BookingItem>
          ))}
        </BookingList>
      ) : (
        <p>No accepted bookings found.</p>
      )}
    </Wrapper>
  );
}

export default DriverAcceptedBookings;

const Wrapper = tw.div`
  flex-1 overflow-y-scroll flex flex-col items-center p-6
`;

const Title = tw.h1`
  text-xl font-semibold mb-4
`;

const BookingList = tw.div`
  w-full max-w-3xl
`;

const BookingItem = tw.div`
  flex justify-between items-center p-4 mb-4 bg-gray-100 rounded-lg shadow-md
`;

const Details = tw.div`
  flex-1
`;

const Location = tw.p`
  text-lg font-medium
`;

const Price = tw.p`
  text-sm text-gray-500
`;

const Status = tw.div`
  text-sm font-bold text-indigo-600
`;

const ViewButton = tw.button`
  bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600
`;
