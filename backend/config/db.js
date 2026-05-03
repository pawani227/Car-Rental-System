const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/rent_db");

    console.log(`✅ MongoDB Connected Successful: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
