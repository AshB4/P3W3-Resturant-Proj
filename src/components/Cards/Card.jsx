import './Card.css';
import Button from '../Button/Button';

export default function Card({ image, title, price, description }) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
      </div>

      <div className="card-content">
        <h2>{title}</h2>
        <p className="card-price">${price}</p>
        <p className="card-description">{description}</p>

        <Button>View Full Menu</Button>
      </div>
    </div>
  );
}
