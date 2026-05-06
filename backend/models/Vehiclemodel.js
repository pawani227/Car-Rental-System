const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicleType: { type: String, required: true }, // Sedan, SUV, Luxury
    location: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
    image: { type: String }, // වාහනයේ photo එකේ URL එක
    driverFee: { type: Number, default: 0 }, // රියදුරු ගාස්තුව
    hasDriverSupport: { type: Boolean, default: false }, // රියදුරු සහාය තිබෙනවාද
    transmission: { type: String }, // Auto, Manual
    fuelType: { type: String }, // Diesel, Petrol, Hybrid
    capacity: { type: Number }, // පුද්ගල සංඛ්‍යාව
    bookedTimeSlots: [
      {
        from: { type: Date },
        to: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("vehicles", vehicleSchema);
