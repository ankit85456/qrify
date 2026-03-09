const express = require("express");
const bcrypt = require("bcrypt");
const QR = require("../models/QRCode");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const buildPayload = (type, body) => {
  switch (type) {
    case "url":
      return body.text?.trim();
    case "text":
      return body.text?.trim();
    case "email": {
      const email = body.email?.trim();
      const subject = encodeURIComponent(body.subject || "");
      const message = encodeURIComponent(body.message || "");
      const qs = `subject=${subject}&body=${message}`;
      return `mailto:${email}?${qs}`;
    }
    case "phone":
      return `tel:${body.phone?.trim()}`;
    case "wifi": {
      const ssid = body.ssid || "";
      const wifiPassword = body.wifiPassword || "";
      const encryption = (body.encryption || "WPA").toUpperCase();
      return `WIFI:T:${encryption};S:${ssid};P:${wifiPassword};;`;
    }
    case "contact": {
      const name = body.name || "";
      const phone = body.phone || "";
      const email = body.email || "";
      const org = body.org || "";
      const url = body.url || "";
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${name}`,
        `ORG:${org}`,
        `TEL:${phone}`,
        `EMAIL:${email}`,
        `URL:${url}`,
        "END:VCARD",
      ].join("\n");
    }
    default:
      return null;
  }
};

const validateCreateRequest = (type, body) => {
  if (!["url", "text", "email", "phone", "wifi", "contact"].includes(type)) {
    return "Invalid type";
  }

  if (type === "url" && !body.text) return "URL is required";
  if (type === "text" && !body.text) return "Text is required";
  if (type === "email" && !body.email) return "Email is required";
  if (type === "phone" && !body.phone) return "Phone number is required";
  if (type === "wifi" && !body.ssid) return "WiFi SSID is required";
  if (type === "contact" && !body.name) return "Contact name is required";

  return null;
};

const serializeQr = (req, qr) => ({
  _id: qr._id,
  text: qr.text,
  type: qr.type,
  payload: qr.payload,
  scanCount: qr.scanCount,
  expiryDate: qr.expiryDate,
  oneTime: qr.oneTime,
  hasPassword: Boolean(qr.passwordHash),
  createdAt: qr.createdAt,
  metadata: qr.metadata || {},
  shortUrl: `${req.protocol}://${req.get("host")}/r/${qr._id}`,
});

router.post("/create", auth, async (req, res) => {
  try {
    const type = String(req.body.type || "text").toLowerCase();
    const validationError = validateCreateRequest(type, req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const payload = buildPayload(type, req.body);
    if (!payload) {
      return res.status(400).json({ message: "Unable to generate payload" });
    }

    const passwordHash = req.body.password
      ? await bcrypt.hash(String(req.body.password), 10)
      : null;

    const qr = await QR.create({
      userId: req.user.id,
      text: req.body.text || req.body.email || req.body.phone || req.body.ssid || req.body.name,
      type,
      payload,
      expiryDate: req.body.expiryDate || null,
      passwordHash,
      oneTime: Boolean(req.body.oneTime),
      metadata: {
        subject: req.body.subject || "",
        message: req.body.message || "",
        encryption: req.body.encryption || "",
        name: req.body.name || "",
        email: req.body.email || "",
        phone: req.body.phone || "",
        org: req.body.org || "",
        url: req.body.url || "",
        ssid: req.body.ssid || "",
      },
    });

    const shortUrl = `${req.protocol}://${req.get("host")}/r/${qr._id}`;
    return res.status(201).json({
      message: "QR created successfully",
      qr: serializeQr(req, qr),
      shortUrl,
      qrValue: shortUrl,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/myqr", auth, async (req, res) => {
  try {
    const qrs = await QR.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(qrs.map((qr) => serializeQr(req, qr)));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
