require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const qrRoutes = require("./routes/qrRoutes");
const redirectRoutes = require("./routes/redirectRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// routes
app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);
app.use("/", redirectRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
