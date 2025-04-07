import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ModernFooter.css";

// Constants
const COMPANY_NAME = "THE PRODUCT HIGHWAY";
const BACKGROUND_TEXT = `${COMPANY_NAME} ${COMPANY_NAME} ${COMPANY_NAME}`;

// Social media links configuration
const SOCIAL_LINKS = {
  column1: [
    { name: "FACEBOOK", url: "https://facebook.com" },
    { name: "INSTAGRAM", url: "https://instagram.com" },
  ],
  column2: [
    { name: "X.COM", url: "https://x.com" },
    { name: "LINKEDIN", url: "https://linkedin.com" },
  ],
};

const ModernFooter: React.FC = () => {
  // Refs and state
  const circleTextRef = useRef<HTMLDivElement | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize with useCallback for better performance
  const handleResize = useCallback(() => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Setup resize event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Configure and generate circular text based on screen width
  useEffect(() => {
    if (!circleTextRef.current) return;

    // Clear previous content
    circleTextRef.current.innerHTML = "";

    // Get configuration based on screen size
    const config = getCircleTextConfig(windowDimensions.width);

    // Create letters and position them in a circle
    for (let i = 0; i < config.text.length; i++) {
      const char = document.createElement("span");
      char.innerText = config.text[i];
      char.style.transform = `rotate(${i * config.rotationAngle}deg)`;
      char.style.color = "#FFFFFF";
      circleTextRef.current.appendChild(char);
    }
  }, [windowDimensions.width]);

  // Helper function to get circle text configuration based on screen width
  const getCircleTextConfig = (screenWidth: number) => {
    // Default configuration
    const config = {
      text: "LET'S TALK • SAY HELLO • LET'S TALK • SAY HELLO • ",
      rotationAngle: 7,
    };

    // Adjust text for very small screens
    if (screenWidth < 400) {
      config.text = "LET'S TALK • HELLO • LET'S TALK • HELLO • ";
    }

    // Adjust rotation angle based on screen size
    if (screenWidth < 400) {
      config.rotationAngle = 9; // Wider spacing on very small screens
    } else if (screenWidth < 576) {
      config.rotationAngle = 8.5; // Wider spacing on small screens
    } else if (screenWidth < 768) {
      config.rotationAngle = 8; // Slightly wider on medium-small screens
    } else if (screenWidth < 992) {
      config.rotationAngle = 7.5; // Standard for medium screens
    } else if (screenWidth > 1400) {
      config.rotationAngle = 6.5; // Tighter spacing on large screens
    }

    return config;
  };

  // Navigation functions
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector(".get-in-touch-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      scrollToTop();
    }
  };

  // Consistent white text styling
  const whiteTextStyle: React.CSSProperties = {
    color: "#FFFFFF",
    WebkitTextFillColor: "#FFFFFF",
  };

  // Social links component
  const renderSocialLinks = (
    links: { name: string; url: string }[],
    columnIndex: number
  ) => (
    <div className="modern-footer-social" key={`social-column-${columnIndex}`}>
      {links.map((link, index) => (
        <a
          key={`social-link-${columnIndex}-${index}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="modern-footer-social-link"
          style={whiteTextStyle}
        >
          {link.name}
        </a>
      ))}
    </div>
  );

  return (
    <footer
      className="modern-footer"
      style={{
        ...whiteTextStyle,
        padding: "70px 0 40px",
        paddingLeft: 0,
        marginLeft: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Background Text Animation */}
      <div className="modern-footer-background">
        <div
          className="modern-footer-background-text"
          style={{
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
            WebkitTextStroke: "1px white",
          }}
        >
          {BACKGROUND_TEXT}
        </div>
        <div
          className="modern-footer-background-text"
          style={{
            color: "#FFFFFF",
            WebkitTextFillColor: "#FFFFFF",
            textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
            WebkitTextStroke: "1px white",
          }}
        >
          {BACKGROUND_TEXT}
        </div>
      </div>

      {/* Central Circle Button */}
      <button
        onClick={scrollToContact}
        className="modern-footer-circle-button"
        aria-label="Contact Us"
      >
        <div className="modern-circle-button-inner">
          <div className="modern-circle-text" ref={circleTextRef}></div>
          <div className="modern-circle-arrow" style={whiteTextStyle}>
            ↗
          </div>
        </div>
      </button>

      {/* Footer Content Container */}
      <div
        className="modern-footer-container"
        style={{ paddingLeft: "30px !important" }}
      >
        <div className="modern-footer-content">
          {/* CTA Section */}
          <div
            className="modern-footer-cta"
            style={{
              textAlign: "left",
              width: "100%",
              maxWidth: "300px",
              padding: 0,
              margin: 0,
              position: "relative",
              left: 0,
            }}
          >
            <h3
              className="modern-footer-cta-title"
              style={{
                ...whiteTextStyle,
                textAlign: "left",
                margin: "0 0 18px 0",
                padding: 0,
                paddingLeft: 0,
                position: "relative",
                left: 0,
                display: "block",
                width: "100%",
              }}
            >
              HAVE A PRODUCT IN MIND?
            </h3>
            <button
              className="modern-footer-cta-button"
              onClick={scrollToContact}
              style={{
                ...whiteTextStyle,
                margin: 0,
                padding: "8px 20px",
                display: "inline-block",
                textAlign: "center",
                position: "relative",
                left: 0,
              }}
            >
              LET'S TALK
            </button>
          </div>

          {/* Social Links Section */}
          <div className="modern-footer-social-container">
            {renderSocialLinks(SOCIAL_LINKS.column1, 1)}
            {renderSocialLinks(SOCIAL_LINKS.column2, 2)}
          </div>

          {/* Back to Top Button */}
          <button
            className="modern-back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <div className="modern-back-to-top-icon" style={whiteTextStyle}>
              ↑
            </div>
            <span className="modern-back-to-top-text" style={whiteTextStyle}>
              BACK TO TOP
            </span>
          </button>
        </div>

        {/* Company Name Section */}
        <div
          className="modern-footer-company-name"
          style={{
            marginTop: "40px",
            textAlign: "left",
            fontFamily: "var(--footer-font-family)",
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            ...whiteTextStyle,
          }}
        >
          {/* {COMPANY_NAME} */}
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
