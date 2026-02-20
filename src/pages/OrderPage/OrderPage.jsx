import { useState } from "react";
import "./OrderPage.css";
import Button from "../../components/Buttons/Button";
import { supabase } from "../../supabaseClient";

export default function OrderPage() {
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const customerName = name.trim();
    const orderText = order.trim();

    if (!customerName || !orderText) {
      setErrorMessage("Please fill in both fields.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: customerName,
        order_details: orderText
      }
    ]);

    if (error) {
      console.error("Error saving order:", error);
      setErrorMessage(formatSupabaseError(error));
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Success! Your order has been saved.");
    setName("");
    setOrder("");
    setIsSubmitting(false);
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

          {successMessage && (
            <p className="order-feedback success">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="order-feedback error">{errorMessage}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Order Now"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function formatSupabaseError(error) {
  if (!error) {
    return "Could not save your order. Please try again.";
  }

  if (error.code === "42501") {
    return "Insert blocked by Row Level Security (RLS). Add an INSERT policy for this table.";
  }

  if (error.code === "42P01") {
    return "Table not found: check that your table name is exactly 'orders'.";
  }

  if (error.code === "42703") {
    return "Column mismatch: table must include 'customer_name' and 'order_details'.";
  }

  return `Could not save order: ${error.message}`;
}
