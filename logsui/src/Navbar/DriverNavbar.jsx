import { Link } from "react-router-dom";
import tw from "tailwind-styled-components";

const DriverNavbar = () => {
  return (
    <NavWrapper>
      <Logo>
        <Link to="/">BrandLogo</Link>
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
          <Link to="/driver/logout">Logout</Link>
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
