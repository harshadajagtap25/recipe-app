import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthRoutesWrapper from "./components/common/AuthWrapper";
import ProtectedRoute from "./guards/ProtectedRouteGuard";
import { lazy, Suspense } from "react";
import Loader from "./components/common/Loader";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Home = lazy(() => import("./pages/Home"));
const Fridge = lazy(() => import("./pages/Fridge"));
const Recipies = lazy(() => import("./pages/Recipies"));
const RecipeIdeas = lazy(() => import("./pages/RecipeIdeas"));
const AllRecipes = lazy(() => import("./pages/AllRecipes"));
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AuthRoutesWrapper>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes */}
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

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </AuthRoutesWrapper>
        </Router>
      </AuthProvider>
      <Analytics />
    </>
  );
}

export default App;
