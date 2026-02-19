import { useEffect, useState } from "react";
import Card from "../components/Cards/Card";
import { supabase } from "../supabaseClient";
import "./Menu.css";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*");

      if (error) {
        console.error("Error fetching menu:", error);
      } else {
        setMenuItems(data);
      }
    };

    fetchMenu();
  }, []);

  const breakfastItems = menuItems.filter((item) =>
    normalizeCategory(item.category) === "breakfast"
  );

  const lunchItems = menuItems.filter((item) =>
    normalizeCategory(item.category) === "lunch"
  );

  const dinnerItems = menuItems.filter((item) =>
    normalizeCategory(item.category) === "dinner"
  );

  const drinkItems = menuItems.filter((item) => {
    const category = normalizeCategory(item.category);
    return category === "drinks" || category === "beverages & drinks";
  });

  return (
    <div className="menu-page">
      <Section title="Breakfast" items={breakfastItems} />
      <Section title="Lunch" items={lunchItems} />
      <Section title="Dinner" items={dinnerItems} />
      <DrinksSection items={drinkItems} />
    </div>
  );
}

function Section({ title, items }) {
  return (
    <section className="menu-section">
      <h2 className="menu-title">{title}</h2>

      <div className="menu-grid">
        {items.map((item) => (
          <Card
            key={item.id}
            image={item.image_url}
            title={item.name}
            price={item.price}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

function DrinksSection({ items }) {
  const featuredDrink = items.find((item) => item.image_url) || items[0];

  return (
    <section className="menu-section drinks-section">
      <h2 className="menu-title">Beverages & Drinks</h2>

      {featuredDrink?.image_url && (
        <div className="drinks-featured">
          <img src={featuredDrink.image_url} alt={featuredDrink.name} />
        </div>
      )}

      <div className="menu-grid">
        {items.map((item) => (
          <Card
            key={item.id}
            image={item.image_url}
            title={item.name}
            price={item.price}
            description={item.description}
            showImage={false}
          />
        ))}
      </div>
    </section>
  );
}

function normalizeCategory(category) {
  return String(category || "")
    .trim()
    .toLowerCase();
}

