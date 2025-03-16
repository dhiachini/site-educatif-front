import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import { FilePond } from "react-filepond";

const AddLesson = () => {
  document.title = "إضافة الدروس";

  // Static levels data
  const [levels, setLevels] = useState(["الصف الأول", "الصف الثاني", "الصف الثالث"]);
  const [newLevel, setNewLevel] = useState("");
  const [files, setFiles] = useState([]);

  // Handle adding a new level
  const handleAddLevel = () => {
    const trimmedLevel = newLevel.trim();
    if (!trimmedLevel) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "يرجى إدخال اسم الدرس",
        confirmButtonText: "حسنًا",
      });
      return;
    }

    // Add the new level to the list
    setLevels((prevLevels) => [...prevLevels, trimmedLevel]);
    setNewLevel(""); // Reset the input

    // Show success message
    Swal.fire({
      icon: "success",
      title: "تمت الإضافة بنجاح",
      text: "تمت إضافة الدرس بنجاح",
      confirmButtonText: "حسنًا",
    });
  };

  return (
    <React.Fragment>
      <div className="page-content" dir="rtl">
        <Container fluid>
          <Card>
            <CardHeader className="text-end">
              <h2 className="card-title mb-0 fs-1">إضافة درس جديد</h2>
            </CardHeader>
            <Row
              className="justify-content-center align-items-center"
              style={{ minHeight: "70vh" }}
            >
              <Col xxl={4} md={6} className="text-center">
                {/* List of levels */}
                <div className="mb-4">
                  <Label htmlFor="selectLevel" className="form-label">
                    <h2>جميع المستويات</h2>
                  </Label>
                  <select className="form-select fs-5 fw-bold" id="selectLevel">
                    {levels.length > 0 ? (
                      levels.map((level, index) => (
                        <option key={index} value={level}>
                          {level}
                        </option>
                      ))
                    ) : (
                      <option disabled>لا توجد مستويات متاحة</option>
                    )}
                  </select>
                </div>

                {/* Add a new level */}
                <div className="mb-4">
                  <Label htmlFor="newLevel" className="form-label">
                    <h2>إضافة درس جديد</h2>
                  </Label>
                  <Input
                    type="text"
                    className="form-control fs-5 fw-bold text-end"
                    id="newLevel"
                    placeholder="أدخل اسم الدرس الجديد"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                  />
                </div>

                {/* File upload */}
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={3}
                  name="files"
                  className="filepond filepond-input-multiple"
                />

                {/* Add button */}
                <div className="mt-4">
                  <Button
                    color="success"
                    className="btn-md px-4 py-2 fw-bold text-white"
                    style={{ fontSize: "1.25rem" }}
                    onClick={handleAddLevel}
                  >
                    إضافة
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddLesson;