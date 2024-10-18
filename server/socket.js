import Booking from "./models/bookings.js";

const socketConnection = (io) => {
  io.on("connection", (socket) => {
    socket.on("driverJoinRoom", async ({ bookingId }) => {
      const room = await Booking.findById(bookingId);
      if (room) {
        socket.join(bookingId);
        console.log(`Driver joined room: ${bookingId}`);
      } else {
        console.log(`Room for booking ${bookingId} not found.`);
      }
    });

    // Customer joins the room
    socket.on("customerJoinRoom", async ({ bookingId }) => {
      const room = await Booking.findById(bookingId);
      if (room) {
        socket.join(bookingId);
        console.log(`Customer joined room: ${bookingId}`);
      } else {
        console.log(`Room for booking ${bookingId} not found.`);
      }
    });
    socket.on("driverLocationUpdate", ({ bookingId, location }) => {
      console.log(
        `Received driver location for booking ${bookingId}:`,
        location
      );
      io.to(bookingId).emit("driverLocation", location);
    });
  });
};

export default socketConnection;
