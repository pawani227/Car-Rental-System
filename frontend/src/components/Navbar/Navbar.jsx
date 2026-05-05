import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import navlogo from "../../assets/navlogo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAuthPage = ["/search-results", "/login", "/register"].includes(
    location.pathname,
  );

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
      className={`navbar ${isScrolled || isAuthPage ? "navbar--scrolled" : "navbar--transparent"}`}
    >
      <div className="nav-container">
        <Link to="/" className="logo" aria-label="Car Rental home">
          <img src={navlogo} alt="Car Rental logo" />
          <span className="logo-text">QUICKDRIVE</span>
        </Link>
        <div className="nav-middle">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <a href="#">Vehicles</a>
            <a href="#">Bookings</a>
            <a href="#">Contact</a>
            <a href="#">Our Services</a>
          </div>

          <div className="nav-search">
            <input type="text" placeholder="Search cars..." />
          </div>

          <div className="nav-actions">
            <Link to="/login" className="btn btn-login">
              Login
            </Link>
            <Link to="/register" className="btn btn-signup">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
