import "./Navbar.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import navlogo from "../../assets/navlogo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isResultsPage = location.pathname === "/search-results";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`navbar ${isScrolled || isResultsPage ? "navbar--scrolled" : "navbar--transparent"}`}
    >
      <div className="nav-container">
        <a href="/" className="logo" aria-label="Car Rental home">
          <img src={navlogo} alt="Car Rental logo" />
          <span className="logo-text">QUICKDRIVE</span>
        </a>
        <div className="nav-middle">
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="#">Vehicles</a>
            <a href="#">Bookings</a>
            <a href="#">Contact</a>
            <a href="#">Our Services</a>
          </div>

          <div className="nav-search">
            <input type="text" placeholder="Search cars..." />
          </div>

          <div className="nav-actions">
            <button className="btn btn-login">Login</button>
            <button className="btn btn-signup">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
