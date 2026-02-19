import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Nav/Nav";
import Hero from "./components/Hero/Hero";
import Menu from "./pages/Menu";
import OrderPage from "./pages/OrderPage/OrderPage";
import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
