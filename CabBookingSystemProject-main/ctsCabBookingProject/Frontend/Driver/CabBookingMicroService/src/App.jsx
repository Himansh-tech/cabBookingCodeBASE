import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import DriverRegister from "./pages/DriverRegister.jsx";
// import RideHistory from "./pages/RideHistory.jsx";
import DriverDashboard from "./pages/DriverDashboard.jsx";
// import RideRequests from "./pages/RideRequests.jsx";
import DriverProfile from "./pages/DriverProfile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/driver-register" element={<DriverRegister />} />

        {/* Routes with layout */}


        {/* <Route
          path="/ride-history"
          element={
            <Layout>
              <RideHistory />
            </Layout>
          }
        /> */}
        <Route
          path="/driver-dashboard"
          element={
            <Layout>
              <DriverDashboard />
            </Layout>
          }
        />
        {/* <Route
          path="/ride-requests"
          element={
            <Layout>
              <RideRequests />
            </Layout>
          }
        /> */}

        <Route
          path="/driver-profile"
          element={
            <Layout>
              <DriverProfile/>
            </Layout>
          }
        />
  
      </Routes>
    </Router>
  );
}

export default App;