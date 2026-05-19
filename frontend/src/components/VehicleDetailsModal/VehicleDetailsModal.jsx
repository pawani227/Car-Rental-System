import React, { useEffect, useMemo, useState } from "react";
import api from "../../service/api";
import "./VehicleDetailsModal.css";

const featureIcons = {
  AC: "❄️",
  gps: "📍",
  bluetooth: "🔊",
  parking: "🅿️",
  childSeat: "👶",
  automatic: "⚙️",
};

const Stars = ({ value = 0 }) => {
  const full = Math.round(value);
  return (
    <div className="vmodal-rating" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "star-full" : "star-empty"}>
          ★
        </span>
      ))}
    </div>
  );
};

const VehicleDetailsModal = ({ vehicle, onClose }) => {
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [fullImage, setFullImage] = useState(null);

  const kmLimit = vehicle.KMPerDay ?? vehicle.kmPerDay ?? vehicle.includedKmPerDay;
  const extraKmRate = vehicle.extraChargesperkm ?? vehicle.extraKmRate;

  useEffect(() => {
    let mounted = true;
    const loadRatings = async () => {
      try {
        // fetch reviews for this specific vehicle by id
        const res = await api.get(`/reviews?vehicleId=${vehicle._id}`);
        if (!mounted) return;

        const matched = Array.isArray(res.data) ? res.data : [];

        if (matched.length === 0) {
          setAvgRating(0);
          setRatingCount(0);
          return;
        }

        const sum = matched.reduce((s, r) => s + Number(r.rating || 0), 0);
        setAvgRating(sum / matched.length);
        setRatingCount(matched.length);
      } catch (err) {
        console.error("Failed to load ratings:", err);
      }
    };

    loadRatings();
    return () => {
      mounted = false;
    };
  }, [vehicle]);

  const images = useMemo(() => {
    if (Array.isArray(vehicle.images) && vehicle.images.length > 0)
      return vehicle.images;
    if (vehicle.image) return [vehicle.image];
    return [];
  }, [vehicle]);

  const defaultFeaturesByType = {
    Sedan: ["AC", "gps", "bluetooth"],
    SUV: ["AC", "gps", "bluetooth", "parking"],
    Van: ["AC", "parking", "childSeat"],
    Truck: ["gps", "parking"],
    Bike: ["gps"],
  };

  const features =
    Array.isArray(vehicle.features) && vehicle.features.length > 0
      ? vehicle.features
      : vehicle.features
        ? [vehicle.features]
        : defaultFeaturesByType[vehicle.vehicleType] || [];

  const requiredDocs = Array.isArray(vehicle.requiredDocuments)
    ? vehicle.requiredDocuments
    : vehicle.requiredDocuments
      ? [vehicle.requiredDocuments]
      : ["ID copy"];

  return (
    <div className="vmodal-overlay" onClick={onClose} role="dialog" aria-modal>
      <div
        className="vmodal-panel"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <header className="vmodal-header">
          <div>
            <h3>{vehicle.name}</h3>
            <div className="vmodal-rating-row">
              <Stars value={avgRating} />
              <span className="vmodal-rating-count">{ratingCount} reviews</span>
            </div>
          </div>

          <button className="vmodal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="vmodal-body">
          <div className="vmodal-image">
            {images.length > 0 ? (
              <>
                <img
                  src={images[0]}
                  alt={vehicle.name}
                  onClick={() => setFullImage(images[0])}
                />
                {images.length > 1 && (
                  <div className="vmodal-thumb-row">
                    {images.map((src, idx) => (
                      <img
                        key={src + idx}
                        src={src}
                        alt={`${vehicle.name} ${idx + 1}`}
                        className="vmodal-thumb"
                        onClick={() => setFullImage(src)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="vmodal-placeholder">No image</div>
            )}
          </div>

          <div className="vmodal-details">
            <section className="vmodal-section">
              <h4>Vehicle Overview</h4>
              <div className="vmodal-info-grid">
                <div className="vmodal-info-item">
                  <span className="vmodal-info-label">Type</span>
                  <span className="vmodal-info-value">{vehicle.vehicleType || "-"}</span>
                </div>
                <div className="vmodal-info-item">
                  <span className="vmodal-info-label">Location</span>
                  <span className="vmodal-info-value">{vehicle.location || "-"}</span>
                </div>
                {vehicle.year && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Year</span>
                    <span className="vmodal-info-value">{vehicle.year}</span>
                  </div>
                )}
                {vehicle.capacity && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Capacity</span>
                    <span className="vmodal-info-value">{vehicle.capacity} seats</span>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Transmission</span>
                    <span className="vmodal-info-value">{vehicle.transmission}</span>
                  </div>
                )}
                {vehicle.fuelType && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Fuel</span>
                    <span className="vmodal-info-value">{vehicle.fuelType}</span>
                  </div>
                )}
              </div>
            </section>

            <section className="vmodal-section">
              <h4>Features</h4>
              <div className="vmodal-feature-list">
                {features.map((f) => (
                  <div className="vmodal-feature" key={f} title={f}>
                    <span className="vmodal-feature-icon">
                      {featureIcons[f] || "🔹"}
                    </span>
                    <span className="vmodal-feature-label">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="vmodal-section">
              <h4>Pricing & Limits</h4>
              <div className="vmodal-info-grid">
                <div className="vmodal-info-item vmodal-info-item--highlight">
                  <span className="vmodal-info-label">Price per day</span>
                  <span className="vmodal-info-value">
                    Rs. {Number(vehicle.rentPerDay || 0).toLocaleString()}
                  </span>
                </div>
                {vehicle.mileage && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Mileage</span>
                    <span className="vmodal-info-value">{vehicle.mileage} km/l</span>
                  </div>
                )}
                {kmLimit != null && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Included km per day</span>
                    <span className="vmodal-info-value">{kmLimit} km</span>
                  </div>
                )}
                {extraKmRate != null && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Extra km fee</span>
                    <span className="vmodal-info-value">
                      Rs. {Number(extraKmRate).toLocaleString()} / km
                    </span>
                  </div>
                )}
                <div className="vmodal-info-item">
                  <span className="vmodal-info-label">Driver support</span>
                  <span className="vmodal-info-value">
                    {vehicle.hasDriverSupport ? "Yes" : "No"}
                  </span>
                </div>
                {vehicle.driverFee != null && (
                  <div className="vmodal-info-item">
                    <span className="vmodal-info-label">Driver fee</span>
                    <span className="vmodal-info-value">
                      Rs. {Number(vehicle.driverFee).toLocaleString()} / day
                    </span>
                  </div>
                )}
              </div>
            </section>

            <section className="vmodal-section vmodal-docs">
              <h4>Required at pickup</h4>
              <ul>
                {requiredDocs.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </section>

            {vehicle.description && (
              <section className="vmodal-section vmodal-desc">
                <h4>Notes</h4>
                <p>{vehicle.description}</p>
              </section>
            )}
          </div>
        </div>

        <footer className="vmodal-footer">
          <button className="vmodal-close-btn" onClick={onClose}>
            Close
          </button>
        </footer>

        {fullImage && (
          <div className="vmodal-fullscreen" onClick={() => setFullImage(null)}>
            <img src={fullImage} alt="full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
