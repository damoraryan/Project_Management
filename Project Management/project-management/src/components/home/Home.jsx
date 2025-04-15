import React from "react";
import "../../assets/home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Project Management</div>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={()=>navigate("/login")}>Login</button>
          <button className="nav-btn signup" onClick={()=>navigate("/signup")}>Signup</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Manage Your Projects Like a Pro!</h1>
          <p>Streamline your workflow with our professional project management system.</p>
          <button className="cta-button" onClick={()=>navigate("/signup")}>Get Started</button>
        </div>
      </header>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"This project management system has improved our workflow drastically!"</p>
            <h4>- John Doe</h4>
          </div>
          <div className="testimonial-card">
            <p>"Amazing platform! It made our project handling super smooth."</p>
            <h4>- Jane Smith</h4>
          </div>
          <div className="testimonial-card">
            <p>"Highly recommended for anyone managing multiple projects."</p>
            <h4>- Michael Lee</h4>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs-section">
        <h2 className="faq-1">Frequently Asked Questions</h2>
        <div className="faq">
          <h3>How does this platform help in project management?</h3>
          <p>Our platform helps in organizing, tracking, and managing projects efficiently.</p>
        </div>
        <div className="faq">
          <h3>Is this system suitable for small businesses?</h3>
          <p>Yes! Our platform is designed for both small teams and large enterprises.</p>
        </div>
        <div className="faq">
          <h3>Can I integrate third-party tools?</h3>
          <p>Yes, we support integration with popular tools like Slack, Trello, and more.</p>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="contact-section">
        <h2 className="cnt">Contact Us</h2>
        <p>Email: contact@projectmanagement.com</p>
        <p>Phone: +123 456 7890</p>
        <p>📍 Address: 123 Project Street, Tech City, 56789</p>
      </footer>
    </div>
  );
};

export default Home;
