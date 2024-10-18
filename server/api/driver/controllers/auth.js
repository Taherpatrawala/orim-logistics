import Driver from "../../../models/driver.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const driverController = {};

driverController.signup = async (req, res) => {
  const { name, email, password, phone, vehicleType, location } = req.body;

  try {
    const existingDriver = await Driver.findOne({ email }).lean().exec();
    if (existingDriver)
      return res.status(409).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const driver = new Driver({
      name,
      email,
      phone,
      vehicleType,
      password: hashedPassword,
      location,
    });

    await driver.save();
    const token = jwt.sign(
      { userId: driver._id, userType: "driver" },
      process.env.TOKEN_SECRET
    );

    res
      .status(201)
      .json({ message: "Driver registered successfully!", token: token });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error in creating driver", error: error.message });
  }
};

driverController.signin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const driver = await Driver.findOne({ email })
      .select("password")
      .lean()
      .exec();
    if (!driver || !(await bcrypt.compare(password, driver.password))) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: driver._id, userType: "driver" },
      process.env.TOKEN_SECRET
    );
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(400).json({ message: "Error in logging in" });
  }
};

export default driverController;
