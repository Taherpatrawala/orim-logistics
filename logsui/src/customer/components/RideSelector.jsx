import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { carList } from "../data/carList";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

function RideSelector({
  pickupCoordinates,
  dropoffCoordinates,
  pickupLocation,
  dropoffLocation,
  userId,
  driverId,
}) {
  const [rideDuration, setRideDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [selectedCar, setSelectedCar] = useState(null); // Track selected car
  const [bookingConfirmed, setBookingConfirmed] = useState(false); // Track booking status

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRideDuration = async () => {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?access_token=pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA`
      );
      const data = await response.json();
      console.log(data);

      if (data.routes) {
        setRideDuration(data.routes[0].duration / 100);
        setDistance(data.routes[0].distance / 1000);
      }
    };

    if (pickupCoordinates && dropoffCoordinates) {
      fetchRideDuration();
    }
  }, [pickupCoordinates, dropoffCoordinates]);

  console.log("Ride duration:", pickupLocation, dropoffLocation);

  // Function to handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedCar) {
      alert("Please select a car before confirming.");
      return;
    }

    const estimatedPrice = (rideDuration * selectedCar.multiplier * 84).toFixed(
      2
    );

    const bookingData = {
      userId,
      driverId,
      pickupLocation,
      dropOffLocation: dropoffLocation,
      pickupCoordinates,
      dropOffCoordinates: dropoffCoordinates,
      estimatedPrice,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_LINK}/api/customer/book`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        const result = response;
        setBookingConfirmed(true);
        alert(
          `Booking confirmed! Your booking ID is: ${result.data.bookingId}`
        );
        navigate("/customer/bookings");
      } else {
        const errorData = response;
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Wrapper>
      <Title>
        {distance.toFixed(1)} km - Estimated Time:{" "}
        {(rideDuration.toFixed(0) / 60).toFixed(2)} hr
      </Title>
      <CarList>
        {carList.map((car, index) => (
          <Car
            key={index}
            onClick={() => setSelectedCar(car)}
            className={selectedCar === car ? "bg-gray-200" : ""}
          >
            <CarImage src={car.imgUrl} />
            <CarDetails>
              <Service>{car.service}</Service>
              <Time>{(rideDuration.toFixed(0) / 60).toFixed(2)} hr</Time>
            </CarDetails>
            <Price>₹{(rideDuration * car.multiplier * 84).toFixed(2)}</Price>
          </Car>
        ))}
      </CarList>

      {selectedCar && (
        <ConfirmButton onClick={handleConfirmBooking}>
          Confirm {selectedCar.service} Ride
        </ConfirmButton>
      )}

      {bookingConfirmed && (
        <p className="text-green-500 mt-2">Booking Confirmed!</p>
      )}
    </Wrapper>
  );
}

export default RideSelector;

const Wrapper = tw.div`
    flex-1 overflow-y-scroll flex flex-col
`;

const Title = tw.div`
    text-gray-500 text-center text-xs py-2 border-b
`;

const CarList = tw.div`
    overflow-y-scroll
`;

const Car = tw.div`
    flex p-4 items-center cursor-pointer
`;

const CarImage = tw.img`
    h-14 mr-4
`;

const CarDetails = tw.div`
    flex-1
`;

const Service = tw.div`
    font-medium
`;

const Time = tw.div`
    text-xs text-blue-500
`;

const Price = tw.div`
    text-sm
`;

const ConfirmButton = tw.button`
    bg-indigo-600 text-white py-2 px-4 mt-4 mx-4 rounded-lg hover:bg-indigo-700
`;
