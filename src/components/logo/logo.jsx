import "./logo.css";

export default function Logo({ variant = "hero" }) {
  return (
    <div className={`logo logo-${variant}`}>
      <span className="logo-the">The</span>
      <span className="logo-404 neon-text neon-flicker">404</span>
      <span className="logo-lounge">Lounge</span>
    </div>
  );
}
