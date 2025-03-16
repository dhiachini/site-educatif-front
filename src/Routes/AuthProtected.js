import React, { useEffect } from "react";
import { Navigate, Route, useNavigate } from "react-router-dom"; // Importer useNavigate
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useProfile } from "../Components/Hooks/UserHooks";
import { logoutUser } from "../store/actions";

const AuthProtected = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection
  const { userProfile, loading, token } = useProfile();
  console.log("🔎 AuthProtected: { token:", token, ", userProfile:", userProfile, ", loading:", loading, "}");

  // Fonction pour vérifier si le token est expiré
  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Décoder le payload du token
      if (!decoded || !decoded.exp) return true; // Si le token est invalide ou n'a pas de date d'expiration

      const expirationTime = decoded.exp * 1000; // Convertir en millisecondes
      return Date.now() > expirationTime; // Vérifier si le token est expiré
    } catch (err) {
      return true; // En cas d'erreur, considérer le token comme expiré
    }
  };

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  const storedToken = localStorage.getItem("token");

  // Si aucun token n'est trouvé, rediriger vers /login
  if (!storedToken) {
    console.log("🚨 Aucun token trouvé, redirection vers /login...");
    return <Navigate to="/login" />;
  }

  // Si le token est expiré, afficher une alerte et rediriger vers /login
  if (isTokenExpired(storedToken)) {
    console.log("🚨 Token expiré, redirection vers /login...");

    Swal.fire({
      title: "انتهت الجلسة",
      text: "انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول.",
      icon: "warning",
      confirmButtonText: "حسناً",
      confirmButtonColor: "#3085d6",
    }).then(() => {
      localStorage.removeItem("token"); // Supprimer le token expiré
      localStorage.removeItem("user"); // Supprimer les données utilisateur
      dispatch(logoutUser()); // Déconnecter l'utilisateur dans Redux (si utilisé)
      navigate("/login"); // Rediriger vers /login avec useNavigate
    });

    return null; // Retourner null pour éviter de rendre le composant pendant l'affichage de l'alerte
  }

  console.log("✅ Token trouvé et valide:", storedToken);
  setAuthorization(storedToken); // 🔥 Ajout pour forcer l'auth

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <>
            <Component {...props} />
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };