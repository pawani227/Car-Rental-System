const express = require("express");
const connectDB = require("./config/db");
const vehicleRoute = require("./routes/vehicleRoute");
const userRoute = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

// 1. DB connect
connectDB();

// 2. Middleware (මෙය අනිවාර්යයෙන්ම Routes වලට කලින් තිබිය යුතුයි)
app.use(cors());
app.use(express.json());

// 3. Routes
app.use("/api/vehicles", vehicleRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
