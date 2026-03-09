const express = require("express");
const bcrypt = require("bcrypt");
const QR = require("../models/QRCode");

const router = express.Router();

router.get("/r/:id", async (req, res) => {
  try {
    const qr = await QR.findById(req.params.id);
    if (!qr) {
      return res.status(404).send("Invalid QR");
    }

    if (qr.expiryDate && new Date() > qr.expiryDate) {
      return res.status(410).send("QR expired");
    }

    if (qr.oneTime && qr.scanCount > 0) {
      return res.status(410).send("QR already used");
    }

    if (!qr.payload) {
      qr.payload = qr.text || "";
      if (!qr.type) {
        qr.type = "url";
      }
    }

    if (qr.passwordHash) {
      const password = String(req.query.password || "");
      if (!password) {
        return res.status(401).send(`
          <html>
            <body style="font-family: Arial, sans-serif; margin: 24px;">
              <h2>Password Protected QR</h2>
              <p>This QR code requires a password.</p>
              <form method="GET" action="/r/${qr._id}">
                <input type="password" name="password" placeholder="Enter password" required />
                <button type="submit">Unlock</button>
              </form>
            </body>
          </html>
        `);
      }
      const matches = await bcrypt.compare(password, qr.passwordHash);
      if (!matches) {
        return res.status(401).send("Invalid password");
      }
    }

    qr.scanCount += 1;
    await qr.save();

    if (qr.type === "url" || qr.type === "email" || qr.type === "phone") {
      return res.redirect(qr.payload);
    }

    return res.type("text/plain").send(qr.payload);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
