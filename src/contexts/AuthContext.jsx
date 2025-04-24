import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      setAuthError(null);
      setIsAuthReady(false);

      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          return;
        }

        setToken(storedToken);

        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
          try {
            const parsedUser = JSON.parse(storedUserData);
            setCurrentUser(parsedUser);
          } catch (e) {
            console.warn("Failed to parse stored user data");
          }
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);

        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthError("Session expired. Please sign in again.");
      } finally {
        setIsAuthReady(true);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setAuthError(null);

      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      // Save token and user data
      const authToken = data.token;
      const userData = data.user;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(authToken);
      setCurrentUser(userData);

      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Registration function in authcontext
  const register = async (userData) => {
    try {
      setAuthError(null);

      const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });
      console.log("response : ", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();

      // Save token and user data
      const authToken = data.token;
      const user = data.user;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(authToken);
      setCurrentUser(user);

      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setToken(null);
  };

  const value = {
    currentUser,
    token,
    isAuthenticated: !!currentUser,
    isAuthReady,
    authError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
