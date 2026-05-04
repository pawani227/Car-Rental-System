import api from "./api";

// 1. Search filter එකට අනුව වාහන ලබා ගැනීම
export const searchVehicles = async (searchParams) => {
  try {
    const response = await api.get("/vehicles/getfilteredvehicles", {
      params: {
        location: searchParams.location,
        // Frontend එකේ "Any" ලෙස ඇත්නම් එය filter නොකිරීමට හිස් අගයක් යවන්න
        vehicleType:
          searchParams.vehicleType === "Any" ? "" : searchParams.vehicleType,

        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
      },
    });
    return response.data;
  } catch (error) {
    // Error එකක් ආවොත් එය handle කිරීමට නැවත throw කරන්න
    throw error.response?.data || { message: "Search failed" };
  }
};

// 2. අලුත් වාහනයක් ඇතුළත් කිරීම (අනාගත අවශ්‍යතා සඳහා)
export const addVehicle = async (vehicleData) => {
  try {
    const response = await api.post("/vehicles/addvehicle", vehicleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add vehicle" };
  }
};
