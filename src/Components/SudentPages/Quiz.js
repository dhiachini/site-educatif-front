import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Label,
  Container,
  Alert,
} from "reactstrap";
import BreadCrumb from "../Common/BreadCrumb";
import axios from "axios"; // Import axios for API calls
import backgroundImage from "../../assets/images/cute.png";

const Quiz = () => {
  // State to track selected answers
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  // State to track if the quiz is submitted
  const [submitted, setSubmitted] = useState(false);

  // State to track if all questions are answered
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  // State to display error message
  const [showError, setShowError] = useState(false);

  // State to store the existing qcmResult
  const [qcmResult, setQcmResult] = useState(null);

  // State to track if the student is reviewing answers
  const [reviewing, setReviewing] = useState(false);

  // Correct answers
  const correctAnswers = {
    q1: "ب) الفم → البلعوم → المريء → المعدة → الأمعاء الدقيقة → الأمعاء الغليظة → الشرج",
    q2: "ب) نقل الطعام من الفم إلى المريء",
    q3: "ب) الأمعاء الغليظة",
    q4: "ب) طويلة وملفوفة",
    q5: "ب) يخرج من فتحة الشرج",
  };

  // Fetch the existing qcmResult when the component mounts
  useEffect(() => {
    const fetchQcmResult = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const studentId = user.id;
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://site-educatif-4.onrender.com/api/students/${studentId}/qcmResult`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.qcmResult !== null) {
          setQcmResult(response.qcmResult); // Set the fetched qcmResult
        }
      } catch (error) {
        console.error("Error fetching QCM result:", error);
      }
    };

    fetchQcmResult();
  }, []);

  // Map selected answers to numerical values
  const mapAnswerToValue = (question, answer) => {
    const options = {
      q1: [
        "أ) الفم → المعدة → الأمعاء الدقيقة → الأمعاء الغليظة → الشرج",
        "ب) الفم → البلعوم → المريء → المعدة → الأمعاء الدقيقة → الأمعاء الغليظة → الشرج",
        "ج) الفم → الأمعاء الدقيقة → المريء → البلعوم → المعدة",
      ],
      q2: [
        "أ) هضم الطعام",
        "ب) نقل الطعام من الفم إلى المريء",
        "ج) امتصاص المواد الغذائية",
      ],
      q3: ["أ) الأمعاء الدقيقة", "ب) الأمعاء الغليظة", "ج) المعدة"],
      q4: ["أ) قصيرة جدًا", "ب) طويلة وملفوفة", "ج) تحتوي على معدتين"],
      q5: [
        "أ) يدخل إلى الأمعاء الغليظة",
        "ب) يخرج من فتحة الشرج",
        "ج) يعود إلى الفم",
      ],
    };

    return options[question].indexOf(answer) + 1; // Map to 1, 2, or 3
  };

  // Handle answer selection
  const handleAnswerChange = (question, answer) => {
    setAnswers({ ...answers, [question]: answer });
    setShowError(false); // Hide error message when the user selects an answer
  };

  // Calculate the total score
  const calculateScore = () => {
    let score = 0;
    Object.keys(correctAnswers).forEach((question) => {
      if (answers[question] === correctAnswers[question]) {
        score += 4; // Each question is worth 4 points
      }
    });
    return score;
  };

  // Validate if all questions are answered
  const validateAnswers = () => {
    const allAnswered = Object.values(answers).every((answer) => answer !== "");
    setAllQuestionsAnswered(allAnswered);
    return allAnswered;
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validate if all questions are answered
    if (!validateAnswers()) {
      setShowError(true); // Show error message
      return;
    }

    setSubmitted(true);

    // If qcmResult is already set, display a message and return
    if (qcmResult !== null) {
      alert(`لقد أكملت هذا الاختبار بالفعل. نتيجتك هي: ${qcmResult}/20`);
      return;
    }

    // Map answers to numerical values
    const q1 = mapAnswerToValue("q1", answers.q1);
    const q2 = mapAnswerToValue("q2", answers.q2);
    const q3 = mapAnswerToValue("q3", answers.q3);
    const q4 = mapAnswerToValue("q4", answers.q4);
    const q5 = mapAnswerToValue("q5", answers.q5);

    // Calculate the total score
    const newQcmResult = calculateScore();

    // Prepare the data to send to the API
    const data = {
      qcmResult: newQcmResult,
      q1,
      q2,
      q3,
      q4,
      q5,
    };

    try {
      // Retrieve the user object from local storage
      const user = JSON.parse(localStorage.getItem("user"));

      // Extract the student ID from the user object
      const studentId = user.id; // Use the ID from local storage

      // Retrieve the token from local storage
      const token = localStorage.getItem("token");

      // Make the API call with the token in the headers
      const response = await axios.put(
        `https://site-educatif-4.onrender.com/api/students/${studentId}/qcmResult`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );

      console.log("API Response:", response.data);
      alert("تم تحديث النتيجة بنجاح!");
      setQcmResult(newQcmResult); // Update the state with the new qcmResult
    } catch (error) {
      console.error("Error updating QCM result:", error);
      alert("حدث خطأ أثناء تحديث النتيجة!");
    }
  };

  // Function to determine if an answer is correct
  const isAnswerCorrect = (question, answer) => {
    return answer === correctAnswers[question];
  };

  // Function to get the style for an answer
  const getAnswerStyle = (question, answer) => {
    if (reviewing && answers[question] === answer) {
      return isAnswerCorrect(question, answer)
        ? { color: "green", fontWeight: "bold" } // Green for correct
        : { color: "red", fontWeight: "bold" }; // Red for incorrect
    }
    return {}; // Default style
  };
  document.title = "ركن التمارين | الموقع التعليمي";
  return (
    <React.Fragment>
      <div className="page-content" dir="rtl">
        <Container fluid>
          {/* Breadcrumb */}
          <Card
            style={{
              backgroundImage: `url(${backgroundImage})`, // Set background image
              backgroundSize: "cover ", // Keep the original size of the image
              backgroundPosition: "center", // Center the image right
              backgroundRepeat: "no-repeat", // Prevent the image from repeating
              minHeight: "100vh", // Set minimum height to cover the full viewport
            }}
          >
            <CardHeader className="text-end">
              <h2 className="card-title mb-0 fs-1">
                اختبار الجهاز الهضمي للأرنب
              </h2>
            </CardHeader>
            <CardBody>
              {/* Display message if qcmResult is already set */}
              {qcmResult !== null && (
                <h3 className="text-center mb-4 fw-bold">
                  ✅ لقد أكملت هذا الاختبار بالفعل. تم إرسال نتيجتك إلى معلمك.
                  يمكنك المحاولة مرة أخرى ولكن بدون درجة.
                </h3>
              )}

              {/* Display error message if not all questions are answered */}
              {showError && (
                <Alert color="danger" className="text-center">
                  ❌ الرجاء الإجابة على جميع الأسئلة قبل تقديم الاختبار.
                </Alert>
              )}

              {/* Question 1 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  1. ما هو ترتيب الأجزاء التي يمر بها الغذاء في الجهاز الهضمي
                  للأرنب؟
                </h2>
                {[
                  "أ) الفم → المعدة → الأمعاء الدقيقة → الأمعاء الغليظة → الشرج",
                  "ب) الفم → البلعوم → المريء → المعدة → الأمعاء الدقيقة → الأمعاء الغليظة → الشرج",
                  "ج) الفم → الأمعاء الدقيقة → المريء → البلعوم → المعدة",
                ].map((option, index) => (
                  <div key={index} className="mb-3 text-end">
                    <Label
                      className="form-check-label fs-4 d-block"
                      style={getAnswerStyle("q1", option)}
                    >
                      <Input
                        type="radio"
                        id={`q1-option${index}`}
                        name="q1"
                        value={option}
                        checked={answers.q1 === option}
                        onChange={() => handleAnswerChange("q1", option)}
                        className="ms-2"
                        disabled={submitted} // Disable input after submission
                      />
                      {option}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 2 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  2. ما هي الوظيفة الرئيسية للبلعوم في الجهاز الهضمي للأرنب؟
                </h2>
                {[
                  "أ) هضم الطعام",
                  "ب) نقل الطعام من الفم إلى المريء",
                  "ج) امتصاص المواد الغذائية",
                ].map((option, index) => (
                  <div key={index} className="mb-3 text-end">
                    <Label
                      className="form-check-label fs-4 d-block"
                      style={getAnswerStyle("q2", option)}
                    >
                      <Input
                        type="radio"
                        id={`q2-option${index}`}
                        name="q2"
                        value={option}
                        checked={answers.q2 === option}
                        onChange={() => handleAnswerChange("q2", option)}
                        className="ms-2"
                        disabled={submitted} // Disable input after submission
                      />
                      {option}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 3 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  3. أي جزء من الجهاز الهضمي للأرنب مسؤول عن امتصاص الماء؟
                </h2>
                {["أ) الأمعاء الدقيقة", "ب) الأمعاء الغليظة", "ج) المعدة"].map(
                  (option, index) => (
                    <div key={index} className="mb-3 text-end">
                      <Label
                        className="form-check-label fs-4 d-block"
                        style={getAnswerStyle("q3", option)}
                      >
                        <Input
                          type="radio"
                          id={`q3-option${index}`}
                          name="q3"
                          value={option}
                          checked={answers.q3 === option}
                          onChange={() => handleAnswerChange("q3", option)}
                          className="ms-2"
                          disabled={submitted} // Disable input after submission
                        />
                        {option}
                      </Label>
                    </div>
                  )
                )}
              </div>

              {/* Question 4 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  4. ما هي الميزة الرئيسية للقناة الهضمية للأرنب؟
                </h2>
                {[
                  "أ) قصيرة جدًا",
                  "ب) طويلة وملفوفة",
                  "ج) تحتوي على معدتين",
                ].map((option, index) => (
                  <div key={index} className="mb-3 text-end">
                    <Label
                      className="form-check-label fs-4 d-block"
                      style={getAnswerStyle("q4", option)}
                    >
                      <Input
                        type="radio"
                        id={`q4-option${index}`}
                        name="q4"
                        value={option}
                        checked={answers.q4 === option}
                        onChange={() => handleAnswerChange("q4", option)}
                        className="ms-2"
                        disabled={submitted} // Disable input after submission
                      />
                      {option}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 5 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  5. كيف ينتهي مسار الغذاء في الجهاز الهضمي للأرنب؟
                </h2>
                {[
                  "أ) يدخل إلى الأمعاء الغليظة",
                  "ب) يخرج من فتحة الشرج",
                  "ج) يعود إلى الفم",
                ].map((option, index) => (
                  <div key={index} className="mb-3 text-end">
                    <Label
                      className="form-check-label fs-4 d-block"
                      style={getAnswerStyle("q5", option)}
                    >
                      <Input
                        type="radio"
                        id={`q5-option${index}`}
                        name="q5"
                        value={option}
                        checked={answers.q5 === option}
                        onChange={() => handleAnswerChange("q5", option)}
                        className="ms-2"
                        disabled={submitted} // Disable input after submission
                      />
                      {option}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              {!submitted && (
                <div className="text-center mt-4">
                  <Button
                    color="primary"
                    size="lg"
                    className="fs-4 px-5 fw-bold"
                    onClick={handleSubmit}
                  >
                    عرض النتيجة
                  </Button>
                </div>
              )}

              {/* Display Final Score */}
              {submitted && (
                <div className="mt-4 text-center">
                  <h4 className="fs-3">
                    النتيجة النهائية: {calculateScore()}/20
                  </h4>
                  <Button
                    color="secondary"
                    size="lg"
                    className="fs-4 px-5 fw-bold mt-3"
                    onClick={() => setReviewing(true)}
                  >
                    إصلاح
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Quiz;