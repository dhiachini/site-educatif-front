import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom"; // Move the import to the top
import BreadCrumb from "../Common/BreadCrumb";
import StarRating from "./StarRating"; // Import the StarRating component
import Swal from "sweetalert2"; // Import SweetAlert

const StudentsTable = () => {
  // State for modals
  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => setmodal_list(!modal_list);

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = () => setmodal_delete(!modal_delete);

  // State for student data
  const [selectedStudent, setSelectedStudent] = useState({
    level: "",
    fullName: "",
    email: "",
    password: "",
    _id: "",
  });

  // State for filtering and searching
  const [selectedLevel, setSelectedLevel] = useState("الكل"); // Default to "الكل" (All)
  const [searchQuery, setSearchQuery] = useState("");

  // State for levels fetched from the API
  const [levels, setLevels] = useState([]);

  // State for errors and loading
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for students data (initialize as an empty array)
  const [studentsData, setStudentsData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  // Fetch levels from the API
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get(
          "https://site-educatif-4.onrender.com/api/levels/alllevels"
        );
        const levelsData = response.map((level) => level.level); // Extract only the level names
        setLevels(levelsData);
      } catch (error) {
        console.error("❌ Error fetching levels:", error);
        setError("فشل تحميل المستويات، يرجى المحاولة لاحقًا");
      }
    };

    fetchLevels();
  }, []);

  // Fetch students from the API
  const fetchStudents = async () => {
    try {
      const response = await axios.get("https://site-educatif-4.onrender.com/api/students");
      console.log(response);
      if (Array.isArray(response)) {
        setStudentsData(response);
      } else {
        console.error("❌ Unexpected API response format:", response);
        setError("فشل تحميل الطلاب، يرجى المحاولة لاحقًا");
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      setError("فشل تحميل الطلاب، يرجى المحاولة لاحقًا");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input changes for the new student form
  const handleInputChange = (e) => {
    setSelectedStudent({ ...selectedStudent, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding a new student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const studentData = {
        level: selectedStudent.level,
        fullName: selectedStudent.fullName,
        email: selectedStudent.email,
        password: selectedStudent.password,
      };

      const response = await axios.post(
        "https://site-educatif-4.onrender.com/api/students/add",
        studentData
      );

      console.log("✅ Student added:", response.data);
      tog_list(); // Close the modal after successful submission
      setSelectedStudent({ level: "", fullName: "", email: "", password: "" }); // Reset form
      fetchStudents(); // Refresh the students list
      Swal.fire({
        icon: "success",
        title: "تمت الإضافة بنجاح",
      });
    } catch (error) {
      console.error("❌ Error adding student:", error);
      setAddError("فشل في إضافة التلميذ، يرجى المحاولة مرة أخرى");
      Swal.fire({
        icon: "error",
        title: "فشل في الإضافة",
        text: "فشل في إضافة التلميذ، يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter students based on selected level and search query
  const filteredData = studentsData.filter((student) => {
    const matchesLevel =
      selectedLevel === "الكل" || student.level === selectedLevel;
    const matchesSearch = student.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  document.title = "جدول التلاميذ | الموقع التعليمي";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="جدول التلاميذ" pageTitle="Tables" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="text-end">
                  <h2 className="card-title mb-0 fs-1">جدول التلاميذ</h2>
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <Row className="g-4 mb-3">
                      <Col className="col-sm-auto">
                        <div className="d-flex justify-content-center">
                          <Button
                            color="success"
                            className="add-btn px-4 py-2 fw-bold text-white"
                            onClick={tog_list}
                            id="create-btn"
                            style={{ width: "200px", fontSize: "1.25rem" }}
                          >
                            <i className="ri-add-line align-bottom me-2"></i>
                            إضافة تلميذ
                          </Button>
                        </div>
                      </Col>
                      <Col className="col-sm">
                        <div className="d-flex justify-content-sm-end">
                          <div className="search-box ms-2">
                            <input
                              type="text"
                              className="form-control search"
                              placeholder="ابحث..."
                              dir="rtl"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                          <div className="ms-2">
                            <select
                              className="form-select fs-5 fw-bold"
                              value={selectedLevel}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              style={{ width: "150px" }}
                            >
                              <option value="الكل">الكل</option>
                              {levels.map((level, index) => (
                                <option key={index} value={level}>
                                  {level}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Render the table only if studentsData is available */}
                    {studentsData.length > 0 ? (
                      <div className="table-responsive table-card mt-3 mb-1">
                        <table
                          className="table align-middle table-nowrap text-end"
                          id="customerTable"
                          style={{ fontSize: "1.25rem" }}
                        >
                          <thead className="table-light">
                            <tr>
                              <th data-sort="action">
                                <h2> تفاصيل الأخطاء </h2>
                              </th>
                              <th style={{ width: "20%" }}>
                                <h2>نتيجة المختبر الافتراضي</h2>
                              </th>
                              <th style={{ width: "20%" }}>
                                <h2>نتيجة الاختبار</h2>
                              </th>
                              <th style={{ width: "15%" }}>
                                <h2>المستوى</h2>
                              </th>
                              <th style={{ width: "20%" }}>
                                <h2>البريد الإلكتروني</h2>
                              </th>
                              <th style={{ width: "20%" }}>
                                <h2>الاسم واللقب</h2>
                              </th>
                              <th style={{ width: "10%" }}>
                                <h2>الحالة</h2>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="list form-check-all">
                            {currentItems.map((student) => (
                              <tr key={student._id}>
                                <td>
                                  <div className="gap-2">
                                    <div className="remove">
                                      <Link
                                        to={`/qcm-details/${student._id}`} // Pass only the student ID in the URL
                                        className="btn btn-sm btn-danger remove-item-btn fw-bold fs-5"
                                      >
                                        التفاصيل
                                      </Link>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {student.laboratoryResult === null ? (
                                    "لا يوجد تقييم" // Display "لا يوجد تقييم" if laboratoryResult is null
                                  ): student.laboratoryResult === 0 ? (
                                    "صفر" // Display "صفر" if laboratoryResult is 3
                                  )  : student.laboratoryResult === 0 ? (
                                    <StarRating rating={5} /> // 5 stars if laboratoryResult is 0
                                  ) : student.laboratoryResult === 1 ? (
                                    <StarRating rating={4} /> // 4 stars if laboratoryResult is 1
                                  ) : student.laboratoryResult === 2 ? (
                                    <StarRating rating={3} /> // 3 stars if laboratoryResult is 2
                                  ) : (
                                    <StarRating
                                      rating={student.laboratoryResult}
                                    /> // Default behavior for other values
                                  )}
                                </td>
                                <td>
                                  {student.qcmResult !== null
                                    ? student.qcmResult + "/20"
                                    : "لا يوجد تقييم"}
                                </td>
                                <td>{student.level}</td>
                                <td>{student.email}</td>
                                <td>{student.fullName}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      student.labResult !== null &&
                                      student.qcmResult !== null
                                        ? "bg-success-subtle text-success"
                                        : "bg-danger-subtle text-danger"
                                    } text-uppercase`}
                                  >
                                    {student.labResult !== null &&
                                    student.qcmResult !== null
                                      ? "نشط"
                                      : "غير نشط"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="noresult">
                        <div className="text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: "75px", height: "75px" }}
                          ></lord-icon>
                          <h5 className="mt-2">
                            عذرًا! لم يتم العثور على نتائج
                          </h5>
                        </div>
                      </div>
                    )}

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-3">
                      <Button
                        color="primary"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="me-2"
                      >
                        السابق
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={indexOfLastItem >= filteredData.length}
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={modal_list} toggle={tog_list} centered dir="rtl">
        <ModalHeader className="bg-light p-3" toggle={tog_list}>
          <h3>إضافة تلميذ جديد</h3>
        </ModalHeader>
        <form className="tablelist-form" onSubmit={handleSubmit}>
          <ModalBody>
            <div className="mb-3">
              <Label htmlFor="selectLevel" className="form-label">
                <h2>اختر المستوى</h2>
              </Label>
              <select
                className="form-select fs-5 fw-bold"
                id="selectLevel"
                name="level"
                value={selectedStudent.level}
                onChange={handleInputChange}
                required
              >
                <option value="">اختر المستوى</option>
                {levels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <Label htmlFor="studentName" className="form-label">
                <h2>الاسم واللقب</h2>
              </Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={selectedStudent.fullName}
                onChange={handleInputChange}
                className="form-control fs-5 fw-bold text-end"
                placeholder="أدخل اسم التلميذ"
                required
              />
            </div>

            <div className="mb-3">
              <Label htmlFor="studentEmail" className="form-label">
                <h2>البريد الإلكتروني الخاص بالتلميذ</h2>
              </Label>
              <Input
                type="email"
                id="studentEmail"
                name="email"
                value={selectedStudent.email}
                onChange={handleInputChange}
                className="form-control fs-5 fw-bold text-end"
                placeholder="أدخل البريد الإلكتروني"
                required
              />
            </div>

            <div className="mb-3">
              <Label htmlFor="studentPassword" className="form-label">
                <h2>كلمة المرور</h2>
              </Label>
              <Input
                type="password"
                id="studentPassword"
                name="password"
                value={selectedStudent.password}
                onChange={handleInputChange}
                className="form-control fs-5 fw-bold text-end"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            {addError && <p className="text-danger">{addError}</p>}
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              onClick={tog_list}
              className="px-4 py-2 btn-md px-5 py-2 fw-bold text-white"
              style={{ fontSize: "1.25rem" }}
              disabled={isSubmitting}
            >
              إغلاق
            </Button>

            <Button
              type="submit"
              color="success"
              className="btn-md px-5 py-2 fw-bold text-white"
              style={{ fontSize: "1.25rem" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default StudentsTable;
