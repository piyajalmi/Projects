import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
         <img src="/images/logo.jpg" alt="App Logo" className="navbar-logo" />

      </div>

      <div className="navbar-right">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact Us</a>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
