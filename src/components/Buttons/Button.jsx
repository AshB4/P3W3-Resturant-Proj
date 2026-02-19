import './Button.css';

export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button"
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
