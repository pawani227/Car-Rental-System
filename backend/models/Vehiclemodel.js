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
    fuelType: { type: String },
    year: { type: Number }, // Diesel, Petrol, Hybrid
    extraChargesperkm: { type: Number }, // කිලෝමීටරයකට අමතර ගාස්තුව
    capacity: { type: Number },
    KMPerDay: { type: Number }, // දිනකට කිලෝමීටර් සීමාව
    mileage: { type: Number }, // පුද්ගල සංඛ්‍යාව
    bookedTimeSlots: [
      {
        from: { type: Date },
        to: { type: Date },
      },
    ],

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // අර User model එකේ නම මෙතනට දෙන්න
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("vehicles", vehicleSchema);
