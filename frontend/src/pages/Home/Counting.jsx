import { useEffect, useRef, useState } from "react";
import "./Counting.css";
import countingBg from "../../assets/homebg.jpg";

function Counting() {
  const [counts, setCounts] = useState({ bookings: 0, customers: 0, cars: 0 });
  const sectionRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          animateCounts();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const animateCounts = () => {
    const targets = { bookings: 1250, customers: 5400, cars: 320 };
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);

      setCounts({
        bookings: Math.floor(targets.bookings * progress),
        customers: Math.floor(targets.customers * progress),
        cars: Math.floor(targets.cars * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  return (
    <section
      className="counting-section"
      ref={sectionRef}
      style={{ backgroundImage: `url(${countingBg})` }}
    >
      <div className="counting-overlay" />

      <div className="counting-shell">
        <div className="counting-copy">
          <span className="counting-badge">QuickDrive in numbers</span>
          <h2>Trusted by thousands across the island</h2>
          <p>
            A smooth booking flow, a large fleet, and support that stays with
            you from pickup to return.
          </p>

          <div className="counting-stats">
            <div className="count-card">
              <span className="count-value">
                {counts.bookings.toLocaleString()}+
              </span>
              <span className="count-label">Bookings</span>
            </div>
            <div className="count-card">
              <span className="count-value">
                {counts.customers.toLocaleString()}+
              </span>
              <span className="count-label">Happy customers</span>
            </div>
            <div className="count-card">
              <span className="count-value">{counts.cars}+</span>
              <span className="count-label">Vehicles</span>
            </div>
          </div>
        </div>

        <div className="counting-icons">
          <div className="floating-icon floating-icon--one">
            <i className="bi bi-car-front-fill" />
          </div>
          <div className="floating-icon floating-icon--two">
            <i className="bi bi-calendar-check-fill" />
          </div>
          <div className="floating-icon floating-icon--three">
            <i className="bi bi-geo-alt-fill" />
          </div>
          <div className="floating-icon floating-icon--four">
            <i className="bi bi-headset" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Counting;
