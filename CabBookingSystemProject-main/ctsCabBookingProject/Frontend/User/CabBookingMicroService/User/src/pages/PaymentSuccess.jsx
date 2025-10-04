import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Card, Form, Alert, Spinner } from "react-bootstrap"; 

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Added minimal state
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // Read identifiers if provided (kept optional)
  const search = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const driverId = location.state?.driverId || search.get("driverId") || null;
  const rideId = location.state?.rideId || search.get("rideId") || null;

  const requiresComment = rating > 0 && rating <= 2;

  const submitRating = async () => {
    setError("");
    setOk("");

    if (!driverId) {
      setError("Driver not found. Please go to Dashboard.");
      return;
    }
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (requiresComment && !comment.trim()) {
      setError("Comment is required for ratings of 1 or 2 stars.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`/api/v1/admin/drivers/${encodeURIComponent(driverId)}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || null,
          rideId: rideId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Failed to submit rating (HTTP ${res.status})`);
      }

      setOk("Thanks! Your rating has been submitted.");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: "700px" }}> 
      <Card className="shadow-sm rounded-3 p-4 mb-4 text-center">
        <Card.Body>
          <h2 className="mb-4 fs-3 fw-semibold text-success">🎉 Payment Successful!</h2>
          <p className="mb-4 text-dark">Thank you for riding with us. Your payment has been processed successfully, and you're all set.</p>
          
          <h3 className="fs-5 fw-semibold mb-3">Rate your ride</h3>
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
                  color: (hover || rating) >= star ? "rgba(241, 211, 2, 1)" : "#ccc",
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
              {requiresComment ? (
                <span className="text-danger">(required for ≤2★)</span>
              ) : (
                <span className="text-muted">(optional)</span>
              )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={
                requiresComment
                  ? "Please tell us what went wrong..."
                  : "Any feedback to help improve future rides?"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              isInvalid={requiresComment && !comment.trim()}
            />
            <Form.Control.Feedback type="invalid">
              Comment is required for ratings of 1 or 2 stars.
            </Form.Control.Feedback>
          </Form.Group>

          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {ok && <Alert variant="success" className="mb-3">{ok}</Alert>}

          <div className="d-grid gap-2">
            <Button 
              onClick={submitRating}
              className="w-100 shadow py-3 text-dark fw-bold" 
              style={{ background: "rgba(241, 211, 2, 1)", border: "none" }} 
              disabled={submitting}
            >
              {submitting ? (<><Spinner animation="border" size="sm" className="me-2" /> Submitting...</>) : "Submit Rating"}
            </Button>

            <Button 
              onClick={() => navigate("/dashboard")} 
              className="w-100 shadow py-3 text-dark fw-bold" 
              style={{ background: "rgba(241, 211, 2, 1)", border: "none" }} 
              disabled={submitting}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
