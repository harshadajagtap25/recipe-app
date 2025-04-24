import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Fridge from "./pages/Fridge";
import Recipies from "./pages/Recipies";
import RecipeIdeas from "./pages/RecipeIdeas";
import AllRecipes from "./pages/AllRecipes";
import { AuthProvider } from "./contexts/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ProtectedRouteGuard } from "./guards/ProtectedRouteGuard";

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
              <ProtectedRouteGuard>
                <Home />
              </ProtectedRouteGuard>
            }
          />
          <Route
            path="/fridge"
            element={
              <ProtectedRouteGuard>
                <Fridge />
              </ProtectedRouteGuard>
            }
          />
          <Route
            path="/recipes/:recipeName"
            element={
              <ProtectedRouteGuard>
                <Recipies />
              </ProtectedRouteGuard>
            }
          />
          <Route
            path="/recipeIdea"
            element={
              <ProtectedRouteGuard>
                <RecipeIdeas />
              </ProtectedRouteGuard>
            }
          />
          <Route
            path="/allRecipes"
            element={
              <ProtectedRouteGuard>
                <AllRecipes />
              </ProtectedRouteGuard>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
