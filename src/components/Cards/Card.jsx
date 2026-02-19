import './Card.css';

export default function Card({
  image,
  title,
  price,
  description,
  showImage = true
}) {
  return (
    <div className="card">
      {showImage && image && (
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
      )}

      <div className="card-content">
        <h2>{title}</h2>
        <p className="card-price">
          ${Number(price).toFixed(2)}
        </p>
        {description && (
          <p className="card-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
