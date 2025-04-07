import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import tphLogo from "../assets/tph-logo.webp";
import ContactDialog from "./ContactDialog";

// TypeScript interface for component props
interface NavbarProps {
  // Removed onPortfolioClick, currentView, and onLogoClick props
  backgroundColor?: string;
}

const Navbar: React.FC<NavbarProps> = ({ backgroundColor }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isContactDialogOpen, setIsContactDialogOpen] =
    useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = (): void => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler for contact button click
  const handleContactClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    setIsContactDialogOpen(true);
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Function to close contact dialog
  const closeContactDialog = (): void => {
    setIsContactDialogOpen(false);
  };

  // /portfolio

  return (
    <>
      <header className={scrolled ? "scrolled" : ""}>
        <nav
          className={`navbar ${
            location.pathname === "/portfolio"
              ? "bg-black"
              : "rgba(255, 255, 255, 0.15)"
          }`}
        >
          <div className="logo-container">
            <Link to="/">
              <img
                src={tphLogo}
                alt="THE PRODUCT HIGHWAY"
                className="logo-image-with-text"
              />
            </Link>
          </div>
          <div className={`nav-links ${isMenuOpen ? "mobile active" : ""}`}>
            <a href="#about">ABOUT</a>
            <a href="#service">SERVICE</a>
            <Link
              to="/portfolio"
              className={location.pathname === "/portfolio" ? "active" : ""}
            >
              PORTFOLIO
            </Link>
            <Link
              to="/joinus"
              className={location.pathname === "/joinus" ? "active" : ""}
            >
              JOIN US
            </Link>
            <a href="#" onClick={handleContactClick} className="contact-btn">
              CONTACT
            </a>
          </div>
          <div
            className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </header>

      {/* Contact Dialog Component */}
      <ContactDialog
        isOpen={isContactDialogOpen}
        onClose={closeContactDialog}
      />
    </>
  );
};

export default Navbar;
