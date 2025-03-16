import React, { useState, useEffect } from "react";
import axios from "axios";
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
import BreadCrumb from "../Common/BreadCrumb";

const AddLevel = () => {
  document.title = "إضافة مستوى | الموقع التعليمي";

  const [levels, setLevels] = useState([]); // Stocker les niveaux
  const [newLevel, setNewLevel] = useState(""); // Stocker le niveau à ajouter
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Récupérer les niveaux existants
  const fetchLevels = async () => {
    try {
      const response = await axios.get("https://site-educatif-4.onrender.com/api/levels/alllevels");
      console.log("🔍 Réponse complète :", response);

      const data = Array.isArray(response) ? response : response.data;

      if (Array.isArray(data)) {
        const levelsOnly = data
          .map((lvl) => (lvl && typeof lvl.level === "string" ? lvl.level.trim() : ""))
          .filter((level) => level !== "");

        setLevels(levelsOnly);
      } else {
        throw new Error("Réponse API inattendue (pas un tableau)");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la récupération des niveaux :", err);
      setError("فشل تحميل المستويات، يرجى المحاولة لاحقًا");
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // ✅ Ajouter un niveau et mettre à jour la liste localement
  const handleAddLevel = async () => {
    const trimmedLevel = newLevel.trim();
    if (!trimmedLevel) {
      setError("يرجى إدخال اسم المستوى");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://site-educatif-4.onrender.com/api/levels/addlevels", {
        level: trimmedLevel,
      });

      console.log("✅ Niveau ajouté :", response.data);

      // 🔥 Mise à jour locale de la liste au lieu d'appeler fetchLevels()
      setLevels((prevLevels) => [...prevLevels, trimmedLevel]);

      setNewLevel(""); // Réinitialiser l'input
    } catch (err) {
      console.error("❌ Erreur lors de l'ajout :", err);
      setError("فشل إضافة المستوى، يرجى المحاولة لاحقًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content" dir="rtl">
        <Container fluid>
          <BreadCrumb title="إضافة مستوى" />
          <Card>
            <CardHeader className="text-end">
              <h2 className="card-title mb-0 fs-1">إضافة مستوى جديد</h2>
            </CardHeader>
            <Row className="justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
              <Col xxl={4} md={6} className="text-center">
                {/* ✅ Liste des niveaux */}
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

                {/* ✅ Ajouter un niveau */}
                <div className="mb-4">
                  <Label htmlFor="newLevel" className="form-label">
                    <h2>إضافة مستوى جديد</h2>
                  </Label>
                  <Input
                    type="text"
                    className="form-control fs-5 fw-bold text-end"
                    id="newLevel"
                    placeholder="أدخل اسم المستوى الجديد"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                  />
                </div>

                {/* ✅ Bouton Ajouter */}
                <div className="mt-4">
                  <Button
                    color="success"
                    className="btn-md px-4 py-2 fw-bold text-white"
                    style={{ fontSize: "1.25rem" }}
                    onClick={handleAddLevel}
                    disabled={loading}
                  >
                    {loading ? "جارٍ الإضافة..." : "إضافة"}
                  </Button>
                </div>

                {/* ✅ Affichage des erreurs */}
                {error && <p className="text-danger mt-3">{error}</p>}
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddLevel;
