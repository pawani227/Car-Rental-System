const express = require("express");
const {
  checkAvailability,
  createBooking,
  getBookings,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/check-availability", checkAvailability);
router.post("/", createBooking);
router.get("/", getBookings);

module.exports = router;
