import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./confirmBooking.css";

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, owner } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!vehicle || !owner) {
    return (
      <div className="confirm-booking__error">
        <h2>Vehicle information not found.</h2>
        <button onClick={() => navigate("/Vehicles")}>Back to Vehicles</button>
      </div>
    );
  }

  const handleBooking = async () => {
    setLoading(true);
    try {
      // TODO: Implement booking API call
      console.log("Booking vehicle:", vehicle._id);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirm-booking">
      <div className="confirm-booking__container">
        {/* Left Side - Vehicle Image */}
        <div className="confirm-booking__image-section">
          <div className="vehicle-image__wrapper">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="vehicle-image"
            />
          </div>
          <div className="vehicle-info">
            <h2>{vehicle.name}</h2>
            <p className="vehicle-type">{vehicle.vehicleType}</p>
            <span
              className={`vehicle-badge ${
                vehicle.hasDriverSupport
                  ? "vehicle-badge--driver"
                  : "vehicle-badge--no-driver"
              }`}
            >
              {vehicle.hasDriverSupport
                ? "With Driver Support"
                : "Without Driver"}
            </span>
            <div className="vehicle-specs">
              {vehicle.transmission && (
                <span className="spec">
                  <strong>Transmission:</strong> {vehicle.transmission}
                </span>
              )}
              {vehicle.fuelType && (
                <span className="spec">
                  <strong>Fuel:</strong> {vehicle.fuelType}
                </span>
              )}
              {vehicle.capacity && (
                <span className="spec">
                  <strong>Capacity:</strong> {vehicle.capacity} seats
                </span>
              )}
            </div>
            <div className="vehicle-price">
              <h3>Rs. {Number(vehicle.rentPerDay).toLocaleString()} / day</h3>
            </div>
          </div>
        </div>

        {/* Right Side - Owner Details */}
        <div className="confirm-booking__details-section">
          <div className="booking-card">
            <h2>Owner Information</h2>

            <div className="owner-details">
              <div className="detail-item">
                <label>Owner Name</label>
                <p>{owner.name}</p>
              </div>

              <div className="detail-item">
                <label>Email</label>
                <p>{owner.email}</p>
              </div>

              <div className="detail-item">
                <label>Phone Number</label>
                <p>{owner.phoneNumber || "Not provided"}</p>
              </div>

              <div className="detail-item">
                <label>Address</label>
                <p>{owner.address || "Not provided"}</p>
              </div>

              <div className="detail-item">
                <label>Location</label>
                <p>{vehicle.location}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book Now"}
              </button>

              {owner.phoneNumber && (
                <a
                  href={`tel:${owner.phoneNumber}`}
                  className="btn btn-call"
                  title="Call owner"
                >
                  📞 Call Owner
                </a>
              )}

              <a
                href={`mailto:${owner.email}`}
                className="btn btn-email"
                title="Email owner"
              >
                ✉️ Email Owner
              </a>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => navigate("/Vehicles")}
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
