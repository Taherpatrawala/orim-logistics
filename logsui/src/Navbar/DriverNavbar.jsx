import { Link, useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";
import Cookies from "js-cookie";

const DriverNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("driverToken");
    Cookies.remove("userType");
    navigate("/");
  };

  return (
    <NavWrapper>
      <Logo>
        <Link to="/">
          <span className="text-blue-500">Orim</span>
          <span className="text-red-500">Logistics</span>
        </Link>
      </Logo>
      <NavLinks>
        <NavLink>
          <Link to="/driver/bookings">Bookings</Link>
        </NavLink>
        <NavLink>
          <Link to="/driver/bookings/accepted">Current Booking</Link>
        </NavLink>
        <NavLink>
          <Link to="/driver/profile">Profile</Link>
        </NavLink>
        <NavLink>
          <button onClick={handleLogout}>Logout</button>
        </NavLink>
      </NavLinks>
    </NavWrapper>
  );
};

const NavWrapper = tw.div`
  flex justify-between items-center p-4 bg-blue-800 text-white shadow-md
`;

const Logo = tw.div`
  font-bold text-xl
`;

const NavLinks = tw.div`
  flex space-x-4
`;

const NavLink = tw.div`
  hover:text-gray-300
`;

export default DriverNavbar;
