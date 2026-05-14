const express = require("express");
const connectDB = require("./config/db");
const vehicleRoute = require("./routes/vehicleRoute");
const userRoute = require("./routes/userRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const cors = require("cors");

const app = express();

// 1. DB connect
connectDB();

// 2. Middleware (මෙය අනිවාර්යයෙන්ම Routes වලට කලින් තිබිය යුතුයි)
app.use(cors());
// Allow larger JSON payloads for profile image data URLs (base64)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. Routes
app.use("/api/vehicles", vehicleRoute);
app.use("/api/users", userRoute);
app.use("/api/reviews", reviewRoute);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// debug: list mounted routes
app.get("/routes", (req, res) => {
  try {
    const routes = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        routes.push(middleware.route.path);
      } else if (
        middleware.name === "router" &&
        middleware.handle &&
        middleware.handle.stack
      ) {
        middleware.handle.stack.forEach(function (handler) {
          const route = handler.route;
          route && routes.push(route.path);
        });
      }
    });
    res.json([...new Set(routes)].sort());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
