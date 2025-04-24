import { useAuth } from "@/contexts/AuthContext";
import Loader from "./Loader";

// This component waits for auth to be ready before rendering any routes
const AuthRoutesWrapper = ({ children }) => {
  const { isAuthReady } = useAuth   ();

  if (!isAuthReady) {
    return <Loader />;
  }

  return children;
};

export default AuthRoutesWrapper;
