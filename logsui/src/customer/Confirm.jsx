import { Link } from "react-router-dom";
import Map from "./components/Map"; // Adjust the import path as necessary
import RideSelector from "./components/RideSelector"; // Adjust the import path as necessary
import tw from "tailwind-styled-components";
import { useSelector } from "react-redux";

function Confirm() {
  //   const { pickup, dropoff } = useParams();

  // Get coordinates from Redux state
  const pickupCoordinates = useSelector(
    (state) => state.mapCoordinates.pickupCoordinatesState
  );
  const dropoffCoordinates = useSelector(
    (state) => state.mapCoordinates.dropoffCoordinatesState
  );
  const pickupLocation = useSelector(
    (state) => state.mapCoordinates.pickupLocation
  );
  const dropoffLocation = useSelector(
    (state) => state.mapCoordinates.dropoffLocation
  );
  console.log(
    "from confirm",
    pickupCoordinates,
    dropoffCoordinates,
    pickupLocation,
    dropoffLocation
  );

  return (
    <Wrapper>
      <BackButtonContainer>
        <Link to="/search">
          <BackButton src="https://img.icons8.com/ios-filled/50/000000/left.png" />
        </Link>
      </BackButtonContainer>
      {pickupCoordinates && dropoffCoordinates && (
        <Map
          pickupCoordinates={pickupCoordinates}
          dropoffCoordinates={dropoffCoordinates}
        />
      )}
      <RideContainer>
        <RideSelector
          pickupCoordinates={pickupCoordinates}
          dropoffCoordinates={dropoffCoordinates}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
        />

        {/* <ConfirmButtonContainer>
          <ConfirmButton>Confirm UberX</ConfirmButton>
        </ConfirmButtonContainer> */}
      </RideContainer>
    </Wrapper>
  );
}

export default Confirm;

const Wrapper = tw.div`
    flex h-screen flex-col
`;

const RideContainer = tw.div`
    flex flex-col flex-1 h-1/2
`;

const ConfirmButtonContainer = tw.div`
    border-t-2
`;

const ConfirmButton = tw.div`
    bg-black text-white my-4 mx-4 py-4 text-center text-xl
`;

const BackButtonContainer = tw.div`
    absolute rounded-full top-4 left-4 z-10 bg-white shadow-md cursor-pointer
`;

const BackButton = tw.img`
    h-full object-contain
`;
