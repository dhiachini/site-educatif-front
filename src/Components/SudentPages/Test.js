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
import axios from "axios"; // Import axios for API calls
import organsImage from "../../assets/images/organs.jpg";

const Test = () => {
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
          `http://localhost:5000/api/students/${studentId}/qcmResult`,
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
        `http://localhost:5000/api/students/${studentId}/qcmResult`,
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
  document.title = "أقيم | الموقع التعليمي";


  return (
    <React.Fragment>
      <div className="page-content" dir="rtl">
        <Container fluid>
          {/* Breadcrumb */}

          <Card>
            <CardHeader className="text-end">
              <h2 className="card-title mb-0 fs-1">التقييم </h2>
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
                  1. أرتب مسار الغذاء في الجهاز الهضمي لحيوان عاشب
                </h2>

                {/* Use w-50 to make the dropdowns 50% width */}
                <div className="input-group mb-3 w-50">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    1.
                  </label>
                  <select className="form-select fs-4" id="inputGroupSelect01">
                    <option selected>إختر...</option>
                    <option value="1">
                      3. مرور الغذاء الى المعدة عبر البلعوم والمريء
                    </option>
                    <option value="2">2. مضغ الطعام بالأسنان</option>
                    <option value="3">1. قضم الطعام وتفتيته</option>
                    <option value="4">
                      5. مرور باقي الغذاء الى الأمعاء الغليظة
                    </option>
                    <option value="5">6. التخلص من الفضلات</option>
                    <option value="6">
                      4. مرور الغذاء الى الأمعاء الدقيقة بعد تحولها الى حساء في
                      المعدة
                    </option>
                  </select>
                </div>

                <div className="input-group mb-3 w-50">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    2.
                  </label>
                  <select className="form-select fs-4" id="inputGroupSelect01">
                    <option selected>إختر...</option>
                    <option value="1">
                      3. مرور الغذاء الى المعدة عبر البلعوم والمريء
                    </option>
                    <option value="2">2. مضغ الطعام بالأسنان</option>
                    <option value="3">1. قضم الطعام وتفتيته</option>
                    <option value="4">
                      5. مرور باقي الغذاء الى الأمعاء الغليظة
                    </option>
                    <option value="5">6. التخلص من الفضلات</option>
                    <option value="6">
                      4. مرور الغذاء الى الأمعاء الدقيقة بعد تحولها الى حساء في
                      المعدة
                    </option>
                  </select>
                </div>

                <div className="input-group mb-3 w-50">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    3.
                  </label>
                  <select className="form-select fs-4" id="inputGroupSelect01">
                    <option selected>إختر...</option>
                    <option value="1">
                      3. مرور الغذاء الى المعدة عبر البلعوم والمريء
                    </option>
                    <option value="2">2. مضغ الطعام بالأسنان</option>
                    <option value="3">1. قضم الطعام وتفتيته</option>
                    <option value="4">
                      5. مرور باقي الغذاء الى الأمعاء الغليظة
                    </option>
                    <option value="5">6. التخلص من الفضلات</option>
                    <option value="6">
                      4. مرور الغذاء الى الأمعاء الدقيقة بعد تحولها الى حساء في
                      المعدة
                    </option>
                  </select>
                </div>

                <div className="input-group mb-3 w-50">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    4.
                  </label>
                  <select className="form-select fs-4" id="inputGroupSelect01">
                    <option selected>إختر...</option>
                    <option value="1">
                      3. مرور الغذاء الى المعدة عبر البلعوم والمريء
                    </option>
                    <option value="2">2. مضغ الطعام بالأسنان</option>
                    <option value="3">1. قضم الطعام وتفتيته</option>
                    <option value="4">
                      5. مرور باقي الغذاء الى الأمعاء الغليظة
                    </option>
                    <option value="5">6. التخلص من الفضلات</option>
                    <option value="6">
                      4. مرور الغذاء الى الأمعاء الدقيقة بعد تحولها الى حساء في
                      المعدة
                    </option>
                  </select>
                </div>

                <div className="input-group mb-3 w-50">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    5.
                  </label>
                  <select className="form-select fs-4" id="inputGroupSelect01">
                    <option selected>إختر...</option>
                    <option value="1">
                      3. مرور الغذاء الى المعدة عبر البلعوم والمريء
                    </option>
                    <option value="2">2. مضغ الطعام بالأسنان</option>
                    <option value="3">1. قضم الطعام وتفتيته</option>
                    <option value="4">
                      5. مرور باقي الغذاء الى الأمعاء الغليظة
                    </option>
                    <option value="5">6. التخلص من الفضلات</option>
                    <option value="6">
                      4. مرور الغذاء الى الأمعاء الدقيقة بعد تحولها الى حساء في
                      المعدة
                    </option>
                  </select>
                </div>

                <div className="input-group mb-3 w-50">
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                  >
                    6.
                  </label>
                  <select className="form-select fs-4" id="inputGroupSelect01">
                    <option selected>إختر...</option>
                    <option value="1">
                      3. مرور الغذاء الى المعدة عبر البلعوم والمريء
                    </option>
                    <option value="2">2. مضغ الطعام بالأسنان</option>
                    <option value="3">1. قضم الطعام وتفتيته</option>
                    <option value="4">
                      5. مرور باقي الغذاء الى الأمعاء الغليظة
                    </option>
                    <option value="5">6. التخلص من الفضلات</option>
                    <option value="6">
                      4. مرور الغذاء الى الأمعاء الدقيقة بعد تحولها الى حساء في
                      المعدة
                    </option>
                  </select>
                </div>
              </div>
              {/* Question 2 */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4">
                  2.أضع علامة * أمام الإجابة الصحيحة
                </h2>
                {[
                  "أ) يبدأ هضم الطعام في الفم عند الأرنب.",
                  "ب) الأرنب يستخدم أسنانه الخلفية لقضم الطعام.",
                  "ج)  مسار الغذاء في جهاز الهضمي للأرنب ينتهي بالأمعاء الدقيقة .",
                ].map((option, index) => (
                  <div key={index} className="mb-3 text-end">
                    <Label className="form-check-label fs-4 d-block">
                      <Input
                        type="radio"
                        id={`q2-option${index}`}
                        name="q2"
                        value={option}
                        checked={answers.q2 === option}
                        onChange={() => handleAnswerChange("q2", option)}
                        className="ms-2"
                      />
                      {option}
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

                    <div className="input-group mb-3">
                      <label className="input-group-text" htmlFor="inputText01">
                        [1]
                      </label>
                      <input
                        type="text"
                        className="form-control fs-4"
                        id="inputText01"
                        placeholder="أكمل...."
                      />
                    </div>

                    <div className="input-group mb-3">
                      <label className="input-group-text" htmlFor="inputText02">
                        [2]
                      </label>
                      <input
                        type="text"
                        className="form-control fs-4"
                        id="inputText02"
                        placeholder="أكمل...."
                      />
                    </div>

                    <div className="input-group mb-3">
                      <label className="input-group-text" htmlFor="inputText03">
                        [3]
                      </label>
                      <input
                        type="text"
                        className="form-control fs-4"
                        id="inputText03"
                        placeholder="أكمل...."
                      />
                    </div>

                    <div className="input-group mb-3">
                      <label className="input-group-text" htmlFor="inputText04">
                        [4]
                      </label>
                      <input
                        type="text"
                        className="form-control fs-4"
                        id="inputText04"
                        placeholder="أكمل...."
                      />
                    </div>

                    <div className="input-group mb-3">
                      <label className="input-group-text" htmlFor="inputText05">
                        [5]
                      </label>
                      <input
                        type="text"
                        className="form-control fs-4"
                        id="inputText05"
                        placeholder="أكمل...."
                      />
                    </div>

                    <div className="input-group mb-3">
                      <label className="input-group-text" htmlFor="inputText06">
                        [6]
                      </label>
                      <input
                        type="text"
                        className="form-control fs-4"
                        id="inputText06"
                        placeholder="أكمل...."
                      />
                    </div>
                  </div>
                </div>

                {/* Column for the fixed image */}
                <div className="col-md-4">
                  <img
                    src={organsImage}
                    alt="صورة الأنبوب الهضمي للحيوان العاشب"
                    className="img-fluid" // Makes the image responsive
                    style={{
                      width: "100%",
                      height: "auto",
                      marginLeft: "50px",
                    }} // Adjust marginLeft to move the image right
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

              {/* Display Final Score */}
              {submitted && (
                <div className="mt-4 text-center">
                  <h4 className="fs-3">
                    النتيجة النهائية: {calculateScore()}/20
                  </h4>
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
