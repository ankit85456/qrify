# QRify

QRify is a full-stack web application that allows users to generate and manage QR codes easily.
Users can create QR codes for URLs or text, store them in a database, and track scan counts.

---

## 🚀 Features

* User Signup and Login (Authentication using JWT & bcrypt)
* Generate QR Codes
* Save QR codes in MongoDB
* QR Dashboard to view generated QR codes
* Dynamic QR Redirect system
* Scan Counter for each QR code
* Expiring QR Codes
* Password Protected QR Codes
* One-Time QR Codes

---

## 🛠 Tech Stack

**Frontend**

* React.js (Vite)
* Axios
* React Router
* QRCode Library

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

---

## 📁 Project Structure

qrify
│
├── qrify-backend
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── qrify-frontend-vite
│   ├── src
│   ├── components
│   ├── pages
│   └── App.jsx

---

## ⚙️ Installation

### 1️⃣ Clone the repository

git clone https://github.com/ankit85456/qrify.git

---

### 2️⃣ Backend Setup

cd qrify-backend

Install dependencies

npm install

Create a `.env` file

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run backend server

node server.js

---

### 3️⃣ Frontend Setup

cd qrify-frontend-vite

Install dependencies

npm install

Run frontend

npm run dev

---

## 🌐 Running the Application

Backend runs on:

http://localhost:5000

Frontend runs on:

http://localhost:5173

---

## 📊 Future Improvements

* QR code download option
* QR analytics dashboard
* Custom QR design
* Mobile responsive UI

---

## 👨‍💻 Author

Ankit Kumar

GitHub: https://github.com/ankit85456
