import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavbarWrapper from "./Navbar/NavbarWrapper";
import Search from "./customer/Search"; // Adjust path according to your file structure
import Confirm from "./customer/Confirm"; // Adjust path according to your file structure
import MapComponent from "./customer/components/leafMap";
import HomePage from "./hero";

import CustomerLogin from "./customer/components/auth/Login";
import CustomerSignup from "./customer/components/auth/SignUp";
import CustomerBookingDetails from "./customer/components/CustomerBookingDetails";

import DriverSignup from "./driver/components/auth/SignUp";
import DriverLogin from "./driver/components/auth/Login";
import DriverBookings from "./driver/components/DriverBookings";
import DriverAcceptedBookings from "./driver/components/AcceptedBooking";
import BookingDetails from "./driver/components/BookingDetails";
import DriverProfile from "./driver/components/DriverProfile";

import AllBookings from "./customer/components/AllBookings";

function App() {
  return (
    <BrowserRouter>
      <NavbarWrapper />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/map" element={<MapComponent />} />
          {/* Add more routes as necessary */}

          <Route path="/customer/bookings" element={<AllBookings />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/customer/login" element={<CustomerLogin />} />

          <Route
            path="/customer/booking/details/:bookingId"
            element={<CustomerBookingDetails />}
          />

          <Route path="/driver/profile" element={<DriverProfile />} />
          <Route path="/driver/bookings" element={<DriverBookings />} />
          <Route
            path="/driver/bookings/accepted"
            element={<DriverAcceptedBookings />}
          />
          <Route
            path="/driver/booking/accepted/details/:bookingId"
            element={<BookingDetails />}
          />
          <Route path="/driver/signup" element={<DriverSignup />} />
          <Route path="/driver/login" element={<DriverLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
