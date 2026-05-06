const Vehicle = require("../models/Vehiclemodel");

exports.getFilteredVehicles = async (req, res) => {
  try {
    const { vehicleType, location, startDate, endDate, withDriver } = req.query;
    let query = {};

    // 1. වාහන වර්ගය අනුව filter කිරීම
    if (vehicleType && vehicleType.toLowerCase() !== "any") {
      query.vehicleType = { $regex: vehicleType, $options: "i" };
    }

    // 2. Location එක අනුව filter කිරීම
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 3. Driver support එක අනුව filter කිරීම
    // With driver = true නම් driver support තියෙන වාහන පමණක්
    // Vehicle only = false නම් driver support නැති වාහන පමණක්
    if (withDriver === "true") {
      query.hasDriverSupport = true;
    } else if (withDriver === "false") {
      query.hasDriverSupport = false;
    }

    // Database එකෙන් criteria වලට ගැලපෙන වාහන ගන්නා ගමන්ම
    // owner_id එක ඇතුළට අදාළ User ගේ විස්තර පුරවනවා (Populate)
    const allVehicles = await Vehicle.find(query).populate("owner_id");

    // 4. දින සහ වේලාව අනුව (Availability) filter කිරීම
    if (startDate && endDate) {
      const userStart = new Date(startDate);
      const userEnd = new Date(endDate);
      console.log("User start date:", userStart);
      console.log("User end date:", userEnd);

      const availableVehicles = allVehicles.filter((vehicle) => {
        // වාහනයට දැනටමත් bookings තියෙනවා නම් ඒ කාලසීමාවන් පරීක්ෂා කරන්න
        for (const slot of vehicle.bookedTimeSlots) {
          const existingStart = new Date(slot.from);
          const existingEnd = new Date(slot.to);

          // Overlap එකක් (කාලය ගැටීමක්) වෙනවාදැයි බලන logic එක
          // (User ගේ ආරම්භය දැනට තියෙන එකක අවසානයට කලින් සහ User ගේ අවසානය දැනට තියෙන එකක ආරම්භයට පසුව නම්)
          const isOverlapping =
            userStart < existingEnd && userEnd > existingStart;

          if (isOverlapping) {
            return false; // මේ වාහනය ඒ වෙලාවට available නැහැ
          }
        }
        return true; // කිසිදු ගැටීමක් නැති නම් වාහනය available
      });

      // Available වාහන ටික විතරක් යවනවා
      return res.status(200).json(availableVehicles);
    }

    // startDate/endDate නැති නම් සෙවුම් නිර්ණායක වලට ගැලපෙන ඔක්කොම යවනවා
    res.status(200).json(allVehicles);
  } catch (error) {
    console.error("Search error:", error);
    res.status(400).json({ message: "Search failed", error: error.message });
  }
};
