import "../styles/billing.css";
import "../styles/customer.css";
import "../styles/items.css";
import "../styles/summary.css";
import "../styles/print.css";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Billing() {
  /* =======================
     ROUTER
  ======================= */
  const navigate = useNavigate();

  /* =======================
     STATE
  ======================= */
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);

  const [customerIndex, setCustomerIndex] = useState(0);
  const [employeeIndex, setEmployeeIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);

  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [itemsFromDb, setItemsFromDb] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [items, setItems] = useState([]);
  const [gstEnabled, setGstEnabled] = useState(false);

  /* =======================
     REFS
  ======================= */
  const customerRef = useRef(null);
  const employeeRef = useRef(null);
  const itemSearchRef = useRef(null);
  const qtyRefs = useRef([]);

  /* =======================
     FETCH PLACEHOLDERS (API READY)
  ======================= */
  useEffect(() => {
    // fetch("/api/customers").then(r => r.json()).then(setCustomers);
    // fetch("/api/employees").then(r => r.json()).then(setEmployees);
    // fetch("/api/items").then(r => r.json()).then(setItemsFromDb);
  }, []);

  /* =======================
     CALCULATIONS
  ======================= */
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const subTotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const gstAmount = gstEnabled ? subTotal * 0.18 : 0;
  const finalTotal = subTotal + gstAmount;

  /* =======================
     ESC / EXIT
  ======================= */
  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === "Escape" && items.length > 0 && !showExitPopup) {
        setShowExitPopup(true);
      }

      if (showExitPopup) {
        if (e.key === "y" || e.key === "Y") {
          setItems([]);
          setSelectedCustomer(null);
          setSelectedEmployee(null);
          setGstEnabled(false);
          setShowExitPopup(false);
          customerRef.current?.focus();
        }

        if (e.key === "n" || e.key === "N" || e.key === "Escape") {
          setShowExitPopup(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [showExitPopup, items.length]);

  return (
    <div className="billing-page">

      {/* NAVBAR */}
      <header className="billing-navbar">
        <div className="font-semibold text-blue-600 text-lg">Quotation</div>

        <div className="ml-auto flex items-center gap-4">
          <button className="billing-nav-btn">Add Category</button>
          <button className="billing-nav-btn">Add Item</button>
          <button className="billing-nav-btn">Add Employee</button>

          <button
            className="billing-nav-btn"
            onClick={() => navigate("/orders")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/orders")}
          >
            Orders
          </button>

          <button className="billing-nav-btn font-medium">Profile ⌄</button>
        </div>
      </header>

      <main className="billing-content">

        {/* ================= CUSTOMER ================= */}
        <section className="card col-span-4 relative">
          <h2 className="card-title">Customer Details</h2>

          <input
            ref={customerRef}
            className="input mb-3"
            placeholder="Customer Name"
            value={selectedCustomer?.name || ""}
            onFocus={() => setShowCustomerDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && customers.length)
                setCustomerIndex((i) => (i + 1) % customers.length);
              if (e.key === "ArrowUp" && customers.length)
                setCustomerIndex((i) => (i - 1 + customers.length) % customers.length);
              if (e.key === "Enter" && customers[customerIndex]) {
                setSelectedCustomer(customers[customerIndex]);
                setShowCustomerDropdown(false);
                employeeRef.current?.focus();
              }
            }}
          />

          {showCustomerDropdown && (
            <div className="dropdown">
              {customers.map((c, i) => (
                <div
                  key={c.id}
                  className={`dropdown-item ${i === customerIndex ? "bg-gray-100" : ""}`}
                  onMouseDown={() => {
                    setSelectedCustomer(c);
                    setShowCustomerDropdown(false);
                    employeeRef.current?.focus();
                  }}
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}

          <input
            className="input mb-3 bg-gray-100"
            placeholder="Phone"
            value={selectedCustomer?.phone || ""}
            disabled
          />

          <input
            ref={employeeRef}
            className="input"
            placeholder="Employee"
            value={selectedEmployee?.name || ""}
            onFocus={() => setShowEmployeeDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && employees.length)
                setEmployeeIndex((i) => (i + 1) % employees.length);
              if (e.key === "ArrowUp" && employees.length)
                setEmployeeIndex((i) => (i - 1 + employees.length) % employees.length);
              if (e.key === "Enter" && employees[employeeIndex]) {
                setSelectedEmployee(employees[employeeIndex]);
                setShowEmployeeDropdown(false);
                itemSearchRef.current?.focus();
              }
            }}
          />

          {showEmployeeDropdown && (
            <div className="dropdown">
              {employees.map((e, i) => (
                <div
                  key={e.id}
                  className={`dropdown-item ${i === employeeIndex ? "bg-gray-100" : ""}`}
                  onMouseDown={() => {
                    setSelectedEmployee(e);
                    setShowEmployeeDropdown(false);
                    itemSearchRef.current?.focus();
                  }}
                >
                  {e.name}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= ITEMS ================= */}
        <section className="card col-span-8 relative">
          <h2 className="card-title">Item List</h2>

          <input
            ref={itemSearchRef}
            className="input mb-3"
            placeholder="Search item"
            onFocus={() => setShowItemDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && itemsFromDb.length)
                setItemIndex((i) => (i + 1) % itemsFromDb.length);
              if (e.key === "ArrowUp" && itemsFromDb.length)
                setItemIndex((i) => (i - 1 + itemsFromDb.length) % itemsFromDb.length);
              if (e.key === "Enter" && itemsFromDb[itemIndex]) {
                const it = itemsFromDb[itemIndex];
                setItems((p) => [...p, { ...it, qty: 1 }]);
                setShowItemDropdown(false);
                setTimeout(() => qtyRefs.current[items.length]?.focus(), 0);
              }
            }}
          />

          {showItemDropdown && (
            <div className="item-dropdown">
              {itemsFromDb.map((it, i) => (
                <div
                  key={it.id}
                  className={`item-option ${i === itemIndex ? "bg-gray-100" : ""}`}
                  onMouseDown={() => {
                    setItems((p) => [...p, { ...it, qty: 1 }]);
                    setShowItemDropdown(false);
                    setTimeout(() => qtyRefs.current[items.length]?.focus(), 0);
                  }}
                >
                  {it.name}
                </div>
              ))}
            </div>
          )}

          {items.map((item, index) => (
            <div className="item-row" key={item.id}>
              <div className="col-span-5">{item.name}</div>
              <div className="col-span-3">
                <input className="item-input bg-gray-100" value={item.price} readOnly />
              </div>
              <div className="col-span-2">
                <input
                  ref={(el) => (qtyRefs.current[index] = el)}
                  className="qty-input"
                  type="number"
                  value={item.qty}
                  onChange={(e) => {
                    const u = [...items];
                    u[index].qty = +e.target.value;
                    setItems(u);
                  }}
                />
              </div>
              <div className="col-span-2 text-right">
                <button
                  className="delete-btn"
                  onClick={() => setItems((p) => p.filter((i) => i.id !== item.id))}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* ================= SUMMARY ================= */}
        <section className="card col-span-12">
          <h2 className="card-title">Billing Summary</h2>

          <div className="summary-row"><span>Total Items</span><span>{totalItems}</span></div>
          <div className="summary-row"><span>Subtotal</span><span>₹{subTotal.toFixed(2)}</span></div>
          <div className="summary-row">
            <span>GST</span>
            <select
              className="input w-24"
              value={gstEnabled ? "yes" : "no"}
              onChange={(e) => setGstEnabled(e.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>

          <div className="mt-4 text-right">
            <button className="print-btn" onClick={() => window.print()}>
              Print Receipt
            </button>
          </div>
        </section>
      </main>

      {showExitPopup && (
        <div className="exit-overlay">
          <div className="exit-box">
            <p>Exit billing for this customer?</p>
            <div className="exit-hint">
              Press <b>Y</b> = Yes | <b>N</b> / <b>Esc</b> = No
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
