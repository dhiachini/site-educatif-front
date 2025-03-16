import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Label,
  Container,
} from "reactstrap";
import BreadCrumb from "../Common/BreadCrumb";
import { useParams } from "react-router-dom"; // Use useParams to get the ID from the URL
import { FaCheck, FaTimes } from "react-icons/fa"; // Import icons from react-icons
import axios from "axios"; // Import axios for API calls

const QcmDetails = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState(null);

  // Fetch student data by ID
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `https://site-educatif-4.onrender.com/api/students/${id}`
        );
        setStudent(response.student); // Correctly set the student data
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [id]);

  // If student data is not yet loaded, show a loading message
  if (!student) {
    return <div>Loading...</div>;
  }

  // Correct answers
  const correctAnswers = {
    q1: "ب) الفم → البلعوم → المريء → المعدة → الأمعاء الدقيقة → الأمعاء الغليظة → الشرج",
    q2: "ب) نقل الطعام من الفم إلى المريء",
    q3: "ب) الأمعاء الغليظة",
    q4: "ب) طويلة وملفوفة",
    q5: "ب) يخرج من فتحة الشرج",
  };

  // Student's answers (numerical values)
  const studentAnswers = {
    q1: student.q1,
    q2: student.q2,
    q3: student.q3,
    q4: student.q4,
    q5: student.q5,
    Result: student.qcmResult, // Access qcmResult from the student object
  };

  // Map numerical values to answer options
  const answerOptions = {
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

  // Function to get the student's selected answer
  const getStudentAnswer = (question) => {
    const answerIndex = studentAnswers[question] - 1; // Convert to 0-based index
    return answerOptions[question][answerIndex];
  };

  // Function to determine if an answer is correct
  const isAnswerCorrect = (question, answer) => {
    const studentAnswer = getStudentAnswer(question);
    return studentAnswer === correctAnswers[question];
  };

  // Function to get the style for an answer
  const getAnswerStyle = (question, answer) => {
    const studentAnswer = getStudentAnswer(question);
    if (studentAnswer === answer) {
      return isAnswerCorrect(question, answer)
        ? { color: "green", fontWeight: "bold" } // Green for correct
        : { color: "red", fontWeight: "bold" }; // Red for incorrect
    }
    return {}; // Default style
  };

  return (
    <React.Fragment>
      <div className="page-content" dir="rtl">
        <Container fluid>
          {/* Breadcrumb */}
          <BreadCrumb title="تفاصيل الأخطاء" />
          <Card>
            <CardHeader className="text-end">
              <h2 className="card-title mb-0 fs-1">تفاصيل الأخطاء</h2>
            </CardHeader>
            <CardBody>
              {/* Question 1 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  1. ما هو ترتيب الأجزاء التي يمر بها الغذاء في الجهاز الهضمي
                  للأرنب؟
                </h2>
                {answerOptions.q1.map((option, index) => (
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
                        checked={getStudentAnswer("q1") === option}
                        readOnly
                        className="ms-2"
                      />
                      {option}
                      {getStudentAnswer("q1") === option && (
                        <span className="ms-2">
                          {isAnswerCorrect("q1", option) ? (
                            <FaCheck color="green" />
                          ) : (
                            <FaTimes color="red" />
                          )}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 2 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  2. ما هي الوظيفة الرئيسية للبلعوم في الجهاز الهضمي للأرنب؟
                </h2>
                {answerOptions.q2.map((option, index) => (
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
                        checked={getStudentAnswer("q2") === option}
                        readOnly
                        className="ms-2"
                      />
                      {option}
                      {getStudentAnswer("q2") === option && (
                        <span className="ms-2">
                          {isAnswerCorrect("q2", option) ? (
                            <FaCheck color="green" />
                          ) : (
                            <FaTimes color="red" />
                          )}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 3 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  3. أي جزء من الجهاز الهضمي للأرنب مسؤول عن امتصاص الماء؟
                </h2>
                {answerOptions.q3.map((option, index) => (
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
                        checked={getStudentAnswer("q3") === option}
                        readOnly
                        className="ms-2"
                      />
                      {option}
                      {getStudentAnswer("q3") === option && (
                        <span className="ms-2">
                          {isAnswerCorrect("q3", option) ? (
                            <FaCheck color="green" />
                          ) : (
                            <FaTimes color="red" />
                          )}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 4 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  4. ما هي الميزة الرئيسية للقناة الهضمية للأرنب؟
                </h2>
                {answerOptions.q4.map((option, index) => (
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
                        checked={getStudentAnswer("q4") === option}
                        readOnly
                        className="ms-2"
                      />
                      {option}
                      {getStudentAnswer("q4") === option && (
                        <span className="ms-2">
                          {isAnswerCorrect("q4", option) ? (
                            <FaCheck color="green" />
                          ) : (
                            <FaTimes color="red" />
                          )}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Question 5 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  5. كيف ينتهي مسار الغذاء في الجهاز الهضمي للأرنب؟
                </h2>
                {answerOptions.q5.map((option, index) => (
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
                        checked={getStudentAnswer("q5") === option}
                        readOnly
                        className="ms-2"
                      />
                      {option}
                      {getStudentAnswer("q5") === option && (
                        <span className="ms-2">
                          {isAnswerCorrect("q5", option) ? (
                            <FaCheck color="green" />
                          ) : (
                            <FaTimes color="red" />
                          )}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <h4 className="fs-3">النتيجة النهائية: {studentAnswers.Result}/20</h4>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default QcmDetails;