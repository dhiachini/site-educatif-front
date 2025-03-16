import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";

const Login = () => {
  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const defaultMessage = "سيتم إضافة حسابك من قبل معلمك"; // Message par défaut

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("يرجى إدخال البريد الإلكتروني"),
      password: Yup.string().required("يرجى إدخال كلمة المرور"),
      role: Yup.string().required("يرجى اختيار نوع الحساب"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        console.log("📌 بيانات مرسلة :", values);

        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: values.email,
            password: values.password,
            role: values.role, // Send the role to the API
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("🔥 استجابة كاملة من API :", response);

        const { token, user } = response; // Destructure token and user from the response

        if (!token || !user) {
          console.log("⚠️ مشكلة: البيانات غير مكتملة!");
          throw new Error("❌ بيانات تسجيل الدخول غير صحيحة!");
        }

        console.log("✅ تم استلام التوكن:", token);
        console.log("✅ تم استلام المستخدم:", user);

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("✅ تم حفظ البيانات بنجاح!");

        // Redirect based on the role
        if (user.role === "teacher") {
          navigate("/students-table");
        } else if (user.role === "student") {
          navigate("/lab");
        } else {
          navigate("/add-student");
        }
      } catch (err) {
        console.error("❌ خطأ في تسجيل الدخول:", err);
        setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <React.Fragment>
      <ParticlesAuth>
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4">
                <p
                  className="mt-3 fw-bold"
                  style={{ color: "#0a0547", fontSize: "2rem" }} // Blue color and bigger font size
                >
                  الموقع التعليمي
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card
                className="mt-4"
                style={{ backgroundColor: "#9ed4de5c", border: "none" }}
              >
                <CardBody
                  className="p-4"
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="text-center mt-2">
                    <h5 className="fs-20 fw-bold" style={{ color: "#0a0547" }}>
                      مرحبًا بعودتك !
                    </h5>
                    <p className="text-primary fs-20">
                      قم بتسجيل الدخول للمتابعة إلى الموقع التعليمي
                    </p>
                  </div>

                  <Form onSubmit={validation.handleSubmit}>
                    {/* 🔥 Sélecteur du rôle */}
                    <div className="mb-3 position-relative">
                      {" "}
                      {/* Add position-relative to the parent */}
                      <Label className="form-label text-end w-100 fs-18 fw-medium">
                        : نوع الحساب
                      </Label>
                      <Input
                        type="select"
                        name="role"
                        className="form-control text-end fs-18"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.role}
                        invalid={!!validation.errors.role}
                      >
                        <option value="">اختر نوع الحساب</option>
                        <option value="teacher">معلم</option>
                        <option value="student">تلميذ</option>
                      </Input>
                      <FormFeedback className="form-feedback-custom">
                        {" "}
                        {/* Apply the custom class */}
                        {validation.errors.role}
                      </FormFeedback>
                    </div>

                    <div className="mb-3">
                      <Label className="form-label text-end w-100 fs-18 fw-medium">
                        : البريد الإلكتروني
                      </Label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          name="email"
                          className="form-control pe-5 text-end fs-18"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email}
                          invalid={!!validation.errors.email}
                        />
                        <FormFeedback>{validation.errors.email}</FormFeedback>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label className="form-label text-end w-100 fs-18 fw-medium">
                        : كلمة المرور
                      </Label>
                      <div className="position-relative auth-pass-inputgroup mb-3">
                        <Input
                          name="password"
                          type={passwordShow ? "text" : "password"}
                          className="form-control pe-5 text-end fs-18"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password}
                          invalid={!!validation.errors.password}
                        />
                        <FormFeedback>
                          {validation.errors.password}
                        </FormFeedback>
                        <button
                          className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          type="button"
                          onClick={() => setPasswordShow(!passwordShow)}
                        >
                          <i className="ri-eye-fill align-middle"></i>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        color="success"
                        className="w-100 fs-18 fw-bold"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner size="sm" className="me-2" />
                        ) : null}{" "}
                        تسجيل الدخول
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              {/* Afficher le message par défaut ou le message d'erreur */}
              <p
                className="text-center fs-20 fw-bold"
                style={{ color: error ? "red" : "#0a0547" }}
              >
                {error ? "حدث خطأ أثناء تسجيل الدخول" : defaultMessage}
              </p>
            </Col>
          </Row>
        </Container>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Login;
