import Loader from "@/components/common/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRouteGuard = ({ children }) => {
  const { currentUser, isAuthLoading } = useAuth();
  const location = useLocation();

  // Critical change: Use localStorage as fallback during loading
  const storedUser = useMemo(() => {
    if (!currentUser && isAuthLoading) {
      try {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [currentUser, isAuthLoading]);

  // Consider the user logged in if we have currentUser OR storedUser during loading
  const effectiveUser = currentUser || storedUser;

  // Show loading state while checking authentication and we don't have localStorage data
  if (isAuthLoading && !effectiveUser) {
    return (
      <>
        <Loader />
      </>
    );
  }

  // Redirect to signin if not authenticated
  if (!effectiveUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};
