import axios from "axios";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_LINK
          }/api/customer/book/getAllBooking/`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        const data = response;

        setBookings(data.data.bookings);
        console.log(data.data.bookings);
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle viewing booking details
  const handleViewDetails = (bookingId) => {
    navigate(`/customer/booking/details/${bookingId}`); // Navigate to booking details page
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Wrapper>
      <Title>Your Bookings</Title>
      {bookings.length > 0 ? (
        <BookingList>
          {bookings.map((booking, index) => (
            <BookingItem key={index}>
              <Details>
                <Location>{`From: ${booking.pickupLocation} To: ${booking.dropOffLocation}`}</Location>
                <Price>{`Price: $${booking.estimatedPrice}`}</Price>
              </Details>
              <Status>{`Status: ${booking.status}`}</Status>
              {/* View Details Button */}
              <ViewButton onClick={() => handleViewDetails(booking._id)}>
                View Details
              </ViewButton>
            </BookingItem>
          ))}
        </BookingList>
      ) : (
        <p>No bookings found.</p>
      )}
    </Wrapper>
  );
}

export default AllBookings;

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
  bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600
`;
