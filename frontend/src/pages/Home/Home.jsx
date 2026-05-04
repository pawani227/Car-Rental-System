import { useState } from "react";
import "./Home.css";
import homeBg from "../../assets/homebg.jpg";
import { searchVehicles } from "../../service/vehicleService";

function HomePage() {
  const [rentType, setRentType] = useState("vehicle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      const searchParams = {
        vehicleType: formData.get("vehicle"),
        location: formData.get("location"),
        startDate: formData.get("start"),
        endDate: formData.get("end"),
        rentType: rentType,
      };

      const results = await searchVehicles(searchParams);
      console.log("Search results:", results);
      // TODO: Navigate to results page or show results on page
    } catch (err) {
      setError(err.message || "Search failed");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page" style={{ backgroundImage: `url(${homeBg})` }}>
      <div className="home-overlay">
        <h1>Book Your Vehicle Easily</h1>

        <form className="search-card" onSubmit={handleSearch}>
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

          <div className="field field--large">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="City, airport, or address"
            />
          </div>

          <div className="field">
            <label>Start</label>
            <input type="datetime-local" name="start" />
          </div>

          <div className="field">
            <label>End</label>
            <input type="datetime-local" name="end" />
          </div>

          <div className="field field--action">
            <button className="btn btn-search" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "#dc2626",
                marginTop: "8px",
              }}
            >
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default HomePage;
