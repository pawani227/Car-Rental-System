const express = require("express");
const router = express.Router();
const { getFilteredVehicles } = require("../controllers/vehicleController");
const Vehicle = require("../models/Vehiclemodel");

router.get("/getfilteredvehicles", getFilteredVehicles);

// වාහන ඇතුළත් කිරීමට (Add Vehicles)
router.post("/addvehicle", async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json({ message: "Vehicle added successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Failed to add vehicle", error });
  }
});

module.exports = router;
