import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, User, Mail, Phone, Lock, ArrowLeft } from "lucide-react";
import { Container, Card, Button, Form, InputGroup } from "react-bootstrap";
import registerService from "../service/registerService";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    passwordHash: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  //updateing the formData state with the latest value typed by the user
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    //validate password if the input field is passwordHash
    if (name === "passwordHash") {
      validatePassword(value);
    }
  };


  const validatePassword = (password) => {
    let error = "";
    if (password.length < 6) {
      error = "Password must be at least 6 characters long.";
    } else if (!/[0-9]/.test(password)) {
      error = "Password must contain at least one digit.";
    } else if (!/[a-zA-Z]/.test(password)) {
      error = "Password must contain at least one letter.";
    }
    setPasswordError(error);
    return error === "";
  };

  // send formdata to backend or registration
  const handleSubmit = async (e) => {
    // generally submit refresh the page, stop page reload so that we wont lose the state, can validate
    e.preventDefault();

    const isPasswordValid = validatePassword(formData.passwordHash);

    if (!isPasswordValid) {
      alert("Please fix the password errors before submitting.");
      return;
    }

    try {
      // regiterService is sending data to the backend(it is defined in service folder)
      const response = await registerService.registerUser(formData);
      console.log("Registration successful:", response);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(
        "Registration failed. Please try again. " +
          (error.response?.data || error.message)
      );
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 py-4"
      style={{
        background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
      }}
    >
      <Card
        className="p-4 shadow-lg rounded-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Body>
          <Link
            to="/"
            className="d-inline-flex align-items-center text-primary text-decoration-none mb-4"
          >
            <ArrowLeft size={16} className="me-2" />
            Back to Home
          </Link>

          <div className="text-center mb-4">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <Car size={32} className="text-primary me-2" />
              <h1 className="fs-2 fw-bold text-dark">ApexRide</h1>
            </div>
            <h2 className="fs-4 fw-semibold text-secondary">Create Account</h2>
            <p className="text-muted mt-2">Join as a user</p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-dark mb-2">
                Username
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <User size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Create a username"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-dark mb-2">
                First Name
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <User size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-dark mb-2">
                Last Name
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <User size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-dark mb-2">
                Email Address
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Mail size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-dark mb-2">
                Phone Number
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Phone size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-medium text-dark mb-2">
                Password
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Lock size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="passwordHash"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  isInvalid={!!passwordError}
                />
                <Form.Control.Feedback type="invalid">
                  {passwordError}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              className="text-dark w-100 py-3 rounded-lg fw-bold"
              style={{ background: "rgba(241, 211, 2, 1)", border: "none" }}
            >
              Create Account
            </Button>
          </Form>

          <div className="mt-4 text-center">
            <span className="text-muted">Already have an account? </span>
            <Link
              to="/login"
              className="text-primary fw-semibold text-decoration-none"
            >
              Sign In
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;