import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../service/api";
import "./confirmBooking.css";

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, owner } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ownerOpen, setOwnerOpen] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(true);
  const [wantDriver, setWantDriver] = useState(false);
  const [availabilityState, setAvailabilityState] = useState("idle");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const bookingDays = useMemo(() => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return Number.isFinite(diff) && diff > 0 ? diff : 1;
  }, [startDate, endDate]);

  const includedKmPerDay = Number(
    vehicle.KMPerDay ?? vehicle.kmPerDay ?? vehicle.includedKmPerDay ?? 0,
  );
  const extraKmRate = Number(
    vehicle.extraChargesperkm ?? vehicle.extraKmRate ?? 0,
  );
  const driverFeePerDay = Number(vehicle.driverFee ?? 0);
  const baseRentTotal = Number(vehicle.rentPerDay || 0) * bookingDays;
  const driverTotal = wantDriver ? driverFeePerDay * bookingDays : 0;
  const estimatedTotal = baseRentTotal + driverTotal;

  useEffect(() => {
    let active = true;

    const checkDateAvailability = async () => {
      if (!startDate || !endDate) {
        setAvailabilityState("idle");
        setAvailabilityMessage("");
        return;
      }

      setAvailabilityState("checking");

      try {
        const response = await api.get("/bookings/check-availability", {
          params: {
            vehicleId: vehicle._id,
            startDate,
            endDate,
          },
        });

        if (!active) return;

        if (response.data?.available) {
          setAvailabilityState("available");
          setAvailabilityMessage("Vehicle is available for these dates.");
        } else {
          setAvailabilityState("unavailable");
          setAvailabilityMessage(
            "Vehicle already booked. Please choose another date for your vehicle.",
          );
        }
      } catch (error) {
        if (!active) return;
        console.error("Availability check failed:", error);
        setAvailabilityState("idle");
        setAvailabilityMessage("");
      }
    };

    checkDateAvailability();

    return () => {
      active = false;
    };
  }, [startDate, endDate, vehicle._id]);

  if (!vehicle || !owner) {
    return (
      <div className="confirm-booking__error">
        <h2>Vehicle information not found.</h2>
        <button onClick={() => navigate("/Vehicles")}>Back to Vehicles</button>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please choose start and end dates first.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vehicleId: vehicle._id,
        startDate,
        endDate,
        totalPrice: estimatedTotal,
        notes: wantDriver ? "Driver requested" : "No driver requested",
      };

      const response = await api.post("/bookings", payload);
      console.log("Booking saved:", response.data);
      alert("Booking saved successfully.");
      navigate("/Vehicles");
    } catch (error) {
      console.error("Booking error:", error);
      alert(error?.response?.data?.message || "Failed to save booking.");
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
            <div className="booking-accordion">
              <button
                type="button"
                className="booking-accordion__toggle"
                onClick={() => setOwnerOpen((open) => !open)}
                aria-expanded={ownerOpen}
              >
                <span>Owner Information</span>
                <span
                  className={`booking-accordion__icon ${ownerOpen ? "is-open" : ""}`}
                >
                  ▾
                </span>
              </button>

              {ownerOpen && (
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
              )}
            </div>

            <div className="booking-accordion">
              <button
                type="button"
                className="booking-accordion__toggle"
                onClick={() => setBookingOpen((open) => !open)}
                aria-expanded={bookingOpen}
              >
                <span>Payment Details</span>
                <span
                  className={`booking-accordion__icon ${bookingOpen ? "is-open" : ""}`}
                >
                  ▾
                </span>
              </button>

              {bookingOpen && (
                <div className="owner-details">
                  <div className="detail-item">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="booking-date-input"
                    />
                  </div>

                  <div className="detail-item">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="booking-date-input"
                    />
                  </div>

                  <div className="detail-item">
                    <label>Booking Dates</label>
                    <p>
                      {startDate && endDate
                        ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                        : "Select start and end date"}
                    </p>
                    {availabilityMessage && (
                      <span
                        className={`booking-availability-message ${availabilityState === "unavailable" ? "is-unavailable" : "is-available"}`}
                      >
                        {availabilityMessage}
                      </span>
                    )}
                  </div>

                  <div className="detail-item">
                    <label>Rental Days</label>
                    <p>
                      {bookingDays} day{bookingDays > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="detail-item">
                    <label>Daily Rate</label>
                    <p>
                      Rs. {Number(vehicle.rentPerDay || 0).toLocaleString()} /
                      day
                    </p>
                  </div>

                  <div className="detail-item">
                    <label>Included KM Per Day</label>
                    <p>{includedKmPerDay || "Not provided"} km</p>
                  </div>

                  <div className="detail-item">
                    <label>Extra KM Fee</label>
                    <p>
                      {extraKmRate
                        ? `Rs. ${extraKmRate.toLocaleString()} / km`
                        : "Not provided"}
                    </p>
                  </div>

                  <div className="detail-item">
                    <label>Want Driver</label>
                    <div className="booking-checkbox-row">
                      <input
                        id="want-driver"
                        type="checkbox"
                        checked={wantDriver}
                        onChange={(e) => setWantDriver(e.target.checked)}
                        disabled={!vehicle.hasDriverSupport}
                      />
                      <label htmlFor="want-driver">
                        {vehicle.hasDriverSupport
                          ? `Add driver fee (Rs. ${driverFeePerDay.toLocaleString()} / day)`
                          : "Driver not available for this vehicle"}
                      </label>
                    </div>
                  </div>

                  {wantDriver && (
                    <div className="detail-item">
                      <label>Driver Fee Total</label>
                      <p>Rs. {driverTotal.toLocaleString()}</p>
                    </div>
                  )}

                  <div className="detail-note">
                    Note: You pay only for the booked days. If you exceed the
                    included km per day, extra km charges will be added when you
                    hand over the vehicle.
                  </div>

                  <div className="detail-item detail-item--total">
                    <label>Estimated Total</label>
                    <p>Rs. {estimatedTotal.toLocaleString()}</p>
                  </div>
                </div>
              )}
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
