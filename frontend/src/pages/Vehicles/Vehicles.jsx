import React, { useEffect, useMemo, useState } from "react";
import { searchVehicles } from "../../service/vehicleService";
import { useNavigate } from "react-router-dom";
import "./Vehicles.css";

const Vehicles = () => {
  const [rentType, setRentType] = useState("all");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicleType, setVehicleType] = useState("Any");
  const [location, setLocation] = useState("");
  const [fuelType, setFuelType] = useState("Any");
  const [transmission, setTransmission] = useState("Any");
  const [capacity, setCapacity] = useState("Any");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availabilityChecks, setAvailabilityChecks] = useState({});
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await searchVehicles({
          vehicleType: "Any",
          location: "",
          startDate: "",
          endDate: "",
        });

        setVehicles(results);
      } catch (err) {
        setError(err.message || "Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  useEffect(() => {
    // Check availability for all vehicles when dates change
    if (startDate && endDate) {
      const checkAllAvailability = async () => {
        const checks = {};
        for (const vehicle of vehicles) {
          try {
            const res = await fetch(
              `http://localhost:5000/api/bookings/check-availability?vehicleId=${vehicle._id}&startDate=${startDate}&endDate=${endDate}`,
            );
            const data = await res.json();
            checks[vehicle._id] = data.available;
          } catch (err) {
            checks[vehicle._id] = true; // assume available on error
          }
        }
        setAvailabilityChecks(checks);
      };
      checkAllAvailability();
    } else {
      setAvailabilityChecks({});
    }
  }, [startDate, endDate, vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const modeMatch =
        rentType === "all"
          ? true
          : rentType === "driver"
            ? vehicle.hasDriverSupport
            : !vehicle.hasDriverSupport;

      const typeMatch =
        vehicleType === "Any"
          ? true
          : vehicle.vehicleType?.toLowerCase() === vehicleType.toLowerCase();

      const locationMatch = location.trim()
        ? vehicle.location
            ?.toLowerCase()
            .includes(location.trim().toLowerCase())
        : true;

      const fuelMatch =
        fuelType === "Any"
          ? true
          : vehicle.fuelType?.toLowerCase() === fuelType.toLowerCase();

      const transmissionMatch =
        transmission === "Any"
          ? true
          : vehicle.transmission?.toLowerCase() === transmission.toLowerCase();

      const capacityMatch =
        capacity === "Any"
          ? true
          : capacity === "7+"
            ? Number(vehicle.capacity) >= 7
            : Number(vehicle.capacity) === Number(capacity);

      // Check availability if dates are selected
      const availabilityMatch =
        !startDate || !endDate
          ? true
          : availabilityChecks[vehicle._id] !== false;

      return (
        modeMatch &&
        typeMatch &&
        locationMatch &&
        fuelMatch &&
        transmissionMatch &&
        capacityMatch &&
        availabilityMatch
      );
    });
  }, [
    vehicles,
    rentType,
    vehicleType,
    location,
    fuelType,
    transmission,
    capacity,
    startDate,
    endDate,
    availabilityChecks,
  ]);

  const calculatePrice = (vehicle) => {
    const basePrice = Number(vehicle.rentPerDay);
    if (rentType === "driver" && vehicle.hasDriverSupport) {
      return basePrice + (vehicle.driverFee || 0);
    }
    return basePrice;
  };

  const handleBookNow = (vehicle) => {
    try {
      // Check if user is logged in
      if (!userInfo) {
        navigate("/login");
        return;
      }

      if (!vehicle.owner_id) {
        alert("Owner information not available");
        return;
      }

      // Navigate to confirm booking page with vehicle and owner data
      // owner_id already contains the full owner object due to populate() in backend
      navigate("/confirm-booking", {
        state: {
          vehicle,
          owner: vehicle.owner_id,
        },
      });
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to load owner details");
    }
  };

  return (
    <div className="vehicles-page">
      <div className="vehicles-page__header">
        <h1>Vehicles</h1>
        <p>
          {rentType === "driver"
            ? "Vehicles with driver support"
            : rentType === "vehicle"
              ? "Vehicle only listings"
              : "Browse all vehicles"}
        </p>

        <div
          className="vehicles-toggle"
          role="tablist"
          aria-label="Vehicle mode"
        >
          <button
            type="button"
            className={
              rentType === "vehicle"
                ? "vehicles-toggle__btn active"
                : "vehicles-toggle__btn"
            }
            onClick={() => setRentType("vehicle")}
          >
            Vehicle only
          </button>
          <button
            type="button"
            className={
              rentType === "driver"
                ? "vehicles-toggle__btn active"
                : "vehicles-toggle__btn"
            }
            onClick={() => setRentType("driver")}
          >
            With driver
          </button>
          <button
            type="button"
            className={
              rentType === "all"
                ? "vehicles-toggle__btn active"
                : "vehicles-toggle__btn"
            }
            onClick={() => setRentType("all")}
          >
            All Vehicles
          </button>
        </div>

        <div className="vehicles-filters">
          <div className="vehicles-filter">
            <label>Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Honda">Honda Civic</option>
              <option value="Vezel">Vezel</option>
              <option value="LandCruiser">Toyota Land Cruiser</option>
              <option value="Toyota">Toyota Corolla</option>
              <option value="BMW">BMW 5 Series</option>
              <option value="Alto">Suzuki Alto</option>
              <option value="Vitz">Toyota Vitz</option>
              <option value="HondaFit">Honda Fit</option>
              <option value="Audi">Audi A4</option>
              <option value="Benz">Benz</option>
              <option value="BYD">BYD Dolphin</option>
              <option value="Nissan">Nissan Leaf</option>
              <option value="Tesla">Tesla Model 3</option>
            </select>
          </div>

          <div className="vehicles-filter vehicles-filter--wide">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter by location"
            />
          </div>

          <div className="vehicles-filter vehicles-filter--date vehicles-filter--highlight">
            <label>Pickup Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="vehicles-filter vehicles-filter--date vehicles-filter--highlight">
            <label>Dropoff Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="vehicles-filter">
            <label>Fuel Type</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="vehicles-filter">
            <label>Transmission</label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="Auto">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi">Semi-Automatic</option>
            </select>
          </div>

          <div className="vehicles-filter">
            <label>Capacity</label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            >
              <option value="Any">Any</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>

          <button
            type="button"
            className="vehicles-filter__reset"
            onClick={() => {
              setRentType("all");
              setVehicleType("Any");
              setLocation("");
              setFuelType("Any");
              setTransmission("Any");
              setCapacity("Any");
              setStartDate("");
              setEndDate("");
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="vehicles-state">Loading vehicles...</div>
      ) : error ? (
        <div className="vehicles-state vehicles-state--error">{error}</div>
      ) : (
        <div className="vehicles-grid">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <article className="vehicle-card" key={vehicle._id}>
                <div className="vehicle-card__imageWrap">
                  <img
                    src={vehicle.image}
                    className="vehicle-card__image"
                    alt={vehicle.name}
                  />
                </div>

                <div className="vehicle-card__body">
                  <h3 className="vehicle-card__title">{vehicle.name}</h3>
                  <div className="vehicle-card__meta">
                    <p>Location: {vehicle.location}</p>
                    <p>Type: {vehicle.vehicleType}</p>
                    {vehicle.transmission && (
                      <p>Transmission: {vehicle.transmission}</p>
                    )}
                    {vehicle.fuelType && <p>Fuel: {vehicle.fuelType}</p>}
                    {vehicle.capacity && <p>Capacity: {vehicle.capacity}</p>}
                  </div>

                  <h4 className="vehicle-card__price">
                    Rs. {Number(calculatePrice(vehicle)).toLocaleString()} / day
                  </h4>

                  <p className="vehicle-card__note">
                    {rentType === "driver" && vehicle.hasDriverSupport
                      ? `Driver fee included: Rs. ${Number(vehicle.driverFee || 0).toLocaleString()}`
                      : vehicle.hasDriverSupport
                        ? "Driver support available"
                        : "Vehicle only"}
                  </p>

                  <button
                    className="vehicle-card__button"
                    onClick={() => handleBookNow(vehicle)}
                  >
                    Book Now
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="vehicles-state">No vehicles found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
