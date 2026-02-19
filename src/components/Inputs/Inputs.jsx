import "./Inputs.css";

export default function Inputs({
  label,
  type = "text",
  value,
  onChange,
  textarea = false,
  required = false
}) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}

      {textarea ? (
        <textarea
          className="form-textarea"
          value={value}
          onChange={onChange}
          required={required}
        />
      ) : (
        <input
          className="form-input"
          type={type}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
}
