import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

const initialForm = {
  type: "url",
  text: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
  ssid: "",
  wifiPassword: "",
  encryption: "WPA",
  name: "",
  org: "",
  url: "",
  expiryDate: "",
  password: "",
  oneTime: false,
};

function QRGenerator() {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [createdQr, setCreatedQr] = useState(null);

  const previewValue = useMemo(() => {
    if (createdQr?.shortUrl) return createdQr.shortUrl;

    if (form.type === "url" || form.type === "text") return form.text || " ";
    if (form.type === "email") return form.email ? `mailto:${form.email}` : " ";
    if (form.type === "phone") return form.phone ? `tel:${form.phone}` : " ";
    if (form.type === "wifi") return form.ssid ? `WIFI:T:${form.encryption};S:${form.ssid};P:${form.wifiPassword};;` : " ";
    if (form.type === "contact") return form.name || " ";

    return " ";
  }, [createdQr, form]);

  const updateField = (key, value) => {
    setCreatedQr(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveQr = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const payload = {
      type: form.type,
      text: form.text,
      email: form.email,
      subject: form.subject,
      message: form.message,
      phone: form.phone,
      ssid: form.ssid,
      wifiPassword: form.wifiPassword,
      encryption: form.encryption,
      name: form.name,
      org: form.org,
      url: form.url,
      expiryDate: form.expiryDate || null,
      password: form.password || null,
      oneTime: form.oneTime,
    };

    try {
      setIsSaving(true);
      const res = await axios.post("http://localhost:5000/api/qr/create", payload, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setCreatedQr(res.data.qr);
      alert(res.data.message || "QR saved successfully");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Save failed";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="panel generator-layout">
        <div className="generator-form">
          <h2>Generate QR</h2>

          <div className="field">
            <label>QR Type</label>
            <select value={form.type} onChange={(e) => updateField("type", e.target.value)}>
              <option value="url">URL</option>
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="wifi">WiFi</option>
              <option value="contact">Contact Card</option>
            </select>
          </div>

          {(form.type === "url" || form.type === "text") && (
            <div className="field">
              <label>{form.type === "url" ? "URL" : "Text"}</label>
              <input
                placeholder={form.type === "url" ? "https://example.com" : "Enter text"}
                value={form.text}
                onChange={(e) => updateField("text", e.target.value)}
              />
            </div>
          )}

          {form.type === "email" && (
            <>
              <div className="field">
                <label>Recipient Email</label>
                <input
                  placeholder="receiver@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Subject</label>
                <input
                  placeholder="Email subject"
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Message</label>
                <input
                  placeholder="Email body"
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                />
              </div>
            </>
          )}

          {form.type === "phone" && (
            <div className="field">
              <label>Phone Number</label>
              <input
                placeholder="+91..."
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          )}

          {form.type === "wifi" && (
            <>
              <div className="field">
                <label>WiFi SSID</label>
                <input
                  placeholder="Network name"
                  value={form.ssid}
                  onChange={(e) => updateField("ssid", e.target.value)}
                />
              </div>
              <div className="field">
                <label>WiFi Password</label>
                <input
                  placeholder="WiFi password"
                  value={form.wifiPassword}
                  onChange={(e) => updateField("wifiPassword", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Encryption</label>
                <select value={form.encryption} onChange={(e) => updateField("encryption", e.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>
            </>
          )}

          {form.type === "contact" && (
            <>
              <div className="field">
                <label>Full Name</label>
                <input
                  placeholder="Contact name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Organization</label>
                <input
                  placeholder="Company"
                  value={form.org}
                  onChange={(e) => updateField("org", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  placeholder="contact@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Phone</label>
                <input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Website URL</label>
                <input
                  placeholder="https://"
                  value={form.url}
                  onChange={(e) => updateField("url", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="field">
            <label>Expiry Date (Optional)</label>
            <input
              type="datetime-local"
              value={form.expiryDate}
              onChange={(e) => updateField("expiryDate", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password Protection (Optional)</label>
            <input
              type="password"
              placeholder="QR access password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={form.oneTime}
              onChange={(e) => updateField("oneTime", e.target.checked)}
            />
            One-time QR (valid only for first scan)
          </label>

          <div className="actions">
            <button className="btn btn-primary" onClick={saveQr} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save QR"}
            </button>
            <Link className="btn btn-ghost" to="/dashboard">Back to Dashboard</Link>
          </div>
        </div>

        <div className="generator-preview">
          <h3>Live Preview</h3>
          <div className="qr-preview-box">
            <QRCodeSVG value={previewValue} size={220} />
          </div>
          {createdQr?.shortUrl && (
            <p className="link-wrap">
              Short Redirect: <a href={createdQr.shortUrl} target="_blank" rel="noreferrer">{createdQr.shortUrl}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;
