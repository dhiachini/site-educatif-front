import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import BreadCrumb from "../Common/BreadCrumb";
import backgroundImage from "../../assets/images/rabbitrose.jpeg"; // Adjust the path

// Function to handle the "مراجعة الدرس" click
const handleLessonReviewClick = (e) => {
  e.preventDefault(); // Prevent default button behavior
  window.open("/assets/lessons/lesson.pdf", "_blank"); // Open the PDF in a new tab
};

const AddStudent = () => {
  document.title = "مراجعة الدرس | الموقع التعليمي";

  return (
    <React.Fragment>
      <div className="page-content" dir="rtl">
        <Container fluid>
          <BreadCrumb title="مراجعة درس الجهاز الهضمي للارنب" />
          <Card
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover", // Ensure the image covers the card
              backgroundPosition: "center", // Center the image
              minHeight: "70vh", // Set minimum height for the card
              color: "white", // Adjust text color for better visibility
            }}
          >
            <CardBody>
              <div
                className="mb-4 text-end"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  paddingRight: "10px",
                  paddingTop: "10px",
                }}
              >
                <p>
                  1. قبل إجراء اختبار الأسئلة، يجب مراجعة درس{" "}
                  <strong>الجهاز الهضمي للأرنب</strong> جيدًا.
                </p>
                <p>
                  2. قبل البدء في <strong>تمرين المختبر الافتراضي</strong>، تأكد
                  من أنك فهمت درس <strong>الجهاز الهضمي للأرنب</strong> بشكل
                  كامل.
                </p>
              </div>
              <Row
                className="justify-content-center align-items-end" // Changed to align-items-end
                style={{ minHeight: "40vh" }} // Adjusted height for better alignment
              >
                <Col xxl={4} md={6} className="text-center">
                  {/* Submit Button */}
                  <div className="mt-5"> {/* Added margin-top to push the button down */}
                    <Button
                      color="success"
                      className="btn-md px-5 py-2 fw-bold text-white"
                      style={{ fontSize: "1.25rem" }}
                      onClick={handleLessonReviewClick} // Add onClick handler
                    >
                      مراجعة الدرس
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddStudent;