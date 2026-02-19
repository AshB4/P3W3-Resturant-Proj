
import "./Hero.css";
import Logo from "../logo/logo";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <Logo variant="hero" />
      <div className="hero-buttons">
        <Link to="/menu" className="btn btn-primary">
          See Our Menu
        </Link>
        <Link to="/order" className="btn btn-outline">
          Reserve Table
        </Link>
      </div>
    </section>
  );
}
