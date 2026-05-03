const express = require("express");
const connectDB = require("./config/db"); // path correct කරගන්න

const app = express();

// DB connect
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
