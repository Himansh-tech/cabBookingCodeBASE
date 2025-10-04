import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom'; // Import NavLink
import { Car, User, LogOut, Home, History, Settings } from 'lucide-react';
import { Container, Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
// Removed: import '../../src/index.css'; // No longer needed as CSS is embedded
 
const Layout = ({ children }) => {
  const {driver,logout} = useAuth();
  const nav = useNavigate();
  const handleLogout = ()=>{
    logout();
    nav("/login")
  }
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Embedded CSS for active link styling */}
      <style>
        {`
        /* Custom styles for the active navigation link */
        .nav-link.active {
          background-color: #FFEB3B !important; /* A bright yellow from your screenshot */
          color: #212529 !important; /* Dark text for contrast */
          font-weight: bold !important; /* Make the text bold */
          // border-left: 4px solid #FBC02D !important; /* A slightly darker yellow for the left border */
          border-radius: 0.5rem !important; /* Ensure rounded corners are maintained */
        }
 
        /* Ensure icons within the active link also turn dark */
        .nav-link.active svg {
          color: #212529 !important; /* Dark color for icons when active */
        }
 
        /* Default styling for non-active links to ensure consistency */
        .nav-link {
            color: #495057; /* Default text color for inactive links */
            display: flex; /* Ensure flex properties are maintained */
            align-items: center; /* Align items vertically */
            padding: 0.5rem 1rem; /* Adjust padding as needed */
            text-decoration: none; /* Remove default underline */
            transition: all 0.2s ease-in-out; /* Smooth transition for hover effects */
        }
 
        .nav-link svg {
            color: #6c757d; /* Default color for icons when inactive */
            transition: all 0.2s ease-in-out; /* Smooth transition for icon color */
        }
 
        /* Hover effect for non-active links */
        .hover-bg-light:hover {
          background-color: #f8f9fa; /* Light grey on hover */
          color: #212529 !important; /* Dark text on hover */
        }
 
        /* Ensure hover doesn't override active state */
        .nav-link.active.hover-bg-light:hover {
            background-color: #FFEB3B !important; /* Keep active color on hover if it's active */
        }
        `}
      </style>
 
      <Navbar bg="white" expand="lg" className="shadow border-bottom">
        <Container fluid>
 
          {/* for brand icon, title and link to home and some style */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Car size={32} className="text-warning me-2" />
            <span className="fs-5 fw-bold text-warning">ApexRide</span>
          </Navbar.Brand>
 
          {/* for toggle buttons on smaller screen */}
          <Navbar.Toggle />
 
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav className="align-items-center">
 
              <div className="d-flex align-items-center me-3 my-2 my-lg-0">
                <User size={25} className="text-secondary me-1" />
                <span className="small text-muted me-2">{driver.username}</span>
              </div>
 
              <Button variant="link" className="text-decoration-none text-muted"
               onClick={handleLogout}
              >
                <LogOut size={16} className="me-1" />
                <span>Logout</span>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
 
      <div className="d-flex flex-grow-1">
        {/* Sidebar Navigation */}
        <Nav className="flex-column bg-white shadow-lg p-3" style={{ width: '250px', minHeight: 'calc(100vh - 64px)' }}>
          <ul className="list-unstyled d-grid gap-2">
            <li>
              {/* Changed as={Link} to as={NavLink} to enable active styling */}
              <Nav.Link as={NavLink} to="/driver-dashboard" className="d-flex align-items-center px-3 py-2 rounded-lg transition-all text-dark hover-bg-light">
                <Home size={20} className="me-3" />
                <span>Dashboard</span>
              </Nav.Link>
            </li>
           
            <li>
              {/* Changed as={Link} to as={NavLink} to enable active styling */}
              <Nav.Link as={NavLink} to="/driver-profile" className="d-flex align-items-center px-3 py-2 rounded-lg transition-all text-dark hover-bg-light">
                <Settings size={20} className="me-3" />
                <span>Profile</span>
              </Nav.Link>
            </li>
          </ul>
        </Nav>
 
        <main className="flex-grow-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
 
export default Layout;