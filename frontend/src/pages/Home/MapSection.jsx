import React from "react";
import "./MapSection.css";

const MapSection = () => {
  return (
    <section className="map-container-section">
      <div className="map-content-wrapper">
        {/* Left Side: Information and Stats */}
        <div className="map-info-panel">
          <span className="location-badge">📍 Islandwide Service</span>
          <h2 className="map-title">
            We're All Over <br /> <span>Sri Lanka</span>
          </h2>
          <p className="map-description">
            Discover premium vehicles across Sri Lanka. Simply explore the map,
            find a car near you, and start your journey in minutes.
          </p>

          <div className="map-highlights">
            <div className="highlight-item">
              <span className="highlight-icon">📍</span>
              <div>
                <h3>Islandwide Coverage</h3>
                <p>Pickups available across major cities</p>
              </div>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">⚡</span>
              <div>
                <h3>Fast Booking</h3>
                <p>Reserve a vehicle in just a few taps</p>
              </div>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">🛟</span>
              <div>
                <h3>24/7 Assistance</h3>
                <p>Support available whenever you need it</p>
              </div>
            </div>
          </div>

          <div className="location-chips">
            <span className="location-chip">Colombo</span>
            <span className="location-chip">Kandy</span>
            <span className="location-chip">Galle</span>
            <span className="location-chip">Jaffna</span>
            <span className="location-chip">Negombo</span>
          </div>
        </div>

        {/* Right Side: Map Placeholder */}
        <div className="map-visual-panel">
          <iframe
            className="map-placeholder"
            title="QuickDrive Sri Lanka map"
            src="https://www.google.com/maps?q=Sri+Lanka&z=7&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
