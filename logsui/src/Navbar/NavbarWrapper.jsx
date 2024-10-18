import CustomerNavbar from "./CustomerNavbar";
import DriverNavbar from "./DriverNavbar";
import Cookies from "js-cookie";

const NavbarWrapper = () => {
  const userType = Cookies.get("userType"); // Assumes a cookie storing userType as 'customer' or 'driver'

  return (
    <div>
      {userType === "customer" && <CustomerNavbar />}
      {userType === "driver" && <DriverNavbar />}
    </div>
  );
};

export default NavbarWrapper;
