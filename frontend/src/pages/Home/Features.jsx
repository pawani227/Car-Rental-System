import React from "react";
import "./Features.css";

const Features = () => {
  const featureData = [
    {
      id: 1,
      title: "Trusted Protection",
      description:
        "Enjoy peace of mind with our verified vehicles and secure booking process for every journey.",
      icon: "bi-shield-check", // Bootstrap icon එකක්
    },
    {
      id: 2,
      title: "Seamless Booking",
      description:
        "No hidden fees. What you see is what you pay with instant confirmation and flexible options.",
      icon: "bi-calendar-check",
    },
    {
      id: 3,
      title: "24/7 Real Support",
      description:
        "Our dedicated support team is always ready to assist you, whether you are on the road or online.",
      icon: "bi-headset",
    },
  ];

  return (
    <section className="features-section py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-3">Safe, Flexible & Supported Car Rentals</h2>
        <p className="text-muted mb-5">
          Book, collect and drive. We take care of the rest for your perfect
          trip.
        </p>

        <div className="row g-4">
          {featureData.map((feature) => (
            <div className="col-md-4" key={feature.id}>
              <div className="feature-card p-4">
                <div className="icon-wrapper mb-4">
                  <i
                    className={`bi ${feature.icon} display-4 text-primary`}
                  ></i>
                </div>
                <h4 className="fw-bold mb-3">{feature.title}</h4>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
