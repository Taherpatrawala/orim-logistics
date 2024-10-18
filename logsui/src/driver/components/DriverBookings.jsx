import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import Cookies from "js-cookie";
import axios from "axios";

function DriverBookings() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const bearerToken = Cookies.get("driverToken");

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_LINK
          }/api/driver/booking/getPendingBookings`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const data = response;

        if (data.status === 200 || data.status === 201) {
          setPendingBookings(data.data.bookings);
        } else {
          alert(`Error: ${data.data.message}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/api/driver/booking/acceptBooking`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      const data = response;
      if (data) {
        alert("Booking accepted successfully!");
        // Update UI after acceptance
        setPendingBookings(
          pendingBookings.filter((booking) => booking._id !== bookingId)
        );
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleViewBookingDetails = async (bookingId) => {
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

      const data = response;
      if (response.status === 200) {
        setSelectedBooking(data.data.booking);
      } else {
        alert(`Error: ${data.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <LoadingText>Loading...</LoadingText>;

  return (
    <Wrapper>
      <Title>Pending Bookings</Title>
      {pendingBookings.length > 0 ? (
        <BookingList>
          {pendingBookings.map((booking, index) => (
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
                <Status>{booking.status}</Status>
                <Actions>
                  <AcceptButton
                    onClick={() => handleAcceptBooking(booking._id)}
                  >
                    Accept Booking
                  </AcceptButton>
                  <ViewButton
                    onClick={() => handleViewBookingDetails(booking._id)}
                  >
                    View Details
                  </ViewButton>
                </Actions>
              </StatusSection>
            </BookingItem>
          ))}
        </BookingList>
      ) : (
        <NoBookingsText>No pending bookings found.</NoBookingsText>
      )}

      {selectedBooking && (
        <BookingDetailsModal>
          <ModalContent>
            <ModalTitle>Booking Details</ModalTitle>
            <ModalDetail>
              <ModalLabel>Pickup Location:</ModalLabel>
              {selectedBooking.pickupLocation}
            </ModalDetail>
            <ModalDetail>
              <ModalLabel>Dropoff Location:</ModalLabel>
              {selectedBooking.dropOffLocation}
            </ModalDetail>
            <ModalDetail>
              <ModalLabel>Status:</ModalLabel>
              {selectedBooking.status}
            </ModalDetail>
            <ModalDetail>
              <ModalLabel>Estimated Price:</ModalLabel>₹
              {selectedBooking.estimatedPrice}
            </ModalDetail>
            <ModalDetail>
              <ModalLabel>Coordinates (Pickup):</ModalLabel>
              {selectedBooking.pickupCoordinates.coordinates.join(", ")}
            </ModalDetail>
            <ModalDetail>
              <ModalLabel>Coordinates (Dropoff):</ModalLabel>
              {selectedBooking.dropOffCoordinates.coordinates.join(", ")}
            </ModalDetail>
            <CloseButton onClick={() => setSelectedBooking(null)}>
              Close
            </CloseButton>
          </ModalContent>
        </BookingDetailsModal>
      )}
    </Wrapper>
  );
}

export default DriverBookings;

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
  flex items-center text-xl font-bold text-green-600 mt-2
`;

const StatusSection = tw.div`
  flex flex-col items-end space-y-3 mt-4 md:mt-0
`;

const Status = tw.div`
  bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium
`;

const Actions = tw.div`
  flex space-x-4 mt-2
`;

const AcceptButton = tw.button`
  bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
`;

const ViewButton = tw.button`
  bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
`;

const BookingDetailsModal = tw.div`
  fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50
`;

const ModalContent = tw.div`
  bg-white p-8 rounded-lg shadow-xl max-w-lg w-full m-4
`;

const ModalTitle = tw.h2`
  text-2xl font-bold mb-6 text-gray-800
`;

const ModalDetail = tw.p`
  mb-4 text-gray-700
`;

const ModalLabel = tw.span`
  font-semibold text-gray-900 mr-2
`;

const CloseButton = tw.button`
  mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
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
