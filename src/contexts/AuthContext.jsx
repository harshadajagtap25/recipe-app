import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setIsAuthLoading(true);
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // Set initial state from localStorage
      if (storedUser && storedToken) {
        setCurrentUser(JSON.parse(storedUser));
        setToken(storedToken);
      }

      // If we have a token, validate with the server
      if (storedToken) {
        try {
          const response = await fetch(
            "https://backend-fridgerecipe.onrender.com/v1/auth/me",
            {
              headers: {
                "x-auth-token": storedToken,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // If token is invalid, clear everything
            logout();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);

          if (error.response && [401, 403].includes(error.response.status)) {
            logout();
          }
        }
      }

      setIsAuthLoading(false);
    };

    console.log("currentuser before", currentUser);
    initAuth();
    console.log("currentuser after", currentUser);
  }, []);

  const login = (userData, authToken = null) => {
    // If token is provided, use it, otherwise use userData.token
    const tokenToUse = authToken || userData.token;

    if (tokenToUse) {
      localStorage.setItem("token", tokenToUse);
      setToken(tokenToUse);
    }

    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        token,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
