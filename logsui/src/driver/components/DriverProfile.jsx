import { useState, useEffect } from "react";
import axios from "axios";
import tw from "tailwind-styled-components";
import Cookies from "js-cookie";

const DriverProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch driver profile information from the server
    const fetchProfileData = async () => {
      try {
        const token = Cookies.get("driverToken");
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_LINK}/api/driver/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setProfileData(response.data);
        } else {
          setError("Unable to fetch profile data.");
        }
      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <LoadingText>Loading profile...</LoadingText>;

  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <ProfileWrapper>
      <Title>Driver Profile</Title>
      {profileData && (
        <ContentWrapper>
          <ProfileHeader>
            <Avatar src="/path/to/avatar.jpg" alt="Driver Avatar" />
            <ProfileInfo>
              <ProfileName>{profileData.name}</ProfileName>
              <ProfileEmail>{profileData.email}</ProfileEmail>
            </ProfileInfo>
          </ProfileHeader>
          <ProfileDetails>
            <ProfileItem>
              <Label>Phone:</Label>
              <Value>{profileData.phone}</Value>
            </ProfileItem>
            <ProfileItem>
              <Label>Vehicle Type:</Label>
              <Value>{profileData.vehicleType}</Value>
            </ProfileItem>
            <ProfileItem>
              <Label>Total Bookings:</Label>
              <Value>{profileData.totalBookings}</Value>
            </ProfileItem>
            <ProfileItem>
              <Label>Accepted Bookings:</Label>
              <Value>{profileData.acceptedBookings}</Value>
            </ProfileItem>
            <ProfileItem>
              <Label>Total Earnings:</Label>
              <Value>${profileData.earnings.toFixed(2)}</Value>
            </ProfileItem>
          </ProfileDetails>
        </ContentWrapper>
      )}
    </ProfileWrapper>
  );
};

// Styling components
const ProfileWrapper = tw.div`
  max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg
`;

const Title = tw.h1`
  text-3xl font-extrabold mb-6 text-gray-900 text-center
`;

const ContentWrapper = tw.div`
  space-y-8
`;

const ProfileHeader = tw.div`
  flex items-center space-x-4
`;

const Avatar = tw.img`
  w-16 h-16 rounded-full border-2 border-gray-200
`;

const ProfileInfo = tw.div`
  flex flex-col space-y-1
`;

const ProfileName = tw.span`
  text-xl font-semibold text-gray-800
`;

const ProfileEmail = tw.span`
  text-sm text-gray-600
`;

const ProfileDetails = tw.div`
  space-y-4
`;

const ProfileItem = tw.div`
  flex justify-between border-b py-2
`;

const Label = tw.span`
  text-sm font-medium text-gray-600
`;

const Value = tw.span`
  text-lg text-gray-800
`;

const LoadingText = tw.p`
  text-xl text-gray-600 font-medium text-center py-12
`;

const ErrorText = tw.p`
  text-red-600 text-center py-12
`;

export default DriverProfile;
