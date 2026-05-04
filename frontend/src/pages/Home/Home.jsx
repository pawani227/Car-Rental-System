import { useState } from "react";
import "./Home.css";
import homeBg from "../../assets/homebg.jpg";

function HomePage() {
  const [rentType, setRentType] = useState("vehicle");

  return (
    <div className="home-page" style={{ backgroundImage: `url(${homeBg})` }}>
      <div className="home-overlay">
        <h1>Book Your Vehicle Easily</h1>

        <form className="search-card" onSubmit={(e) => e.preventDefault()}>
          <div className="rent-toggle" role="tablist" aria-label="Rent type">
            <button
              type="button"
              className={rentType === "vehicle" ? "seg-btn active" : "seg-btn"}
              onClick={() => setRentType("vehicle")}
            >
              Vehicle only
            </button>
            <button
              type="button"
              className={rentType === "driver" ? "seg-btn active" : "seg-btn"}
              onClick={() => setRentType("driver")}
            >
              With driver
            </button>
          </div>

          <input type="hidden" name="rentType" value={rentType} />

          <div className="field">
            <label>Vehicle Type</label>
            <select name="vehicle">
              <option value="any">Any</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </div>

          <div className="field">
            <label>Start</label>
            <input type="datetime-local" name="start" />
          </div>

          <div className="field">
            <label>End</label>
            <input type="datetime-local" name="end" />
          </div>

          <div className="field field--large">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, airport, or address"
            />
          </div>

          <div className="field field--action">
            <button className="btn btn-search" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomePage;
