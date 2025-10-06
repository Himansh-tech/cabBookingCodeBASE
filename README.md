# CabBooking 🚖  

[🎥 Demo Video](https://drive.google.com/file/d/1FKDwB6_BNuaTDMoZrHtfdcMWWnWyQ0oB/view?usp=sharing)  

## 📌 Project Overview  
CabBooking is a full-stack application that allows users to book cabs, track rides, and manage their ride history. It simulates a real cab-booking experience with core functionalities like ride requests, driver assignment, and trip status updates.  

---

## ✨ Features  
- 🔑 User registration & authentication  
- 🚕 Request a cab by entering pickup and drop locations  
- 👨‍✈️ Driver assignment (simulated)  
- 📍 Ride status updates (Searching → Accepted → On the way → Completed)  
- 🕑 Ride history for past bookings  
- 📊 Admin/driver support (optional depending on setup)  

---

## 🛠️ Tech Stack  
- **Frontend:** React.js (or your frontend choice)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Real-time Updates:** Socket.io  
- **Maps/Geocoding:** Google Maps API (if used)  

---

## ⚙️ Installation & Setup  

### Prerequisites  
- Node.js & npm  
- MongoDB (local or cloud, e.g., Atlas)  
- Google Maps API key (if applicable)  

### Steps  
```bash
# Clone repository
git clone https://github.com/your-username/CabBooking.git
cd CabBooking

# Backend setup
cd backend
npm install
# create a .env file and add DB_URI, JWT_SECRET, MAPS_API_KEY, etc.
npm start

# Frontend setup
cd ../frontend
npm install
npm start
```

---

## 🚀 Usage  
1. Register/Login as a user  
2. Enter pickup & drop location  
3. Request a ride → system assigns driver  
4. Track ride status in real time  
5. View ride history after completion  

---

## 🔮 Future Enhancements  
- ✅ Live GPS integration  
- ✅ Online payment support  
- ✅ Notifications (SMS/Email/Push)  
- ✅ Driver rating & feedback  
- ✅ Ride-sharing / pooling options  

---

## 🙌 Acknowledgements  
- [Node.js](https://nodejs.org/)  
- [Express.js](https://expressjs.com/)  
- [MongoDB](https://www.mongodb.com/)  
- [Socket.io](https://socket.io/)  
- [Google Maps API](https://developers.google.com/maps)  
