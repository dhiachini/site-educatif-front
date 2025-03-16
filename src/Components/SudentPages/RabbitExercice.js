import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import BreadCrumb from "../Common/BreadCrumb";
import Swal from "sweetalert2"; // Import SweetAlert2

// Import Images
import RabbitImage from "../../assets/images/أرنب.png";
import MouthImage from "../../assets/images/الفم.png";
import EsophagusImage from "../../assets/images/المريء.png";
import StomachImage from "../../assets/images/المعدة.png";
import SmallIntestineImage from "../../assets/images/الأمعاء الدقيقة.png";
import LargeIntestineImage from "../../assets/images/الأمعاء الغليظة.png";
import PharynxImage from "../../assets/images/البلعوم.png";
import AnusImage from "../../assets/images/الشرج.png";
import backgroundImage from "../../assets/images/bg1.jpeg";
import SurgeryCursor from "../../assets/images/surgery.png"; // Import the custom cursor image

// Import Video
import RabbitVideo from "../../assets/images/rabbit.mp4"; // Import the video file

// Debug: Log the cursor path
console.log("Cursor Path:", SurgeryCursor);

// **Correct PDF lesson file path**
const lessonPath = "/assets/lessons/lesson.pdf";

// **Drop zones for each organ (x, y, width, height)**
const dropZones = {
  mouth: { x: 240, y: 140, width: 50, height: 50, label: "الفم" },
  pharynx: { x: 325, y: 184, width: 70, height: 70, label: "البلعوم" },
  esophagus: { x: 350, y: 267, width: 55, height: 55, label: "المريء" },
  stomach: { x: 364, y: 325, width: 83, height: 64, label: "المعدة" },
  "small-intestine": {
    x: 348,
    y: 402,
    width: 113,
    height: 62,
    label: "الأمعاء الدقيقة",
  },
  "large-intestine": {
    x: 330,
    y: 390,
    width: 150,
    height: 87,
    label: "الأمعاء الغليظة",
  },
  anus: { x: 374, y: 476, width: 60, height: 80, label: "الشرج" },
};

// **New final positions after correct placement**
const finalPositions = {
  mouth: { x: 201, y: 43, width: 144 },
  pharynx: { x: 297, y: 109, width: 153 },
  esophagus: { x: 325, y: 185, width: 133 },
  stomach: { x: 335, y: 195, width: 151 },
  "small-intestine": { x: 225, y: 309, width: 353 },
  "large-intestine": { x: 218, y: 288, width: 348 },
  anus: { x: 325, y: 410, width: 139 },
};

// **Initial list of organs**
const initialOrgans = [
  {
    id: "large-intestine",
    image: LargeIntestineImage,
    label: "الأمعاء الغليظة",
  },
  { id: "pharynx", image: PharynxImage, label: "البلعوم" },
  { id: "stomach", image: StomachImage, label: "المعدة" },
  { id: "mouth", image: MouthImage, label: "الفم" },
  {
    id: "small-intestine",
    image: SmallIntestineImage,
    label: "الأمعاء الدقيقة",
  },
  { id: "anus", image: AnusImage, label: "الشرج" },
  { id: "esophagus", image: EsophagusImage, label: "المريء" },
];

const RabbitExercice = () => {
  const [organs, setOrgans] = useState(initialOrgans);
  const [placedItems, setPlacedItems] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [laboratoryResult, setLaboratoryResult] = useState(null); // State to store the fetched laboratoryResult
  const [modal, setModal] = useState(false); // State to manage modal visibility
  const [selectedOrgan, setSelectedOrgan] = useState(null); // State to store the selected organ
  const [showVideoModal, setShowVideoModal] = useState(false); // State to manage video modal visibility
  const videoRef = useRef(null); // Référence pour la vidéo

  // **Fetch Student's Laboratory Result on Component Mount**
  useEffect(() => {
    const fetchLaboratoryResult = async () => {
      const studentId = JSON.parse(localStorage.getItem("user")).id; // Get studentId from local storage

      try {
        const response = await fetch(
          `https://site-educatif-4.onrender.com/api/students/${studentId}/laboratoryResult`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch laboratory result");
        }
        const data = await response.json();
        setLaboratoryResult(data.laboratoryResult); // Set the fetched laboratoryResult
      } catch (error) {
        console.error("Error fetching laboratory result:", error);
      }
    };

    fetchLaboratoryResult();
  }, []);

  // **Handle Drag Start**
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  // **Handle Drop**
  const handleDrop = (e) => {
    e.preventDefault();
    if (exerciseFinished) return;

    const id = e.dataTransfer.getData("text/plain");
    const organ = organs.find((item) => item.id === id);
    const dropZone = dropZones[id];

    // **Get mouse position relative to the rabbit image**
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // **Check if dropped in correct area**
    const isCorrect =
      x >= dropZone.x &&
      x <= dropZone.x + dropZone.width &&
      y >= dropZone.y &&
      y <= dropZone.y + dropZone.height;

    if (isCorrect) {
      const newPosition = finalPositions[id] || dropZone;
      setPlacedItems((prev) => [...prev, { ...organ, position: newPosition }]);
      setOrgans((prev) => prev.filter((item) => item.id !== id));

      Swal.fire({
        icon: "success",
        title: "أحسنت",
        text: "تم وضع العضو الصحيح في مكانه",
        confirmButtonText: "حسناً",
        timer: 1500,
        timerProgressBar: true,
      });
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes >= 3) {
        setExerciseFinished(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "هذا الجزء ليس في المكان الصحيح. حاول مرة أخرى!",
          confirmButtonText: "حسناً",
          timer: 1500,
          timerProgressBar: true,
        });
      }
    }

    // **Check if all organs are placed**
    if (placedItems.length + 1 === Object.keys(dropZones).length) {
      setExerciseFinished(true);
    }
  };

  // **Calculate Stars**
  const calculateStars = () => {
    if (mistakes >= 3) return 0;
    return 5 - mistakes;
  };

  const stars = calculateStars();

  // **Map mistakes to laboratoryResult**
  const getLaboratoryResult = () => {
    if (mistakes >= 3) return 0;
    if (mistakes === 2) return 3;
    if (mistakes === 1) return 4;
    if (mistakes === 0) return 5;
  };

  // **Call API to update laboratoryResult**
  const updateLaboratoryResult = async () => {
    const studentId = JSON.parse(localStorage.getItem("user")).id; // Get studentId from local storage
    const newLaboratoryResult = getLaboratoryResult();

    try {
      const response = await fetch(
        `https://site-educatif-4.onrender.com/api/students/${studentId}/laboratoryResult`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ laboratoryResult: newLaboratoryResult }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update laboratory result");
      }

      const data = await response.json();
      console.log("Laboratory result updated:", data);
      setLaboratoryResult(newLaboratoryResult); // Update the state with the new laboratoryResult
    } catch (error) {
      console.error("Error updating laboratory result:", error);
    }
  };

  // **Trigger API call when exercise is finished**
  useEffect(() => {
    if (exerciseFinished && laboratoryResult === null) {
      updateLaboratoryResult();
    }
  }, [exerciseFinished, laboratoryResult]);

  // **Trigger video modal when exercise is finished with fewer than 3 mistakes**
  useEffect(() => {
    if (exerciseFinished && mistakes < 3) {
      setShowVideoModal(true);
    }
  }, [exerciseFinished, mistakes]);

  // **Toggle Modal**
  const toggleModal = (organ) => {
    setSelectedOrgan(organ);
    setModal(!modal);
  };

  // **Toggle Video Modal**
  const toggleVideoModal = () => {
    if (showVideoModal && videoRef.current) {
      videoRef.current.pause(); // Pause the video when closing the modal
    }
    setShowVideoModal(!showVideoModal);
  };

  document.title = "أجرب | الموقع التعليمي";

  return (
    <div
      className="page-content"
      dir="rtl"
      style={{ cursor: `url(${SurgeryCursor}), pointer` }} // Apply custom cursor with fallback
    >
      <Container fluid>
        <Card
          style={{
            backgroundImage: `url(${backgroundImage})`, // Set background image
            backgroundSize: "cover", // Keep the original size of the image
            backgroundPosition: "center", // Center the image
            backgroundRepeat: "no-repeat", // Prevent the image from repeating
            minHeight: "100vh", // Set minimum height to cover the full viewport
          }}
        >
          <CardBody>
            <Row>
              {/* **Organs on the Left (Now Same Size)** */}
              <Col md={4}>
                <h3 className="text-center mb-4 fw-bold">🧩 الأعضاء</h3>
                <div className="d-flex flex-wrap justify-content-center">
                  {!exerciseFinished &&
                    organs.map((organ) => (
                      <div
                        key={organ.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, organ.id)}
                        className="text-center mx-2 my-3"
                        style={{ cursor: "move", width: "45%", margin: "5px" }}
                      >
                        <img
                          src={organ.image}
                          alt={organ.label}
                          style={{
                            width: "150px",
                            height: "150px",
                            marginBottom: "10px",
                          }}
                        />
                        <p className="fw-bold fs-4">{organ.label}</p>
                        <Button
                          color="primary"
                          onClick={() => toggleModal(organ)}
                        >
                          عرض
                        </Button>
                      </div>
                    ))}
                </div>
              </Col>

              {/* **Rabbit on the Right** */}
              <Col md={8}>
                <h3 className="text-center mb-4 fw-bold">
                  {laboratoryResult !== null
                    ? "✅ لقد أكملت هذا الاختبار بالفعل. تم إرسال نتيجتك إلى معلمك. يمكنك المحاولة مرة أخرى ولكن بدون درجة."
                    : exerciseFinished
                    ? "🎯 التمرين انتهى"
                    : "🔹 ضع الأعضاء في أماكنها الصحيحة"}
                </h3>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "600px",
                    backgroundImage: `url(${RabbitImage})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                  }}
                >
                  {/* Render placed organs */}
                  {placedItems.map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.label}
                      style={{
                        position: "absolute",
                        left: `${item.position.x}px`,
                        top: `${item.position.y}px`,
                        width: `${item.position.width}px`,
                        cursor: "pointer",
                      }}
                      onClick={() => toggleModal(item)}
                    />
                  ))}
                </div>

                {/* Result Display */}
                {exerciseFinished && (
                  <div className="text-center mt-4">
                    {mistakes >= 3 ? (
                      <>
                        <h2 className="text-danger fw-bold">
                          🚫 لقد تجاوزت الحد الأقصى للأخطاء (3 أخطاء). النتيجة:
                          0 نجوم.
                        </h2>
                        <Button
                          color="danger"
                          className="mt-3 fs-5"
                          onClick={() => window.open(lessonPath, "_blank")}
                        >
                          📖 قم بمراجعة الدرس هنا
                        </Button>
                      </>
                    ) : (
                      <>
                        <h2 className="text-success fw-bold">
                          🎉 أحسنت! لقد أكملت التمرين! 🎉
                        </h2>
                        <div className="d-flex justify-content-center">
                          {Array(stars)
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
                      </>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Modal to display the organ image */}
        <Modal
          isOpen={modal}
          toggle={() => toggleModal(null)}
          contentClassName="transparent-modal-content" // Apply custom class
          backdropClassName="transparent-backdrop" // Apply custom backdrop class
          backdrop="static"
        >
          <ModalHeader toggle={() => toggleModal(null)}>
            {selectedOrgan ? selectedOrgan.label : ""}
          </ModalHeader>
          <ModalBody className="text-center">
            {selectedOrgan && (
              <img
                src={selectedOrgan.image}
                alt={selectedOrgan.label}
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "transparent", // Ensure the image background is transparent
                }}
              />
            )}
          </ModalBody>
        </Modal>

        {/* Modal to display the video */}
        <Modal
          isOpen={showVideoModal}
          toggle={toggleVideoModal}
          size="lg"
          onClosed={() => {
            if (videoRef.current) {
              videoRef.current.pause(); // Pause the video when the modal is closed
              videoRef.current.currentTime = 0; // Reset the video to the beginning
            }
          }}
        >
          <ModalHeader toggle={toggleVideoModal} className="text-center">
            🎥 فيديو مسار الطعام في الجهاز الهضمي للأرنب
          </ModalHeader>
          <ModalBody className="text-center">
            <video
              ref={videoRef}
              autoPlay
              controls
              style={{ width: "370px", height: "600px" }}
            >
              <source src={RabbitVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </ModalBody>
        </Modal>

        {/* Add the <style> tag here */}
        <style>
          {`
    .transparent-modal-content {
      background-color: transparent !important;
      border: 2px solid red !important; /* Add a red border */
      box-shadow: none !important;
    }

    /* Add blur effect to the backdrop */
    .transparent-backdrop {
      background-color: transparent !important;
      backdrop-filter: blur(20px); /* Apply blur effect */
    }

    /* Style for the modal header */
    .transparent-modal-content .modal-header {
      background-color: white !important; /* Set header background to white */
      border-bottom: 1px solid #dee2e6 !important; /* Optional: Add a border */
      display: flex;
      justify-content: center; /* Center the text horizontally */
      align-items: center; /* Center the text vertically */
    }

    /* Style for the organ name in the header */
    .transparent-modal-content .modal-header .modal-title {
      font-size: 1.5rem; /* Increase font size */
      font-weight: bold; /* Make the text bold */
      text-align: center; /* Center the text */
    }
  `}
        </style>
      </Container>
    </div>
  );
};

export default RabbitExercice;