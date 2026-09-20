# NearBuy

### A Reverse Marketplace for Local Shopping

NearBuy is a mobile application that connects customers with nearby local shops. Instead of customers searching through multiple shops for a product, they can post what they need, and nearby sellers can respond with their offers.

This helps customers compare local offers and helps small businesses reach customers in their area.

---

## 📱 Project Overview

NearBuy follows a **reverse marketplace** model.

### Customer Flow

1. Register or log in
2. Save location
3. Post a product request
4. Enter budget, condition, and other requirements
5. Receive offers from nearby sellers
6. Compare available offers
7. Accept an offer
8. View the order

### Seller Flow

1. Register a shop
2. Log in as a seller
3. View nearby customer requests
4. Open request details
5. Submit an offer
6. Track submitted offers
7. Manage shop profile and location

### Admin Flow

1. Log in to the Admin Panel
2. View platform dashboard
3. Manage customers
4. Manage sellers
5. View customer requests
6. View orders
7. Check backend/API status
8. Manage admin account settings
9. Change admin password
10. Change admin email
11. Logout securely

---

## ✨ Features

### Customer

- Customer registration and login
- Saved location
- Post product requests
- View and manage requests
- View seller offers
- Accept an offer
- View orders
- Edit profile
- Change password

### Seller

- Seller registration and login
- Shop profile
- View nearby customer requests
- View request details
- Make offers
- View submitted offers
- Edit shop details
- Manage shop location
- Change password

### Admin Panel

- Admin authentication
- Dashboard
- Customer management
- Seller management
- Customer request management
- Order management
- Search and filter records
- Backend/API connection status
- Admin profile information
- Change password
- Change email
- Logout

### Backend

- REST API
- User authentication
- Request management
- Offer management
- Order management
- Admin management
- MongoDB database integration

---

## 🛠️ Technologies Used

### Mobile Frontend

- React Native
- Expo
- TypeScript
- Expo Router

### Admin Panel

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Development & Testing

- Visual Studio Code
- Postman / Thunder Client
- Git
- GitHub
- Expo EAS

### Deployment

- Render for Backend
- Vercel for Admin Panel

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │   React Native App   │
                    │       (Expo)         │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                               │ MongoDB Driver
                               ▼
                    ┌──────────────────────┐
                    │     MongoDB Atlas    │
                    │       Database       │
                    └──────────────────────┘


                    ┌──────────────────────┐
                    │   React Admin Panel  │
                    │    (Vite + React)    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │       Backend        │
                    └──────────────────────┘

🔄 How NearBuy Works

Customer
   │
   ▼
Post Product Request
   │
   ▼
Nearby Sellers View Request
   │
   ▼
Sellers Submit Offers
   │
   ▼
Customer Compares Offers
   │
   ▼
Customer Accepts Offer
   │
   ▼
Order Created
   │
   ▼
Admin Can View Request and Order


📂 Project Structure

NearBuy/
│
├── src/
│   └── app/
│       ├── customer-login.tsx
│       ├── customer-register.tsx
│       ├── customer-home.tsx
│       ├── customer-profile.tsx
│       ├── post-request.tsx
│       ├── offers.tsx
│       ├── seller-login.tsx
│       ├── seller-register.tsx
│       ├── seller-home.tsx
│       ├── seller-request-details.tsx
│       ├── make-offer.tsx
│       └── ...
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── admin-panel/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── assets/
├── app.json
├── eas.json
├── package.json
├── LICENSE
└── README.md

🚀 Getting Started
Prerequisites

Make sure the following are installed:

Node.js
npm
Expo CLI / Expo tools
Git
MongoDB Atlas account

📱 Mobile App Setup

Clone the repository:

git clone https://github.com/Saquibguy/NearBuy.git

Go to the project folder:

cd NearBuy

Install dependencies:

npm install

Start the Expo development server:

npx expo start


⚙️ Backend Setup

Go to the backend folder:

cd backend

Install dependencies:

npm install

Create a .env file:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Start the backend:

npm start

The backend provides REST API endpoints for authentication, requests, offers, orders, and admin operations.


🖥️ Admin Panel Setup

From the project root:

cd admin-panel

Install dependencies:

npm install

Start the Admin Panel development server:

npm run dev

Vite will display the local development URL, for example:

http://localhost:5173


🌐 Deployment
Backend

The NearBuy backend is deployed using Render.

Admin Panel

The NearBuy Admin Panel is deployed using Vercel and connected to the GitHub repository.

Future code changes can be deployed by pushing updates to GitHub.

git add .
git commit -m "Update NearBuy Admin Panel"
git push origin main

🔐 Security Note

Environment variables such as database connection strings, passwords, and API secrets should not be committed to GitHub.

The .env file should be excluded using .gitignore.

🎯 Project Objectives
Connect customers with nearby local shops
Make local shopping easier
Allow customers to compare seller offers
Help local businesses find potential customers
Reduce unnecessary shop-to-shop searching
Provide a digital platform for local shopping
Provide administrators with a centralized management panel

🔮 Future Scope
Online payment integration
Real-time notifications
GPS-based seller discovery
In-app chat between customers and sellers
Product image uploads
Seller ratings and reviews
Order delivery tracking
Advanced analytics and reporting

👨‍💻 Project

Project Name: NearBuy
Type: BSc Computer Science Final Year Project
Category: Local Shopping / Reverse Marketplace

📄 License

This project is developed as an academic project for educational purposes.

The project source code is available under the MIT License.

See the LICENSE file for details.

