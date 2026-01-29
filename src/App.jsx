import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Billing from "./pages/Billing";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
