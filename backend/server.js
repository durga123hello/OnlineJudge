const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/problems", require("./routes/problemRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});