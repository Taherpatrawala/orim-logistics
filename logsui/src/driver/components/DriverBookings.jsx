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

  if (loading) return <p>Loading...</p>;

  return (
    <Wrapper>
      <Title>Pending Bookings</Title>
      {pendingBookings.length > 0 ? (
        <BookingList>
          {pendingBookings.map((booking, index) => (
            <BookingItem key={index}>
              <Details>
                <Location>{`From: ${booking.pickupLocation} To: ${booking.dropOffLocation}`}</Location>
                <Price>{`Price: $${booking.estimatedPrice}`}</Price>
              </Details>
              <Status>{`Status: ${booking.status}`}</Status>
              <Actions>
                <AcceptButton onClick={() => handleAcceptBooking(booking._id)}>
                  Accept Booking
                </AcceptButton>
                <ViewButton
                  onClick={() => handleViewBookingDetails(booking._id)}
                >
                  View Details
                </ViewButton>
              </Actions>
            </BookingItem>
          ))}
        </BookingList>
      ) : (
        <p>No pending bookings found.</p>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal>
          <ModalContent>
            <h2>Booking Details</h2>
            <p>Pickup Location: {selectedBooking.pickupLocation}</p>
            <p>Dropoff Location: {selectedBooking.dropOffLocation}</p>
            <p>Status: {selectedBooking.status}</p>
            <p>Estimated Price: ${selectedBooking.estimatedPrice}</p>
            <p>
              Coordinates (Pickup):{" "}
              {selectedBooking.pickupCoordinates.coordinates.join(", ")}
            </p>
            <p>
              Coordinates (Dropoff):{" "}
              {selectedBooking.dropOffCoordinates.coordinates.join(", ")}
            </p>
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

const Actions = tw.div`
  flex space-x-4
`;

const AcceptButton = tw.button`
  bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600
`;

const ViewButton = tw.button`
  bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600
`;

const BookingDetailsModal = tw.div`
  fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center
`;

const ModalContent = tw.div`
  bg-white p-8 rounded-lg shadow-md max-w-lg w-full
`;

const CloseButton = tw.button`
  mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600
`;
