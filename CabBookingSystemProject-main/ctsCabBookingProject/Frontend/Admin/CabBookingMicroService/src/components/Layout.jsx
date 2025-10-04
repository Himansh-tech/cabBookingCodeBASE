import React from "react";
import { Link } from "react-router-dom";
import { UserCheck, XCircle, Car, User } from "lucide-react";
import { Nav, Navbar, Container } from "react-bootstrap";

import "../../src/index.css";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Navbar bg="white" expand="lg" className="shadow border-bottom px-3">
        <Container fluid className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <Navbar.Brand
              as={Link}
              to="/"
              className="d-flex align-items-center"
            >
              <Car size={32} className="text-warning me-2" />
              <span className="fs-5 fw-bold text-warning">ApexRide</span>
            </Navbar.Brand>
          </div>
          <div className="ms-auto">
            <span className="fs-6 fw-semibold text-dark">Admin Panel</span>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar + Main Content */}
      <div className="d-flex flex-grow-1">
        <Nav
          className="flex-column bg-white shadow-lg p-3"
          style={{ width: "250px", minHeight: "100vh" }}
        >
          <ul className="list-unstyled d-grid gap-2">
            <li>
              <Nav.Link
                as={Link}
                to="/"
                className="d-flex align-items-center px-3 py-2 rounded-lg transition-all text-dark hover-bg-light"
              >
                <UserCheck size={20} className="me-3" />
                <span>Admin Dashboard</span>
              </Nav.Link>
            </li>
            
            {/* NEW: Driver Profile link */}
            <li>
              <Nav.Link
                as={Link}
                to="/driver-profile"
                className="d-flex align-items-center px-3 py-2 rounded-lg transition-all text-dark hover-bg-light"
              >
                <User size={20} className="me-3" />
                <span>Driver Profile</span>
              </Nav.Link>
            </li>
          </ul>
        </Nav>

        <main className="flex-grow-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
