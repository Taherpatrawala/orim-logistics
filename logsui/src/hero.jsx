import { UserCircle, Truck } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/search");
    }
    const driverToken = Cookies.get("driverToken");
    if (driverToken) {
      navigate("/driver/bookings");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Welcome to Orim Logistics!
      </h1>
      <div className="flex space-x-6">
        <SignInOption
          title="Customer"
          icon={<UserCircle className="w-12 h-12 mb-4" />}
          description="Sign in or create a customer account"
        />
        <SignInOption
          title="Driver"
          icon={<Truck className="w-12 h-12 mb-4" />}
          description="Sign in or create a driver account"
        />
      </div>
    </div>
  );
};

const SignInOption = ({ title, icon, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
      {icon}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 text-center mb-4">{description}</p>
      <div className="flex">
        <Link
          to={`${title.toLocaleLowerCase()}/login`}
          className="m-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Log In
        </Link>
        <Link
          to={`${title.toLocaleLowerCase()}/signup`}
          className="m-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
