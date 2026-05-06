import "./Navbar.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import navlogo from "../../assets/navlogo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const isAuthPage = ["/search-results", "/login", "/register"].includes(
    location.pathname,
  );

  const displayName = useMemo(() => {
    if (!userInfo) return "";
    return userInfo.username || userInfo.name || "User";
  }, [userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const syncUser = () => {
      const storedUser = localStorage.getItem("userInfo");
      setUserInfo(storedUser ? JSON.parse(storedUser) : null);
      setIsProfileOpen(false);
    };

    handleScroll();
    syncUser();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", syncUser);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <div
      className={`navbar ${isScrolled || isAuthPage || location.pathname === "/Vehicles" ? "navbar--scrolled" : "navbar--transparent"}`}
    >
      <div className="nav-container">
        <Link to="/" className="logo" aria-label="Car Rental home">
          <img src={navlogo} alt="Car Rental logo" />
          <span className="logo-text">QUICKDRIVE</span>
        </Link>
        <div className="nav-middle">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/Vehicles">Vehicles</Link>
            <Link to="/bookings">Bookings</Link>
            <Link to="/about">Who we are</Link>
            <Link to="/owner">Become a Owner</Link>
          </div>

          <div className="nav-search">
            <input type="text" placeholder="Search cars..." />
          </div>

          <div className="nav-actions" ref={profileMenuRef}>
            {userInfo ? (
              <div className="profile-menu">
                <button
                  type="button"
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen((current) => !current)}
                  aria-expanded={isProfileOpen}
                  aria-label="Open profile menu"
                >
                  <span className="profile-avatar">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="profile-name">{displayName}</span>
                </button>

                {isProfileOpen ? (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown__header">
                      <span className="profile-dropdown__label">
                        Signed in as
                      </span>
                      <strong>{displayName}</strong>
                    </div>
                    <button
                      type="button"
                      className="profile-dropdown__logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-login">
                  Login
                </Link>
                <Link to="/register" className="btn btn-signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
