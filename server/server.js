import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";

import connectDB from "./config/mongooseConnect.js";
import adminJSConfig from "./adminjsConfig.js";

import ALL_CUSTOMER_ROUTES from "./api/utils/allCustomerRoutes.js";
import ALL_DRIVER_ROUTES from "./api/utils/allDriverRoutes.js";
import socketConnection from "./socket.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to your frontend domain
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

ALL_CUSTOMER_ROUTES(app);
ALL_DRIVER_ROUTES(app);

const PORT = process.argv[2] || process.env.PORT || 5000;

const __dirname = new URL(".", import.meta.url).pathname;

app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

adminJSConfig(app);
connectDB().then(() => {
  console.log(`MongoDB Connected`);
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  socketConnection(io);
});
