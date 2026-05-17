import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../api/apiService";
import { getErrorMessage, getFieldErrors } from "../api/errorUtils";

/**
 * Auth actions — login, register, logout with shared error handling.
 */
const useAuth = () => {
  const { user, loading, error, dispatch, isAdmin, isAuthenticated, initializing } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await auth.login(credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err, "Wrong username or password!");
      dispatch({ type: "LOGIN_FAILURE", payload: { message } });
      return { success: false, message, fieldErrors: getFieldErrors(err) };
    }
  };

  const register = async (payload) => {
    dispatch({ type: "REGISTER_START" });
    try {
      await auth.register(payload);
      dispatch({ type: "REGISTER_SUCCESS" });
      return { success: true };
    } catch (err) {
      const message = getErrorMessage(err, "Registration failed. Please check your details.");
      dispatch({ type: "REGISTER_FAILURE", payload: { message } });
      return { success: false, message, fieldErrors: getFieldErrors(err) };
    }
  };

  // TODO: No backend logout route — client-side only until implemented
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return {
    user,
    loading,
    error,
    isAdmin,
    isAuthenticated,
    initializing,
    login,
    register,
    logout,
    dispatch,
  };
};

export default useAuth;
