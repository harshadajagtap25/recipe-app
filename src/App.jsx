import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Fridge from "./pages/Fridge";
import Recipies from "./pages/Recipies";
import RecipeIdeas from "./pages/RecipeIdeas";
import AllRecipes from "./pages/AllRecipes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fridge"
            element={
              <ProtectedRoute>
                <Fridge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:recipeName"
            element={
              <ProtectedRoute>
                <Recipies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipeIdea"
            element={
              <ProtectedRoute>
                <RecipeIdeas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allRecipes"
            element={
              <ProtectedRoute>
                <AllRecipes />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
