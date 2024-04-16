import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import OnBoarding from "./Screens/onBoarding/OnBoarding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnBoarding />} />
        <Route path="/homescreen" element={<HomeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
