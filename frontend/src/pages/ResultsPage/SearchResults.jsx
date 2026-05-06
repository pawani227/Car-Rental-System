import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const vehicles = location.state?.vehicles || [];
  const rentType = location.state?.rentType || "vehicle";
  const showDriverPricing = rentType === "driver";
  const [driverFilter, setDriverFilter] = useState("all");

  const calculatePrice = (vehicle) => {
    const basePrice = Number(vehicle.rentPerDay);
    if (showDriverPricing && vehicle.hasDriverSupport) {
      return basePrice + (vehicle.driverFee || 0);
    }
    return basePrice;
  };

  const filteredVehicles = useMemo(() => {
    if (driverFilter === "all") {
      return vehicles;
    } else if (driverFilter === "with-driver") {
      return vehicles.filter((v) => v.hasDriverSupport);
    } else if (driverFilter === "without-driver") {
      return vehicles.filter((v) => !v.hasDriverSupport);
    }
    return vehicles;
  }, [vehicles, driverFilter]);

  return (
    <div className="middle-page">
      <div className="results-page__header">
        <h2>Available Vehicles for You</h2>
        <p>{filteredVehicles.length} vehicles found</p>

        <div className="results-filter">
          <button
            className={`filter-btn ${driverFilter === "all" ? "active" : ""}`}
            onClick={() => setDriverFilter("all")}
          >
            All Vehicles
          </button>
          <button
            className={`filter-btn ${driverFilter === "with-driver" ? "active" : ""}`}
            onClick={() => setDriverFilter("with-driver")}
          >
            With Driver Support
          </button>
          <button
            className={`filter-btn ${driverFilter === "without-driver" ? "active" : ""}`}
            onClick={() => setDriverFilter("without-driver")}
          >
            Without Driver
          </button>
        </div>
      </div>

      <div className="results-grid">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => {
            const finalPrice = calculatePrice(vehicle);

            return (
              <article className="vehicle-card" key={vehicle._id}>
                <div className="vehicle-card__imageWrap">
                  <img
                    src={vehicle.image}
                    className="vehicle-card__image"
                    alt={vehicle.name}
                  />
                </div>

                <div className="vehicle-card__body">
                  <h5 className="vehicle-card__title">{vehicle.name}</h5>
                  <div className="vehicle-card__meta">
                    <p>Location: {vehicle.location}</p>
                    <p>Type: {vehicle.vehicleType}</p>
                    {vehicle.transmission && (
                      <p>Transmission: {vehicle.transmission}</p>
                    )}
                    {vehicle.fuelType && <p>Fuel: {vehicle.fuelType}</p>}
                    {vehicle.capacity && (
                      <p>Capacity: {vehicle.capacity} seats</p>
                    )}
                  </div>

                  {showDriverPricing && vehicle.hasDriverSupport && (
                    <div className="vehicle-card__driver-option">
                      <p className="driver-fee">
                        With driver selected. Driver fee: Rs.{" "}
                        {Number(vehicle.driverFee).toLocaleString()} / day
                      </p>
                    </div>
                  )}

                  {!showDriverPricing && vehicle.hasDriverSupport && (
                    <div className="vehicle-card__driver-option">
                      <p className="driver-fee">
                        Driver available as an add-on.
                      </p>
                    </div>
                  )}

                  <h6 className="vehicle-card__price">
                    Rs. {Number(finalPrice).toLocaleString()} / day
                  </h6>

                  <button className="vehicle-card__button">Book Now</button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="results-empty">
            <h4>No vehicles found matching your criteria.</h4>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchResults;
