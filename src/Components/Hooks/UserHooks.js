import { useSelector } from "react-redux";

export const useProfile = () => {
  const userProfile = useSelector(state => state.Profile.user);
  const token = localStorage.getItem("token"); // 🔥 Ajouter cette ligne
  const loading = useSelector(state => state.Profile.loading);

  return { userProfile, token, loading };
};
