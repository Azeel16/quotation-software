import "../styles/orders.css";
import { useEffect, useRef, useState } from "react";

export default function Orders() {
  /* =======================
     STATE
  ======================= */
  const [orders, setOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const rowRefs = useRef([]);

  /* =======================
     FETCH ORDERS (API READY)
  ======================= */
  useEffect(() => {
    // fetch("/api/orders")
    //   .then(res => res.json())
    //   .then(setOrders);

    // TEMP EMPTY STATE
    setOrders([]);
  }, []);

  /* =======================
     KEYBOARD NAVIGATION
  ======================= */
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => Math.min(i + 1, orders.length - 1));
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter" && orders[activeIndex]) {
      // later: navigate to order view / reprint
      alert(`Open order ID: ${orders[activeIndex].id}`);
    }

    if (e.key === "Escape") {
      window.history.back();
    }
  };

  useEffect(() => {
    rowRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  return (
    <div className="orders-page" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="orders-header">
        <h1>Order History</h1>
        <span className="hint">↑ ↓ Navigate | Enter View | Esc Back</span>
      </header>

      <div className="orders-table">
        <div className="orders-head">
          <div>Order ID</div>
          <div>Customer</div>
          <div>Date</div>
          <div>Total</div>
        </div>

        {orders.length === 0 && (
          <div className="orders-empty">
            No orders found
          </div>
        )}

        {orders.map((order, index) => (
          <div
            key={order.id}
            ref={(el) => (rowRefs.current[index] = el)}
            tabIndex={-1}
            className={`orders-row ${
              index === activeIndex ? "active" : ""
            }`}
          >
            <div>{order.id}</div>
            <div>{order.customerName}</div>
            <div>{order.date}</div>
            <div>₹{order.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
