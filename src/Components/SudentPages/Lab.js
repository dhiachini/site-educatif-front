import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../Common/BreadCrumb";
import backgroundImage from "../../assets/images/lab.jpg"; // Adjust the path
import { useNavigate } from "react-router-dom";

const Lab = () => {
  const navigate = useNavigate(); // Move useNavigate inside the component

  // Define handleLessonReviewClick inside the component
  const handleLessonReviewClick = (e) => {
    e.preventDefault(); // Prevent default button behavior
    navigate("/rabbit-exercice"); // Navigate to /rabbit-exercice
  };

  document.title = "المختبر | الموقع التعليمي";

  return (
    <React.Fragment>
      <div
        className="page-content"
        dir="rtl"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Set background image
          backgroundSize: "auto", // Keep the original size of the image
          backgroundPosition: "center", // Center the image
          backgroundRepeat: "no-repeat", // Prevent the image from repeating
          minHeight: "100vh", // Set minimum height to cover the full viewport
        }}
      >
        <Container fluid>
          <BreadCrumb title="مرحبا بكم في المختبر" />
          <Row
            className="justify-content-center align-items-center" // Center vertically and horizontally
            style={{ minHeight: "80vh" }} // Reduced height to move the button up
          >
            <Col xxl={4} md={6} className="text-center">
              {/* Submit Button */}
              <div className="mb-3">
                {" "}
                {/* Reduced margin-top to move the button up */}
                <Button
                  color="success"
                  className="btn-md px-5 py-2 fw-bold text-white"
                  style={{ fontSize: "1.25rem" }}
                  onClick={handleLessonReviewClick} // Add onClick handler
                >
                  أجرب
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Lab;
