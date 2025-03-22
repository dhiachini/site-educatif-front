import React, { useState } from "react";
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
import organsImage from "../../assets/images/organs.jpg";

const Test = () => {
  // State to track selected answers
  const [answers, setAnswers] = useState({
    q1: ["", "", "", "", "", ""], // Array for dropdown selections in Q1
    q2: "", // Radio button selection for Q2
    q3: ["", "", "", "", "", "", ""], // Array for text inputs in Q3
  });

  // State to track if the quiz is submitted
  const [submitted, setSubmitted] = useState(false);

  // State to track if all questions are answered
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);

  // State to display error message
  const [showError, setShowError] = useState(false);

  // State to track if correction is shown
  const [showCorrection, setShowCorrection] = useState(false);

  // Correct answers
  const correctAnswers = {
    q1: ["1", "2", "3", "4", "5", "6"], // Correct order for Q1 dropdowns
    q2: "أ) يبدأ هضم الطعام في الفم عند الأرنب.", // Correct answer for Q2
    q3: [
      "الفم",
      "البلعوم",
      "المريء",
      "المعدة",
      "الأمعاء الغليظة",
      "الأمعاء الدقيقة",
      "الشرج",
    ], // Correct answers for Q3 text inputs (swapped)
  };

  // Handle answer selection for Q1 dropdowns
  const handleQ1Change = (index, value) => {
    const newQ1Answers = [...answers.q1];
    newQ1Answers[index] = value;
    setAnswers({ ...answers, q1: newQ1Answers });
  };

  // Handle answer selection for Q2 radio buttons
  const handleQ2Change = (value) => {
    setAnswers({ ...answers, q2: value });
  };

  // Handle answer input for Q3 text fields
  const handleQ3Change = (index, value) => {
    const newQ3Answers = [...answers.q3];
    newQ3Answers[index] = value.trim(); // Trim spaces from the input
    setAnswers({ ...answers, q3: newQ3Answers });
  };

  // Validate if all questions are answered
  const validateAnswers = () => {
    const isQ1Answered = answers.q1.every((answer) => answer !== "");
    const isQ2Answered = answers.q2 !== "";
    const isQ3Answered = answers.q3.every((answer) => answer !== "");

    const allAnswered = isQ1Answered && isQ2Answered && isQ3Answered;
    setAllQuestionsAnswered(allAnswered);
    return allAnswered;
  };

  // Calculate stars based on mistakes
  const calculateStars = () => {
    let stars = 0;

    // Q1: 2 stars if all correct, 1 star if 1 mistake, 0 stars if 2+ mistakes
    const q1Mistakes = answers.q1.filter(
      (answer, index) => answer !== correctAnswers.q1[index]
    ).length;
    if (q1Mistakes === 0) {
      stars += 2;
    } else if (q1Mistakes === 1) {
      stars += 1;
    }

    // Q2: 1 star if correct, 0 stars if mistake
    if (answers.q2 === correctAnswers.q2) {
      stars += 1;
    }

    // Q3: 3 stars if all correct, 2 stars if 1 mistake, 1 star if 2 mistakes, 0 stars if 3+ mistakes
    const q3Mistakes = answers.q3.filter(
      (answer, index) => answer.trim() !== correctAnswers.q3[index] // Trim spaces before comparison
    ).length;
    if (q3Mistakes === 0) {
      stars += 3;
    } else if (q3Mistakes === 1) {
      stars += 2;
    } else if (q3Mistakes === 2) {
      stars += 1;
    }

    return stars;
  };

  // Handle submit
  const handleSubmit = () => {
    // Validate if all questions are answered
    if (!validateAnswers()) {
      setShowError(true); // Show error message
      return;
    }

    setSubmitted(true);
  };

  // Handle correction display
  const handleShowCorrection = () => {
    setShowCorrection(true);
  };

  document.title = "أقيم | الموقع التعليمي";

  return (
    <React.Fragment>
      <div className="page-content" dir="rtl">
        <Container fluid>
          <Card>
            <CardHeader className="text-end">
              <h2 className="card-title mb-0 fs-1">التقييم </h2>
            </CardHeader>
            <CardBody>
              {/* Display error message if not all questions are answered */}
              {showError && (
                <Alert color="danger" className="text-center">
                  ❌ الرجاء الإجابة على جميع الأسئلة قبل تقديم الاختبار.
                </Alert>
              )}

              {/* Question 1 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  1. أرتب مسار الغذاء في الجهاز الهضمي لحيوان عاشب
                </h2>

                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="input-group mb-3 w-50">
                    <label className="input-group-text" htmlFor={`q1-${index}`}>
                      {index}.
                    </label>
                    <select
                      className="form-select fs-4"
                      id={`q1-${index}`}
                      value={answers.q1[index - 1]}
                      onChange={(e) =>
                        handleQ1Change(index - 1, e.target.value)
                      }
                      style={{
                        backgroundColor:
                          showCorrection &&
                          answers.q1[index - 1] !== correctAnswers.q1[index - 1]
                            ? "#ffcccc" // Red background for incorrect answers
                            : showCorrection &&
                              answers.q1[index - 1] ===
                                correctAnswers.q1[index - 1]
                            ? "#ccffcc" // Green background for correct answers
                            : "white", // Default background
                      }}
                      disabled={showCorrection} // Disable dropdowns when correction is shown
                    >
                      <option value="">إختر...</option>
                      <option value="3">
                        مرور الغذاء الى المعدة عبر البلعوم والمريء
                      </option>
                      <option value="6">التخلص من الفضلات</option>
                      <option value="4">
                        مرور الغذاء الى الأمعاء الدقيقة بعد تحولها الى حساء في
                        المعدة
                      </option>
                      <option value="1">قضم الطعام وتفتيته</option>
                      <option value="5">
                        مرور باقي الغذاء الى الأمعاء الغليظة
                      </option>
                      <option value="2">مضغ الطعام بالأسنان</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Question 2 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  2. أضع علامة * أمام الإجابة الصحيحة
                </h2>
                {[
                  "أ) يبدأ هضم الطعام في الفم عند الأرنب.",
                  "ب) الأرنب يستخدم أسنانه الخلفية لقضم الطعام.",
                  "ج) مسار الغذاء في جهاز الهضمي للأرنب ينتهي بالأمعاء الدقيقة.",
                ].map((option, index) => (
                  <div key={index} className="mb-3 text-end">
                    <Label className="form-check-label fs-4 d-block">
                      <Input
                        type="radio"
                        id={`q2-option${index}`}
                        name="q2"
                        value={option}
                        checked={answers.q2 === option}
                        onChange={() => handleQ2Change(option)}
                        className="ms-2"
                        disabled={showCorrection} // Disable radio buttons when correction is shown
                      />
                      <span
                        style={{
                          color:
                            showCorrection && option === correctAnswers.q2
                              ? "green" // Green text for correct answer
                              : showCorrection &&
                                answers.q2 !== correctAnswers.q2
                              ? "red" // Red text for incorrect answer
                              : "black", // Default text color
                        }}
                      >
                        {option}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 3 */}
              <div className="row">
                {/* Column for the form */}
                <div className="col-md-8 w-50">
                  <div className="mb-5 w-100">
                    <h2 className="fw-bold mb-4">
                      3. أكمل الفراغات التالية استنادا على صورة الأنبوب الهضمي
                      للحيوان العاشب
                    </h2>

                    {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                      <div key={index} className="input-group mb-3">
                        <label
                          className="input-group-text"
                          htmlFor={`q3-${index}`}
                        >
                          [{index}]
                        </label>
                        <input
                          type="text"
                          className="form-control fs-4"
                          id={`q3-${index}`}
                          placeholder="أكمل...."
                          value={
                            showCorrection &&
                            answers.q3[index - 1].trim() !==
                              correctAnswers.q3[index - 1]
                              ? `${answers.q3[index - 1]} (${
                                  correctAnswers.q3[index - 1]
                                })` // Show correct answer in parentheses if incorrect
                              : answers.q3[index - 1]
                          }
                          onChange={(e) =>
                            handleQ3Change(index - 1, e.target.value)
                          }
                          style={{
                            backgroundColor:
                              showCorrection &&
                              answers.q3[index - 1].trim() !==
                                correctAnswers.q3[index - 1]
                                ? "#ffcccc" // Red background for incorrect answers
                                : showCorrection &&
                                  answers.q3[index - 1].trim() ===
                                    correctAnswers.q3[index - 1]
                                ? "#ccffcc" // Green background for correct answers
                                : "white", // Default background
                          }}
                          disabled={showCorrection} // Disable input fields when correction is shown
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column for the fixed image */}
                <div className="col-md-4">
                  <img
                    src={organsImage}
                    alt="صورة الأنبوب الهضمي للحيوان العاشب"
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginLeft: "50px",
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-4">
                <Button
                  color="primary"
                  size="lg"
                  className="fs-4 px-5 fw-bold "
                  onClick={handleSubmit}
                >
                  عرض النتيجة
                </Button>
              </div>

              {/* Display Final Score and Stars */}
              {submitted && (
                <div className="mt-4 text-center">
                  <h2 className="text-success fw-bold">
                    🎉 أحسنت! لقد أكملت التمرين! 🎉
                  </h2>
                  {calculateStars() === 0 ? (
                    <h3 className="text-danger fw-bold">صفر نجوم</h3>
                  ) : (
                    <div className="d-flex justify-content-center">
                      {Array(calculateStars())
                        .fill()
                        .map((_, i) => (
                          <span
                            key={i}
                            style={{ fontSize: "3rem", color: "gold" }}
                          >
                            ⭐
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Correction Button */}
              {submitted && (
                <div className="text-center mt-4">
                  <Button
                    color="secondary"
                    size="lg"
                    className="fs-4 px-5 fw-bold "
                    onClick={handleShowCorrection}
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

export default Test;
