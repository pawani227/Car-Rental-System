import React from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const vehicles = location.state?.vehicles || [];

  return (
    <div className="results-page">
      <div className="results-page__header">
        <h2>Available Vehicles for You</h2>
        <p>{vehicles.length} vehicles found</p>
      </div>

      <div className="results-grid">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
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
                  <h6>
                    Rs. {Number(vehicle.rentPerDay).toLocaleString()} / day
                  </h6>
                </div>

                <button className="vehicle-card__button">Book Now</button>
              </div>
            </article>
          ))
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
