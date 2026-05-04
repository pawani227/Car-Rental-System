const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicleType: { type: String, required: true }, // Sedan, SUV, Luxury
    location: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
    image: { type: String }, // වාහනයේ photo එකේ URL එක
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
