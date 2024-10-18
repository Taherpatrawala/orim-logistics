import jwt from "jsonwebtoken";
import Driver from "../../../models/driver.js";

const authoriseDriver = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(
      new Error("Authorization header must be provided and start with Bearer")
    );
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    res.status(401);
    return next(new Error("Authentication token must be provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded.userType !== "driver") {
      res.status(401);
      return next(new Error("Invalid user type"));
    }
    req.driver = decoded;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Invalid or expired authentication token"));
  }
};

export default authoriseDriver;
