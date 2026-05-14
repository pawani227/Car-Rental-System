import { useEffect, useState } from "react";
import api from "../../service/api";
import "./ReviewsSection.css";

const defaultReviews = [
  {
    id: 1,
    name: "Nimal Perera",
    location: "Colombo",
    rating: 5,
    comment:
      "Booking was quick and the vehicle was clean. The process felt smooth from start to finish.",
  },
  {
    id: 2,
    name: "Anushka Silva",
    location: "Kandy",
    rating: 5,
    comment:
      "Great support team and very easy to find cars near me. The map section makes it simple.",
  },
  {
    id: 3,
    name: "Ravindu Jayasuriya",
    location: "Galle",
    rating: 4,
    comment:
      "Nice modern site design and the rental flow is straightforward. I would book again.",
  },
];

const storageKey = "quickdrive-reviews";

function ReviewsSection() {
  const [reviews, setReviews] = useState(defaultReviews);
  const [showAll, setShowAll] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/reviews");
        if (mounted && Array.isArray(res.data)) setReviews(res.data);
      } catch (err) {
        // fallback to defaults on error
        if (mounted) setReviews(defaultReviews);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.comment.trim()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      location: formData.location.trim() || "Sri Lanka",
      rating: formData.rating,
      comment: formData.comment.trim(),
    };

    // attach user id if available in localStorage
    try {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.id) payload.userId = user.id;
      }
    } catch {}

    (async () => {
      try {
        const res = await api.post("/reviews", payload);
        if (res && res.data) {
          setReviews((current) => [res.data, ...current]);
          setFormData({ name: "", location: "", rating: 5, comment: "" });
        }
      } catch (err) {
        // on error, still optimistically add to list
        const newReview = {
          id: Date.now(),
          ...payload,
        };
        setReviews((current) => [newReview, ...current]);
        setFormData({ name: "", location: "", rating: 5, comment: "" });
      }
    })();
  };

  return (
    <section className="reviews-section">
      <div className="reviews-shell">
        <div className="reviews-header">
          <span className="reviews-badge">Customer reviews</span>
          <h2>What people say about QuickDrive</h2>
          <p>
            Share your experience and see what other travelers are saying about
            their bookings.
          </p>
        </div>

        <div className="reviews-layout">
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-form-head">
              <h3>Add Your Review</h3>
              <p>Leave a short review after your ride or booking.</p>
            </div>

            <label>
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </label>

            <label>
              Location
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Colombo, Kandy, etc."
              />
            </label>

            <label>
              Rating
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Okay</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
            </label>

            <label>
              Review
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Tell us about your booking experience..."
                rows="5"
              />
            </label>

            <button type="submit">Post Review</button>
          </form>

          <div className="reviews-list-panel">
            <div className="reviews-list-head">
              <h3>Latest reviews</h3>
              <span>{reviews.length} total</span>
            </div>

            <div className="reviews-grid">
              {(showAll ? reviews : reviews.slice(0, 4)).map((review, idx) => (
                <article
                  className="review-card"
                  key={review._id || review.id || idx}
                >
                  <div className="review-card-top">
                    <div>
                      <h4>{review.name}</h4>
                      <p>{review.location}</p>
                    </div>
                    {reviews.length > 4 && (
                      <div className="reviews-toggle">
                        <button
                          type="button"
                          className="see-more-btn"
                          onClick={() => setShowAll((s) => !s)}
                        >
                          {showAll
                            ? "Show less"
                            : `See more (${reviews.length - 4})`}
                        </button>
                      </div>
                    )}
                    <div
                      className="review-stars"
                      aria-label={`${review.rating} star rating`}
                    >
                      {"★".repeat(review.rating)}
                      <span className="review-stars-muted">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="review-comment">“{review.comment}”</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
