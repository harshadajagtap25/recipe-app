import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Fridge from "./pages/Fridge";
import Recipies from "./pages/Recipies";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fridge" element={<Fridge />} />
        <Route path="/recipes" element={<Recipies  />} />
      </Routes>
    </Router>
  );
}

export default App;
