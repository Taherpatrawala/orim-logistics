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

  if (loading) return <LoadingText>Loading...</LoadingText>;

  return (
    <Wrapper>
      <Driver />
      <ContentWrapper>
        <Title>Accepted Bookings</Title>
        {acceptedBookings.length > 0 ? (
          <BookingList>
            {acceptedBookings.map((booking, index) => (
              <BookingItem key={index}>
                <Details>
                  <LocationGroup>
                    <LocationIcon className="w-5 h-5 mr-2" />
                    <div>
                      <FromTo>From:</FromTo> {booking.pickupLocation}
                    </div>
                  </LocationGroup>
                  <LocationGroup>
                    <LocationIcon className="w-5 h-5 mr-2" />
                    <div>
                      <FromTo>To:</FromTo> {booking.dropOffLocation}
                    </div>
                  </LocationGroup>
                  <PriceGroup>
                    <PriceIcon className="w-5 h-5 mr-2" />₹
                    {booking.estimatedPrice}
                  </PriceGroup>
                  <Status status={booking.status}>{booking.status}</Status>
                </Details>
                <ViewButton onClick={() => handleViewDetails(booking._id)}>
                  View Details
                </ViewButton>
              </BookingItem>
            ))}
          </BookingList>
        ) : (
          <NoBookingsText>No accepted bookings found.</NoBookingsText>
        )}
      </ContentWrapper>
    </Wrapper>
  );
}

export default DriverAcceptedBookings;

const Wrapper = tw.div`
  flex-1 overflow-y-auto bg-gray-50 min-h-screen
`;

const ContentWrapper = tw.div`
  max-w-4xl mx-auto px-4 py-8
`;

const Title = tw.h1`
  text-3xl font-bold mb-8 text-gray-800 text-center
`;

const BookingList = tw.div`
  space-y-6
`;

const BookingItem = tw.div`
  flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl
`;

const Details = tw.div`
  flex-1 space-y-3 w-full md:w-auto
`;

const LocationGroup = tw.div`
  flex items-center text-lg text-gray-700
`;

const FromTo = tw.span`
  font-semibold mr-2 text-gray-900
`;

const PriceGroup = tw.div`
  flex items-center text-xl font-bold text-green-600 mt-2
`;

const Status = tw.div`
  ${(props) => {
    switch (props.status.toLowerCase()) {
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }}
  px-3 py-1 rounded-full text-sm font-medium inline-block mt-2
`;

const ViewButton = tw.button`
  mt-4 md:mt-0 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
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
