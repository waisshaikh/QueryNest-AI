import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";

export default function RouterSetup() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}