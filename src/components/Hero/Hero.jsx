import Logo from "../logo/logo";

export default function Hero() {
  return (
    <section className="hero">
      <Logo variant="hero" />
      <div className="hero-buttons">
        <button className="btn btn-primary">See Our Menu</button>
        <button className="btn btn-outline">Reserve Table</button>
      </div>
    </section>
  );
}
