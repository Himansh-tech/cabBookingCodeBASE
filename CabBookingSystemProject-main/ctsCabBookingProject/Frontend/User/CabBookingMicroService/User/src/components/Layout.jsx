// src/components/Layout.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Home, Settings } from 'lucide-react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import '../../src/index.css';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const { logout, user } = useAuth(); 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user && user.username) {
      setUserName(user.username);
    } else {
      setUserName(null);
    }
  }, [user]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="white" expand="lg" className="shadow border-bottom">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Car size={32} className="text-warning me-2" />
            <span className="fs-5 fw-bold text-warning">ApexRide</span>
          </Navbar.Brand>

          <Navbar.Toggle/>

          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
              <div className="d-flex align-items-center me-3 my-2 my-lg-0">
                <User size={25} className="text-secondary me-1" />
                <span className="small text-muted me-2">{userName || "Guest"}</span>
              </div>
              <Button variant="link" className="text-decoration-none text-muted" onClick={handleLogout}>
                <LogOut size={16} className="me-1" />
                <span>Logout</span>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1">
        <Nav
          className="flex-column bg-white shadow-lg p-3"
          style={{ width: '250px', minHeight: 'calc(100vh - 64px)' }}
        >
          <ul className="list-unstyled d-grid gap-2">
            <li>
              <Nav.Link
                as={Link}
                to="/dashboard"
                className="d-flex align-items-center px-3 py-2 rounded-lg transition-all text-dark hover-bg-light"
              >
                <Home size={20} className="me-3" />
                <span>Dashboard</span>
              </Nav.Link>
            </li>
            <li>
              <Nav.Link
                as={Link}
                to="/book-ride"
               
                className="d-flex align-items-center px-3 py-2 rounded-lg transition-all text-dark hover-bg-light"
              >
                <Car size={20} className="me-3" />
                <span>Book Ride</span>
              </Nav.Link>
            </li>
            <li>
              <Nav.Link
                as={Link}
                to="/profile"
                className="d-flex align-items-center px-3 py-2 rounded-lg transition-all text-dark hover-bg-light"
              >
                <Settings size={20} className="me-3" />
                <span>Profile</span>
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