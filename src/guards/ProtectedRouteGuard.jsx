// import Loader from "@/components/common/Loader";
// import { useAuth } from "@/contexts/AuthContext";
// import { Navigate, useLocation } from "react-router-dom";

// export const ProtectedRouteGuard = ({ children }) => {
//   const { currentUser, isAuthLoading } = useAuth();
//   const location = useLocation();

//   // Show loading state while checking authentication
//   if (isAuthLoading) {
//     return <Loader />;
//   }

//   // Redirect to signin if not authenticated
//   if (!currentUser) {
//     return <Navigate to="/signin" state={{ from: location }} replace />;
//   }

//   // User is authenticated
//   return children;
// };

import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving intended destination
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
