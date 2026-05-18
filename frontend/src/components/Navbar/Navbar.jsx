import "./Navbar.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import navlogo from "../../assets/navlogo.png";
import { searchVehicles } from "../../service/vehicleService";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleCatalog, setVehicleCatalog] = useState([]);
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

  const profileImage = userInfo?.profileImage || "";

  const vehicleSuggestions = useMemo(() => {
    const names = vehicleCatalog
      .map((vehicle) => vehicle?.name)
      .filter((name) => typeof name === "string" && name.trim());

    return Array.from(new Set(names)).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [vehicleCatalog]);

  const visibleSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return vehicleSuggestions.slice(0, 8);
    }

    return vehicleSuggestions
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [searchQuery, vehicleSuggestions]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
    let isActive = true;

    const loadVehicleCatalog = async () => {
      try {
        const vehicles = await searchVehicles({});
        if (isActive) {
          setVehicleCatalog(Array.isArray(vehicles) ? vehicles : []);
        }
      } catch (error) {
        console.error("Failed to load navbar search suggestions:", error);
      }
    };

    loadVehicleCatalog();

    return () => {
      isActive = false;
    };
  }, []);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setIsProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const handleNavbarSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim().toLowerCase();
    const filteredVehicles = query
      ? vehicleCatalog.filter((vehicle) =>
          vehicle?.name?.toLowerCase().includes(query),
        )
      : vehicleCatalog;

    navigate("/search-results", {
      state: { vehicles: filteredVehicles, rentType: "vehicle" },
    });

    setMobileOpen(false);
  };

  const solidPaths = [
    "/Vehicles",
    "/bookings",
    "/about",
    "/owner",
    "/search-results",
    "/contact",
    "/confirm-booking",
    "/profile",
  ];

  const isSolidPath = solidPaths.includes(location.pathname);
  const navbarVariant =
    isScrolled || isAuthPage || isSolidPath
      ? "navbar--scrolled"
      : "navbar--transparent";

  return (
    <div className={`navbar ${navbarVariant}`}>
      <div className="nav-container">
        <Link to="/" className="logo" aria-label="Car Rental home">
          <img src={navlogo} alt="Car Rental logo" />
          <span className="logo-text">QUICKDRIVE</span>
        </Link>

        <button
          className={`hamburger ${mobileOpen ? "is-open" : ""}`}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={(e) => {
            e.stopPropagation();
            setMobileOpen((v) => !v);
          }}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="nav-middle">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/Vehicles">Vehicles</Link>
            <Link to="/bookings">Bookings</Link>
            <Link to="/about">Who we are</Link>
            <Link to="/owner">Become a Owner</Link>
          </div>

          <div className="nav-search">
            <form className="nav-search__form" onSubmit={handleNavbarSearch}>
              <input
                type="text"
                placeholder="Search vehicle names..."
                list="navbar-vehicle-suggestions"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="nav-search__button">
                Search
              </button>
            </form>
          </div>

          <datalist id="navbar-vehicle-suggestions">
            {visibleSuggestions.map((vehicleName) => (
              <option key={vehicleName} value={vehicleName} />
            ))}
          </datalist>

          <div className="nav-actions" ref={profileMenuRef}>
            {userInfo ? (
              <div className="profile-menu">
                <button
                  type="button"
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen((c) => !c)}
                  aria-expanded={isProfileOpen}
                  aria-label="Open profile menu"
                >
                  <span className="profile-avatar">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="profile-avatar__image"
                      />
                    ) : (
                      displayName.slice(0, 1).toUpperCase()
                    )}
                  </span>
                  <span className="profile-name">{displayName}</span>
                </button>

                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown__header">
                      <span className="profile-dropdown__label">
                        Signed in as
                      </span>
                      <strong>{displayName}</strong>
                    </div>
                    <button
                      type="button"
                      className="profile-dropdown__logout profile-dropdown__logout--secondary"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Edit profile
                    </button>
                    <button
                      type="button"
                      className="profile-dropdown__logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
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

        {mobileOpen && (
          <div
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileOpen(false);
            }}
          >
            <div className="mobile-panel" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-search">
                <form className="mobile-search__form" onSubmit={handleNavbarSearch}>
                  <input
                    type="text"
                    placeholder="Search vehicle names..."
                    list="navbar-vehicle-suggestions"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    autoComplete="off"
                  />
                  <button type="submit" className="mobile-search__button">
                    Search
                  </button>
                </form>
              </div>

              <div className="mobile-links">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
                <Link to="/Vehicles" onClick={() => setMobileOpen(false)}>
                  Vehicles
                </Link>
                <Link to="/bookings" onClick={() => setMobileOpen(false)}>
                  Bookings
                </Link>
                <Link to="/about" onClick={() => setMobileOpen(false)}>
                  Who we are
                </Link>
                <Link to="/owner" onClick={() => setMobileOpen(false)}>
                  Become a Owner
                </Link>
              </div>

              <div className="mobile-actions">
                {userInfo ? (
                  <div className="mobile-user-row">
                    <div className="mobile-user-info">
                      <div className="profile-avatar">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="profile-avatar__image"
                          />
                        ) : (
                          displayName.slice(0, 1).toUpperCase()
                        )}
                      </div>
                      <div className="mobile-profile-name">{displayName}</div>
                    </div>
                    <button
                      type="button"
                      className="mobile-profile-edit"
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Edit profile
                    </button>
                    <button
                      type="button"
                      className="mobile-logout-small"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn btn-login"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-signup"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
