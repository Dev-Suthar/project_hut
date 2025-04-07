import React, { useEffect, useRef, useState } from 'react';
import './HowWeWorkSection.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HowWeWorkSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  // State to track window width for responsive animations
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    // Function to update window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Initial window width
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initial animation for the section - fade in with slight upward movement
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { 
          opacity: 0, 
          y: 50 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: 'power3.out' 
        }
      );
    }

    // Add specific animation for the SVG
    const rethinkSvgElement = headerRef.current?.querySelector('.rethink-svg');
    if (rethinkSvgElement) {
      gsap.fromTo(
        rethinkSvgElement,
        { 
          opacity: 0,
          y: 20 
        },
        { 
          opacity: 1,
          y: 0, 
          duration: 1.4, 
          ease: 'power2.out',
          delay: 0.2
        }
      );
    }

    // Animate problem box - initial fade in
    if (problemRef.current) {
      gsap.fromTo(
        problemRef.current,
        { 
          opacity: 0,
          x: windowWidth < 768 ? -20 : -50 // Smaller shift on mobile
        },
        { 
          opacity: 1,
          x: 0,
          duration: 1, 
          ease: 'power2.out',
          delay: 0.3
        }
      );
    }

    // Animate solution box - initial fade in
    if (solutionRef.current) {
      gsap.fromTo(
        solutionRef.current,
        { 
          opacity: 0,
          x: windowWidth < 768 ? 20 : 50 // Smaller shift on mobile
        },
        { 
          opacity: 1,
          x: 0,
          duration: 1, 
          ease: 'power2.out',
          delay: 0.5
        }
      );
    }

    // Add a parallax effect to the title only - adjusted for screen size
    if (headerRef.current && sectionRef.current) {
      gsap.to(headerRef.current, {
        y: windowWidth < 768 ? 20 : 50, // Reduced parallax effect on mobile
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        }
      });
    }

    // Add scroll animations for the cards - responsive for different screen sizes
    // Problem card moves down when scrolling
    if (problemRef.current && sectionRef.current) {
      // Determine movement distance based on screen size
      const yDistance = windowWidth < 768 ? 50 : 
                         windowWidth < 992 ? 80 : 120;
                         
      gsap.to(problemRef.current, {
        y: yDistance, 
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%", 
          end: "bottom 20%", 
          scrub: 0.5,
          toggleActions: "play none none reverse"
        }
      });
    }

    // Solution card moves up when scrolling
    if (solutionRef.current && sectionRef.current) {
      // Determine movement distance based on screen size
      const yDistance = windowWidth < 768 ? -50 : 
                         windowWidth < 992 ? -80 : -120;
                         
      gsap.to(solutionRef.current, {
        y: yDistance,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
          toggleActions: "play none none reverse"
        }
      });
    }

    // Clean up ScrollTrigger instances and event listener
    return () => {
      const triggers = ScrollTrigger.getAll();
      if (triggers) {
        triggers.forEach(trigger => trigger.kill());
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]); // Re-run when window width changes

  return (
    <section className="how-we-work-section" ref={sectionRef}>
      <div className="container">
        <div className="section-content-wrapper">
          <div className="services-header" ref={headerRef}>
            <h2 className="services-subtitle">Typical</h2>
            <h2 className="services-subtitle">IT Services</h2>
          </div>
          
          <div className="services-content">
            <div className="problem-box" ref={problemRef}>
              <div className="box-header">
                <h4 className="box-title">PROBLEM</h4>
                <div className="warning-icon">⚠</div>
              </div>
              <p className="box-description">Lorem ipsum" is placeholder text commonly where used in design.</p>
              
              <ul className="feature-list">
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
              </ul>
            </div>
            
            <div className="solution-box" ref={solutionRef}>
              <div className="box-header">
                <h4 className="box-title">SOLUTION</h4>
                <div className="solution-icon">○</div>
              </div>
              <p className="box-description">Lorem ipsum" is placeholder text commonly where used in design.</p>
              
              <ul className="feature-list">
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
                <li className="feature-item">
                  <span className="check-icon">✓</span>
                  <span>Lorem ipsum" is placeholder text commonly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background squares/patterns */}
      <div className="background-squares">
        <div className="square square-1"></div>
        <div className="square square-2"></div>
        <div className="square square-3"></div>
        <div className="square square-4"></div>
        
        {/* New square boxes */}
        <div className="square square-5"></div>
        <div className="square square-6"></div>
        
        {/* L-shape pattern (made of three boxes) */}
        <div className="square l-shape l-shape-1-a"></div>
        <div className="square l-shape l-shape-1-b"></div>
        <div className="square l-shape l-shape-1-c"></div>
        
        {/* Second L-shape pattern */}
        <div className="square l-shape l-shape-2-a"></div>
        <div className="square l-shape l-shape-2-b"></div>
        <div className="square l-shape l-shape-2-c"></div>
      </div>
    </section>
  );
};

export default HowWeWorkSection;