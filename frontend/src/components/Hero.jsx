import React from 'react';
import './Hero.css';
import { useNavigate } from "react-router-dom";

import Gallery from './Gallery'; // ✅ add this import

function Hero() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/student/signup");
  };
  return (
    <>
      {/* Hero section */}
      <section className="hero">
        <h1>
          <span className="highlight">Showcase</span> <em>Your Work.</em> <strong>Inspire</strong> the <span className="highlight">Next.</span>
        </h1>
        <p className="subtitle">
          Preserving student efforts, inspiring future batches.
        </p>
        <button className="register-btn" onClick={handleRegisterClick}>Register</button>
      </section>

      {/* Gallery section (carousel) */}
      <Gallery />
    </>
  );
}

export default Hero;
