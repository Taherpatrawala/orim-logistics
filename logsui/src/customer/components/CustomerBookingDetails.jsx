import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import LiveMap from "./LiveMap"; // Import the Map component

const socket = io(import.meta.env.VITE_SERVER_LINK);

function CustomerBookingDetails() {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null); // Driver's live location
  const [loading, setLoading] = useState(true);
  const bearerToken = Cookies.get("token"); // Use customerToken here

  // Fetch booking details when component mounts
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_LINK
          }/api/customer/book/details/${bookingId}`,
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

  // Setup socket connection for live tracking
  useEffect(() => {
    if (bookingId) {
      // Join the room specific to the bookingId
      socket.emit("customerJoinRoom", { bookingId });

      // Listen for updates to the driver's location
      socket.on("driverLocation", (location) => {
        console.log("Driver location received:", location);
        setDriverLocation(location);
      });

      return () => {
        socket.off("driverLocation");
      };
    }
  }, [bookingId]);

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
            <DetailValue>${bookingDetails.estimatedPrice}</DetailValue>
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
        </DetailsWrapper>
        <MapWrapper>
          <LiveMap
            pickupCoordinates={bookingDetails.pickupCoordinates.coordinates}
            dropoffCoordinates={bookingDetails.dropOffCoordinates.coordinates}
            driverLocation={driverLocation}
            bookingId={bookingId}
          />
        </MapWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

export default CustomerBookingDetails;

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
    switch (props.status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
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
