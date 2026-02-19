import { NavLink, useLocation } from "react-router-dom";
import Logo from "../logo/logo";
import "./Nav.css";

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
          Order
        </NavLink>
        <NavLink to="/chatbot">
          Chatbot
        </NavLink>
      </div>

    </nav>
  );
}
