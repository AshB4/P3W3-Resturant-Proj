import { useState } from "react";
import "./OrderPage.css";
import "../../components/Inputs/Input";
import Button from "../../components/Button/Button";

export default function OrderPage() {
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Order:", order);

    setName("");
    setOrder("");
  };

  return (
    <div className="order-page">
      <div className="order-card">
        <h2>Place Your Order</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              What can we prepare for you tonight?
            </label>
            <textarea
              className="form-textarea"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              required
            />
          </div>

          <Button>Submit Order</Button>
        </form>
      </div>
    </div>
  );
}
