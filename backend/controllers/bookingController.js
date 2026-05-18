const Booking = require("../models/Booking");

const checkAvailability = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.query;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        message: "vehicleId, startDate, and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check for overlapping bookings
    const conflict = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ["pending", "confirmed"] },
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });

    res.status(200).json({
      available: !conflict,
      conflictingBooking: conflict || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      pickup,
      dropoff,
      totalPrice,
      notes,
      userId,
    } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = new Booking({
      vehicle: vehicleId,
      user: userId || null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pickup,
      dropoff,
      totalPrice,
      notes,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("vehicle", "name")
      .populate("user", "name email")
      .sort({ startDate: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkAvailability,
  createBooking,
  getBookings,
};
