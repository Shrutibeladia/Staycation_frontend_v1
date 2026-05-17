import { createContext, useEffect, useReducer } from "react";
import { users } from "../api/apiService";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
  initializing: true,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "INIT_DONE":
      return { ...state, initializing: false };
    case "LOGIN_START":
    case "REGISTER_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
    case "UPDATE_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        user: action.payload,
        loading: false,
        error: null,
        initializing: false,
      };
    case "REGISTER_SUCCESS":
      return { ...state, loading: false, error: null };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return { user: null, loading: false, error: action.payload, initializing: false };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { user: null, loading: false, error: null, initializing: false };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Revalidate cookie session on app load when user is cached locally
  useEffect(() => {
    const validateSession = async () => {
      if (!state.user?._id) {
        dispatch({ type: "INIT_DONE" });
        return;
      }
      try {
        await users.checkAuth();
        const res = await users.getProfile(state.user._id);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    };
    validateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global handler for 401/403 from axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      if (state.user) dispatch({ type: "LOGOUT" });
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [state.user]);

  const isAdmin = state.user?.role === "admin";
  const isAuthenticated = Boolean(state.user);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        initializing: state.initializing,
        isAdmin,
        isAuthenticated,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
