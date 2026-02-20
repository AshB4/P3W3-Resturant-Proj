import { NavLink, useLocation } from "react-router-dom";
import "./Nav.css";
import Logo from "../logo/logo";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="navbar">
      
      {!isHome && (
        <div className="nav-logo">
          <Logo variant="nav" />
        </div>
      )}

      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/menu">
          Menu
        </NavLink>
        <NavLink to="/order">
          Order Now
        </NavLink>
        <NavLink to="/chatbot">
          Chatbot
        </NavLink>
      </div>

    </nav>
  );
}
