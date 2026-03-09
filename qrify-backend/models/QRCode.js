const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["url", "text", "email", "phone", "wifi", "contact"],
    required: true,
  },
  payload: {
    type: String,
    required: true,
  },
  scanCount: {
    type: Number,
    default: 0,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  oneTime: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QRCode", qrSchema);
