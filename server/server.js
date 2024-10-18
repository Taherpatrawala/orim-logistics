import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import path from "path";

import connectDB from "./config/mongooseConnect.js";
import adminJSConfig from "./adminjsConfig.js";

import ALL_CUSTOMER_ROUTES from "./api/utils/allCustomerRoutes.js";
import ALL_DRIVER_ROUTES from "./api/utils/allDriverRoutes.js";
import socketConnection from "./socket.js";

dotenv.config();

const app = express();

let __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this to your frontend domain
    methods: ["GET", "POST"],
  },
});

adminJSConfig(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log(`Hello from port ${PORT}`);
  return res.send(`Hello from port ${PORT}`);
});

ALL_CUSTOMER_ROUTES(app);
ALL_DRIVER_ROUTES(app);

const PORT = process.argv[2] || process.env.PORT || 5000;

const ___dirname = new URL(".", import.meta.url).pathname;

app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(___dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

connectDB().then(() => {
  console.log(`MongoDB Connected`);
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  socketConnection(io);
});
