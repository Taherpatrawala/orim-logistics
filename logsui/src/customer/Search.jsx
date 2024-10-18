import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  setPickupCoordinatesState,
  setDropoffCoordinatesState,
  setPickupLocation,
  setDropoffLocation,
  resetMapCoordinates,
} from "./slices/mapCoordinates";

function Search() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [suggestedPickups, setSuggestedPickups] = useState([]);
  const [suggestedDropoffs, setSuggestedDropoffs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to get coordinates for pickup or dropoff locations
  const getCoordinates = async (location) => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoiZGV2bGlucm9jaGEiLCJhIjoiY2t2bG82eTk4NXFrcDJvcXBsemZzdnJoYSJ9.aq3RAvhuRww7R_7q-giWpA",
          limit: 10,
        })
    );
    const data = await response.json();
    return data;
  };

  // Fetch suggestions for pickup locations
  const logPickupLocations = async (e) => {
    setPickup(e.target.value);
    const data = await getCoordinates(e.target.value);
    setSuggestedPickups(data.features);
  };

  const pickupCoordinatesState = useSelector(
    (state) => state.mapCoordinates.pickupCoordinatesState
  );
  const dropoffCoordinatesState = useSelector(
    (state) => state.mapCoordinates.dropoffCoordinatesState
  );

  const pickupLocation = useSelector(
    (state) => state.mapCoordinates.pickupLocation
  );
  const dropoffLocation = useSelector(
    (state) => state.mapCoordinates.dropoffLocation
  );

  useEffect(() => {
    console.log("pickup", pickupCoordinatesState);
    console.log("dropoff", dropoffCoordinatesState);
    console.log("pickup", pickupLocation);
    console.log("dropoff", dropoffLocation);
  }, [pickupCoordinates, dropoffCoordinates]);

  // Fetch suggestions for dropoff locations
  const logDropoffLocations = async (e) => {
    setDropoff(e.target.value);
    const data = await getCoordinates(e.target.value);
    setSuggestedDropoffs(data.features);
  };

  // Handle pickup selection and store coordinates
  const handlePickupSelect = (e) => {
    const selectedPickup = suggestedPickups.find(
      (location) => location.place_name === e.target.value
    );
    setPickup(selectedPickup.place_name);
    dispatch(setPickupLocation(selectedPickup.place_name));
    setPickupCoordinates(selectedPickup.center); // Store the coordinates
    dispatch(setPickupCoordinatesState(pickupCoordinates));
  };

  // Handle dropoff selection and store coordinates
  const handleDropoffSelect = (e) => {
    const selectedDropoff = suggestedDropoffs.find(
      (location) => location.place_name === e.target.value
    );
    setDropoff(selectedDropoff.place_name);
    dispatch(setDropoffLocation(selectedDropoff.place_name));
    setDropoffCoordinates(selectedDropoff.center); // Store the coordinates
    dispatch(setDropoffCoordinatesState(dropoffCoordinates));
  };

  // Navigate to the confirmation page with both location names and coordinates
  const handleConfirm = () => {
    dispatch(setPickupCoordinatesState(pickupCoordinates));
    dispatch(setDropoffCoordinatesState(dropoffCoordinates));
    navigate("/confirm");
  };

  return (
    <Wrapper>
      <ButtonContainer>
        <Link to="/">
          <BackButton src="https://img.icons8.com/ios-filled/50/000000/left.png" />
        </Link>
      </ButtonContainer>
      <InputContainer>
        <FromToIcons>
          <Circle src="https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png" />
          <Line src="https://img.icons8.com/ios/50/9CA3AF/vertical-line.png" />
          <Square src="https://img.icons8.com/windows/50/000000/square-full.png" />
        </FromToIcons>
        <InputBoxes>
          <Input
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => logPickupLocations(e)}
          />
          {suggestedPickups.length > 0 && (
            <Select onChange={handlePickupSelect}>
              <option value="">Select a pickup location</option>
              {suggestedPickups.map((location) => (
                <option key={location.id} value={location.place_name}>
                  {location.place_name}
                </option>
              ))}
            </Select>
          )}
          <Input
            placeholder="Where to?"
            value={dropoff}
            onChange={(e) => logDropoffLocations(e)}
          />
          {suggestedDropoffs.length > 0 && (
            <Select onChange={handleDropoffSelect}>
              <option value="">Select a dropoff location</option>
              {suggestedDropoffs.map((location) => (
                <option key={location.id} value={location.place_name}>
                  {location.place_name}
                </option>
              ))}
            </Select>
          )}
        </InputBoxes>
        <PlusIcon src="https://img.icons8.com/ios/50/000000/plus-math.png" />
      </InputContainer>

      <SavedPlaces>
        <StartIcon src="https://img.icons8.com/ios-filled/50/ffffff/star--v1.png" />
        Saved Places
      </SavedPlaces>

      <ConfirmContainer onClick={handleConfirm}>
        <ConfirmButton>Confirm Locations</ConfirmButton>
      </ConfirmContainer>
    </Wrapper>
  );
}

export default Search;

const Wrapper = tw.div`
  bg-gray-100 min-h-screen p-4 md:p-6
`;

const ButtonContainer = tw.div`
  bg-white rounded-full p-2 shadow-md mb-4 inline-block
`;

const BackButton = tw.img`
  h-8 w-8 cursor-pointer
`;

const InputContainer = tw.div`
  bg-white flex items-center px-4 py-3 rounded-lg shadow-md mb-4
`;

const FromToIcons = tw.div`
  w-10 flex flex-col mr-2 items-center
`;

const Circle = tw.img`
  h-3 w-3
`;

const Line = tw.img`
  h-10
`;

const Square = tw.img`
  h-3 w-3
`;

const InputBoxes = tw.div`
  flex flex-col flex-1 space-y-2
`;

const Input = tw.input`
  h-12 bg-gray-100 rounded-md px-4 outline-none border-2 border-transparent focus:border-blue-500 transition-colors
`;

const Select = tw.select`
  h-12 bg-gray-100 rounded-md px-4 outline-none border-2 border-transparent focus:border-blue-500 transition-colors
`;

const PlusIcon = tw.img`
  w-10 h-10 bg-gray-200 rounded-full ml-3 p-2 cursor-pointer hover:bg-gray-300 transition-colors
`;

const SavedPlaces = tw.div`
  flex items-center bg-white px-4 py-3 rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-50 transition-colors
`;

const StartIcon = tw.img`
  bg-blue-500 w-10 h-10 p-2 rounded-full mr-3
`;

const ConfirmContainer = tw.div`
  bg-black text-white text-center mt-4 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors
`;

const ConfirmButton = tw.div`
  text-white text-lg font-semibold
`;
