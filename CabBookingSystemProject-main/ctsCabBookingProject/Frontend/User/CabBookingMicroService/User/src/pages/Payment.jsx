import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Card,
  Button,
  ListGroup,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import { IndianRupee, ArrowLeft } from "lucide-react";

const GATEWAY_URL = "http://localhost:8086";
const ADMIN_BASE_URL = "http://localhost:8087/api/v1/admin";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();

  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [error, setError] = useState(null);


  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [ratingOk, setRatingOk] = useState("");

  const rideId = location.state?.rideId;

  useEffect(() => {
    if (!rideId || !user?.userId) {
      setError("Missing ride or user information.");
      setLoading(false);
      return;
    }

    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(
          `${GATEWAY_URL}/api/v1/rides/users/${user.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const ride = response.data.find((r) => r.id === rideId);
        if (!ride) {
          setError("Ride not found.");
        } else {
          setRideDetails(ride);
        }
      } catch (err) {
        console.error("Failed to fetch ride details:", err);
        setError("Failed to load ride details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId, user?.userId, token]);

  const handleConfirmPayment = async () => {
    setConfirmingPayment(true);
    setError(null);
    try {
      const PAYMENT_CONFIRM_API_URL = `${GATEWAY_URL}/api/v1/payments/confirm/${user.userId}`;
      const requestBody = {
        rideId: rideDetails.id,
        amount: rideDetails.actualFare || rideDetails.estimatedFare,
        status: "SUCCESS",
      };

      const response = await axios.put(PAYMENT_CONFIRM_API_URL, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setPaymentConfirmed(true); // show rating UI below
      } else {
        setError("Unexpected Error, Payment Not Complete.");
        setConfirmingPayment(false);
      }
    } catch (err) {
      console.error("Payment confirmation failed:", err);
      setError("Payment confirmation failed. Please try again.");
      setConfirmingPayment(false);
    }
  };

  const convertDurationToMinutes = (duration) => {
    if (!duration) return null;
    const seconds = Number(duration);
    if (isNaN(seconds)) return null;
    return Math.floor(seconds / 60);
  };

  //admin driver id
  const adminExternalDriverId = useMemo(() => {
    return rideDetails?.driverId ?? null;
  }, [rideDetails]);

  const requiresComment = rating > 0 && rating <= 2;

  const submitRating = async () => {
    setRatingError("");
    setRatingOk("");

    if (!adminExternalDriverId) {
      setRatingError(
        "Driver not found for this ride. Ride must contain driverId (external Driver Service ID)."
      );
      return;
    }
    if (rating === 0) {
      setRatingError("Please select a rating.");
      return;
    }
    if (requiresComment && !comment.trim()) {
      setRatingError("Comment is required for ratings of 1 or 2 stars.");
      return;
    }

    try {
      setSubmittingRating(true);
      const url = `${ADMIN_BASE_URL}/drivers/${encodeURIComponent(
        adminExternalDriverId
      )}/ratings`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
          rideId: rideDetails?.id || null,
        }),
      });

      if (!res.ok) {
        let serverMessage = "";
        try {
          const data = await res.json();
          serverMessage = data?.message || "";
        } catch {
          // ignore
        }
        throw new Error(
          serverMessage || `Failed to submit rating (HTTP ${res.status})`
        );
      }

      setRatingOk("Thanks! Your rating has been submitted.");
      setTimeout(() => {
        setRating(0);
        setHover(0);
        setComment("");
        setRatingOk("");
        navigate("/dashboard");
      }, 800);
    } catch (e) {
      setRatingError(e.message || "Something went wrong submitting rating.");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p>Loading ride details...</p>
      </Container>
    );
  }

  if (error || !rideDetails) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error || "Ride details not found."}</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: "700px" }}>
      <Button
        variant="link"
        className="d-inline-flex align-items-center text-primary text-decoration-none mb-3 ps-0"
        onClick={() => navigate(-1)}
        disabled={confirmingPayment}
      >
        <ArrowLeft size={16} className="me-2" />
        Back to Dashboard
      </Button>

      <Card className="shadow-sm rounded-3 p-4 mb-4">
        <Card.Body>
          <h2 className="fs-5 fw-semibold text-dark mb-4">Ride Summary</h2>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between px-0 py-2">
              <span className="text-muted">From:</span>
              <span className="fw-medium text-dark">
                {rideDetails.pickupLocation}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between px-0 py-2">
              <span className="text-muted">To:</span>
              <span className="fw-medium text-dark">
                {rideDetails.dropoffLocation}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between px-0 py-2">
              <span className="text-muted">Distance:</span>
              <span className="fw-medium text-dark">
                {rideDetails.distance?.toFixed(2) || "N/A"} km
              </span>
            </ListGroup.Item>
            {/* <ListGroup.Item className="d-flex justify-content-between px-0 py-2">
              <span className="text-muted">Duration:</span>
              <span className="fw-medium text-dark">
                {convertDurationToMinutes(rideDetails.duration) || "N/A"} mins
              </span>
            </ListGroup.Item> */}
            <ListGroup.Item className="border-top pt-3 d-flex justify-content-between px-0 py-2">
              <span className="fs-5 fw-bold text-dark">Total Amount:</span>
              <span className="fs-5 fw-bold text-success">
                ₹
                {(
                  rideDetails.actualFare || rideDetails.estimatedFare
                )?.toFixed(2) || "0.00"}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm rounded-3 p-4 mb-4">
        <Card.Body>
          <h2 className="fs-5 fw-semibold text-dark mb-4">Payment Method</h2>

          {error && (
            <Alert variant="danger" className="mb-3 text-center">
              {error}
            </Alert>
          )}
          {paymentConfirmed && (
            <Alert variant="success" className="mb-3 text-center">
              Payment Confirmed!
            </Alert>
          )}

          <Button
            onClick={handleConfirmPayment}
            disabled={confirmingPayment || paymentConfirmed}
            className="w-100 shadow py-3 text-dark fw-bold"
            style={{ background: "rgba(241, 211, 2, 1)", border: "none" }}
          >
            {confirmingPayment
              ? "Processing Payment..."
              : paymentConfirmed
              ? "Payment Submitted!"
              : `Pay Now ₹${
                  (rideDetails.actualFare || rideDetails.estimatedFare)?.toFixed(
                    2
                  ) || "0.00"
                } in Cash`}
          </Button>
        </Card.Body>
      </Card>

      {/* Rating UI appears only after payment is confirmed */}
      {paymentConfirmed && (
        <Card className="shadow-sm rounded-3 p-4 mb-4">
          <Card.Body className="text-center">
            <h2 className="fs-5 fw-semibold text-dark mb-3">Rate your ride</h2>

            <div className="mb-3" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  role="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    cursor: "pointer",
                    color:
                      (hover || rating) >= star
                        ? "rgba(241, 211, 2, 1)"
                        : "#ccc",
                    fontSize: "28px",
                    marginRight: "6px",
                    userSelect: "none",
                    lineHeight: 1,
                  }}
                  aria-label={(hover || rating) >= star ? "filled star" : "empty star"}
                >
                  ★
                </span>
              ))}
            </div>

            <Form.Group className="mb-3 text-start">
              <Form.Label className="fw-semibold">
                Comment{" "}
                {rating > 0 && rating <= 2 ? (
                  <span className="text-danger">(required for ≤2★)</span>
                ) : (
                  <span className="text-muted">(optional)</span>
                )}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={
                  rating > 0 && rating <= 2
                    ? "Please tell us what went wrong..."
                    : "Any feedback to help improve future rides?"
                }
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                isInvalid={rating > 0 && rating <= 2 && !comment.trim()}
              />
              <Form.Control.Feedback type="invalid">
                Comment is required for ratings of 1 or 2 stars.
              </Form.Control.Feedback>
            </Form.Group>

            {ratingError && (
              <Alert variant="danger" className="mb-3">
                {ratingError}
              </Alert>
            )}
            {ratingOk && (
              <Alert variant="success" className="mb-3">
                {ratingOk}
              </Alert>
            )}

            <div className="d-grid gap-2">
              <Button
                onClick={submitRating}
                className="w-100 shadow py-3 text-dark fw-bold"
                style={{ background: "rgba(241, 211, 2, 1)", border: "none" }}
                disabled={submittingRating}
              >
                {submittingRating ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> Submitting...
                  </>
                ) : (
                  "Submit Rating"
                )}
              </Button>

              <Button
                onClick={() => navigate("/dashboard")}
                className="w-100 shadow py-3 text-dark fw-bold"
                style={{ background: "rgba(241, 211, 2, 1)", border: "none" }}
                disabled={submittingRating}
              >
                Go to Dashboard
              </Button>
            </div>

            <div className="mt-3 text-muted small">
              {adminExternalDriverId
                ? `Driver ID: ${adminExternalDriverId}`
                : "No driverId found on this ride."}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Payment;
