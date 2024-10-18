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

  if (loading) return <LoadingText>Loading...</LoadingText>;

  return (
    <Wrapper>
      <Title>Your Bookings</Title>
      {bookings.length > 0 ? (
        <BookingList>
          {bookings.map((booking, index) => (
            <BookingItem key={index}>
              <Details>
                <Location>
                  <LocationIcon className="w-5 h-5 mr-2" />
                  <div>
                    <FromTo>From:</FromTo> {booking.pickupLocation}
                  </div>
                </Location>
                <Location>
                  <LocationIcon className="w-5 h-5 mr-2" />
                  <div>
                    <FromTo>To:</FromTo> {booking.dropOffLocation}
                  </div>
                </Location>
                <Price>
                  <PriceIcon className="w-5 h-5 mr-2" />₹
                  {booking.estimatedPrice}
                </Price>
              </Details>
              <StatusSection>
                <Status status={booking.status}>{booking.status}</Status>
                <ViewButton onClick={() => handleViewDetails(booking._id)}>
                  View Details
                </ViewButton>
              </StatusSection>
            </BookingItem>
          ))}
        </BookingList>
      ) : (
        <NoBookingsText>No bookings found.</NoBookingsText>
      )}
    </Wrapper>
  );
}

export default AllBookings;

const Wrapper = tw.div`
  flex-1 overflow-y-auto flex flex-col items-center p-6 bg-gray-50
`;

const Title = tw.h1`
  text-3xl font-bold mb-8 text-gray-800
`;

const BookingList = tw.div`
  w-full max-w-4xl space-y-6
`;

const BookingItem = tw.div`
  flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl
`;

const Details = tw.div`
  flex-1 space-y-3
`;

const Location = tw.div`
  flex items-center text-lg text-gray-700
`;

const FromTo = tw.span`
  font-semibold mr-2 text-gray-900
`;

const Price = tw.div`
  flex items-center text-xl font-bold text-green-600
`;

const StatusSection = tw.div`
  flex flex-col items-end space-y-3 mt-4 md:mt-0
`;
const Status = tw.span`
  px-2 py-1 rounded-full text-sm font-medium
  ${(props) => {
    switch (props.status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-blue-100 text-blue-800";
      case "Pending Pickup":
        return "bg-orange-100 text-orange-800"; // New status
      case "En Route to Pickup":
        return "bg-indigo-100 text-indigo-800"; // New status
      case "Arrived at Pickup":
        return "bg-teal-100 text-teal-800"; // New status
      case "Goods Collected":
        return "bg-green-100 text-green-800"; // New status
      case "En Route to Dropoff":
        return "bg-lightblue-100 text-lightblue-800"; // New status
      case "At Dropoff Location":
        return "bg-cyan-100 text-cyan-800"; // New status
      case "Delivery in Progress":
        return "bg-purple-100 text-purple-800"; // New status
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Delayed":
        return "bg-red-100 text-red-800"; // New status
      case "Cancelled":
        return "bg-gray-300 text-gray-800"; // New status
      case "Returned to Sender":
        return "bg-orange-200 text-orange-800"; // New status
      case "Rescheduled":
        return "bg-yellow-200 text-yellow-800"; // New status
      default:
        return "bg-gray-100 text-gray-800";
    }
  }}
`;

const ViewButton = tw.button`
  bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
`;

const LoadingText = tw.p`
  text-2xl text-gray-600 font-medium text-center py-12
`;

const NoBookingsText = tw.p`
  text-xl text-gray-600 font-medium text-center py-8
`;

const LocationIcon = tw.svg`
  fill-current text-gray-500
`;

LocationIcon.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  children: (
    <path d="M10 0C5.588 0 2 3.588 2 8c0 6 8 12 8 12s8-6 8-12c0-4.412-3.588-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" />
  ),
};

const PriceIcon = tw.svg`
  fill-current text-green-600
`;

PriceIcon.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  children: (
    <path d="M10 20a10 10 0 110-20 10 10 0 010 20zm1-5h1a3 3 0 000-6H7v-2h5V4H7v2h1a3 3 0 110 6h4v2H7v2h4z" />
  ),
};
