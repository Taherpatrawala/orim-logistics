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
  const [status, setStatus] = useState(""); // State to hold the new status
  const bearerToken = Cookies.get("driverToken");

  // Fetch Booking Details
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
          setStatus(response.data.booking.status); // Initialize with current status
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

  // Handle Status Update Submission
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/api/driver/booking/updateStatus`,
        {
          bookingId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Booking status updated successfully!");
        setBookingDetails({ ...bookingDetails, status });
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (!bookingDetails)
    return <NoDataText>No booking details available</NoDataText>;

  return (
    <Wrapper>
      <Title>Booking Details</Title>
      <ContentWrapper>
        <DetailsWrapper>
          <DetailItem>
            <DetailLabel>Pickup Location:</DetailLabel>
            <DetailValue>{bookingDetails.pickupLocation}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Dropoff Location:</DetailLabel>
            <DetailValue>{bookingDetails.dropOffLocation}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Status:</DetailLabel>
            <StatusBadge status={bookingDetails.status}>
              {bookingDetails.status}
            </StatusBadge>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Estimated Price:</DetailLabel>
            <DetailValue>₹{bookingDetails.estimatedPrice}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Coordinates (Pickup):</DetailLabel>
            <DetailValue>
              {bookingDetails.pickupCoordinates.coordinates.join(", ")}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Coordinates (Dropoff):</DetailLabel>
            <DetailValue>
              {bookingDetails.dropOffCoordinates.coordinates.join(", ")}
            </DetailValue>
          </DetailItem>
          {/* Form to Update Booking Status */}
          <form onSubmit={handleStatusUpdate}>
            <DetailItem>
              <DetailLabel>Update Status:</DetailLabel>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 rounded-lg"
              >
                <option value="">Select a shipment status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Pending Pickup">Pending Pickup</option>
                <option value="En Route to Pickup">En Route to Pickup</option>
                <option value="Arrived at Pickup">Arrived at Pickup</option>
                <option value="Goods Collected">Goods Collected</option>
                <option value="En Route to Dropoff">En Route to Dropoff</option>
                <option value="At Dropoff Location">At Dropoff Location</option>
                <option value="Delivery in Progress">
                  Delivery in Progress
                </option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned to Sender">Returned to Sender</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </DetailItem>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Update Status
            </button>
          </form>
        </DetailsWrapper>
        <MapWrapper>
          <Map
            pickupCoordinates={bookingDetails.pickupCoordinates.coordinates}
            dropoffCoordinates={bookingDetails.dropOffCoordinates.coordinates}
          />
        </MapWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

export default BookingDetails;

// Tailwind styled components
const Wrapper = tw.div`
  flex flex-col items-center p-4 md:p-6 max-w-7xl mx-auto w-full
`;

const Title = tw.h1`
  text-2xl md:text-3xl font-bold mb-6 text-gray-800
`;

const ContentWrapper = tw.div`
  w-full flex flex-col lg:flex-row gap-6
`;

const DetailsWrapper = tw.div`
  bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3 space-y-4
`;

const DetailItem = tw.div`
  flex flex-col space-y-1
`;

const DetailLabel = tw.span`
  text-sm font-medium text-gray-600
`;

const DetailValue = tw.span`
  text-base text-gray-800
`;

const StatusBadge = tw.span`
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

const MapWrapper = tw.div`
  w-full lg:w-2/3 h-[600px] rounded-lg overflow-hidden shadow-md
`;

const LoadingText = tw.p`
  text-xl text-gray-600 font-medium text-center py-12
`;

const NoDataText = tw.p`
  text-xl text-gray-600 font-medium text-center py-12
`;
