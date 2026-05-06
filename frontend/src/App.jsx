import { BrowserRouter, Routes, Route } from "react-router-dom"; // Router කොටස් import කරන්න
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Register/Signup";
import SearchResults from "./pages/ResultsPage/SearchResults"; // අලුත් පිටුව import කරන්න
import Features from "./pages/Home/Features";
import Vehicles from "./pages/Vehicles/Vehicles";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <Features />
              </>
            }
          />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <>
                <Home />
                <Features />
              </>
            }
          />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/Vehicles" element={<Vehicles />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
