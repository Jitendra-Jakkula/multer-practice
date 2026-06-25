const mongoose = require("mongoose");
function DB() {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/miniproj");
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
  }
}

module.exports = DB;
