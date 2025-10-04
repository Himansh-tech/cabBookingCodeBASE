import React, { useState } from "react";
import {Container, Row, Col, Card, Form, Button, Alert, Spinner} from "react-bootstrap";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";

const BASE_URL = "http://localhost:8087/api/v1/admin";

const DriverProfile = () => {
  const [driverId, setDriverId] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [recentRatings, setRecentRatings] = useState([]);
  const [driverName, setDriverName] = useState("");
  const [error, setError] = useState("");

  const fetchSummary = async (id) => {
    if (!id) {
      setError("Please enter a Driver ID.");
      return;
    }
    setError("");
    setSummary(null);
    setRecentRatings([]);
    setDriverName("");
    setLoading(true);
    try {
      // Fetch driver info
      const resInfo = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`);
      if (!resInfo.ok) {
        throw new Error(`Failed to load driver info (HTTP ${resInfo.status})`);
      }
      const info = await resInfo.json();
      setDriverName(info.name);

      // Fetch rating summary
      const resSummary = await fetch(
        `${BASE_URL}/drivers/${encodeURIComponent(id)}/ratings/summary`
      );
      if (!resSummary.ok) {
        throw new Error(
          `Failed to load rating summary (HTTP ${resSummary.status})`
        );
      }
      const data = await resSummary.json();
      setSummary(data);

      //call to get recent rating, i made this only for the graph
      const resRecent = await fetch(
        `${BASE_URL}/drivers/${encodeURIComponent(id)}/ratings/recent`
      );
      if (!resRecent.ok) {
        throw new Error(
          `Failed to load recent ratings (HTTP ${resRecent.status})`
        );
      }
      const recent = await resRecent.json();
      setRecentRatings(recent.reverse());
      //reversed the list otherwise new ratings will be added on left as i am showing newly given ratings
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (avg) => {
    const filled = Math.round(avg || 0);
    const empty = 5 - filled;
    return (
      <>
        <span style={{ color: "rgba(241, 211, 2, 1)" }}>
          {"★".repeat(filled)}
        </span>
        <span style={{ color: "#ccc" }}>
          {"★".repeat(empty)}
        </span>
      </>
    );
  };

  return (
    <Container className="my-4 py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fs-2 fw-bold text-dark">Driver Profile</h1>
          
        </Col>
      </Row>

      <Card className="p-4 shadow-sm rounded-3 mb-4">
        <Card.Header className="bg-white border-0 px-0 pt-0 pb-3">
          <h2 className="fs-5 fw-semibold text-dark mb-0">Find Driver</h2>
        </Card.Header>
        <div className="d-flex gap-2 align-items-end">
          <Form.Group className="mb-3" style={{ maxWidth: 320, width: "100%" }}>
            <Form.Label className="fw-semibold">Driver ID</Form.Label>
            <Form.Control
              type="text"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="warning"
            className="text-dark fw-bold mb-3"
            onClick={() => fetchSummary(driverId)}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Load"}
          </Button>
        </div>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Card>

      {summary && (
        <Card className="p-4 shadow-sm rounded-3">
          <Card.Header className="bg-white border-0 px-0 pt-0 pb-3">
            <h2 className="fs-5 fw-semibold text-dark mb-0">Rating Summary</h2>
          </Card.Header>

          <div className="d-flex align-items-center mb-3">
            <div style={{ fontSize: "24px", lineHeight: 1 }}>
              {renderStars(summary.avgRating)}
            </div>
            <div className="ms-3 text-muted">
              {(summary.avgRating ?? 0).toFixed(1)} / 5 | Total ratings: {summary.ratingCount ?? 0} 
            </div>
          </div>

          <div className="mb-2 text-muted">
            {driverName && <p className="text-muted">Name: {driverName}</p>}
          </div>

          {/*adding graph */}
          <div className="mt-4">
            <h6 className="fw-semibold mb-3">Ratings Graph</h6>
            {recentRatings.length === 0 ? (
              <div className="text-muted">No rating history available.</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={recentRatings}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis
                    dataKey="createdAt"
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#f1d302"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-3">
            <h6 className="fw-semibold">Comments</h6>
            {!summary.comments || summary.comments.length === 0 ? (
              <div className="text-muted">No comments yet.</div>
            ) : (
              <ul className="list-unstyled">
                {summary.comments.map((c, i) => (
                  <li key={i} className="mb-2">• {c}</li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}
    </Container>
  );
};

export default DriverProfile;
