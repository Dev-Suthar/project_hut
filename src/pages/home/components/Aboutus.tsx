import React, { useEffect, useRef, useState } from "react";
import "./Aboutus.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import clientImage from "assets/client.webp";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const PartnerLoveSection: React.FC = () => {
  // Add state to track which testimonial page is shown
  const [currentPage, setCurrentPage] = useState<number>(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const subheadingRef = useRef<HTMLHeadingElement | null>(null);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);
  const card4Ref = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const bgLinesRef = useRef<HTMLDivElement | null>(null);
  // Create refs for all grid cells
  const gridCellsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Function to handle navigation
  const handleNavigation = (direction: "prev" | "next") => {
    if (direction === "next" && currentPage === 0) {
      // Show page 1 (testimonials 3 and 4)
      setCurrentPage(1);

      // Immediately hide cards 1 and 2 without animation
      if (card1Ref.current && card2Ref.current) {
        gsap.set([card1Ref.current, card2Ref.current], {
          visibility: "hidden",
          opacity: 0,
        });
      }

      // Show cards 3 and 4 with semi-circular entry animations
      if (card3Ref.current && card4Ref.current) {
        // Prepare cards 3 and 4 for semi-circular animation
        gsap.set(card3Ref.current, {
          visibility: "visible",
          opacity: 0,
          x: -500,
          y: 250,
        });

        gsap.set(card4Ref.current, {
          visibility: "visible",
          opacity: 0,
          x: 500,
          y: 250,
        });

        // Animate card 3 with semi-circular entry
        gsap.to(card3Ref.current, {
          opacity: 1,
          duration: 1.0,
          ease: "power2.out",
          motionPath: {
            path: [
              { x: -350, y: 180 },
              { x: -180, y: 60 },
              { x: 0, y: 0 },
            ],
            curviness: 2,
          },
        });

        // Animate card 4 with semi-circular entry
        gsap.to(card4Ref.current, {
          opacity: 1,
          duration: 1.0,
          ease: "power2.out",
          motionPath: {
            path: [
              { x: 350, y: 180 },
              { x: 180, y: 60 },
              { x: 0, y: 100 },
            ],
            curviness: 2,
          },
        });
      }
    } else if (direction === "prev" && currentPage === 1) {
      // Show page 0 (testimonials 1 and 2)
      setCurrentPage(0);

      // Immediately hide cards 3 and 4 without animation
      if (card3Ref.current && card4Ref.current) {
        gsap.set([card3Ref.current, card4Ref.current], {
          visibility: "hidden",
          opacity: 0,
        });
      }

      // Show cards 1 and 2 with semi-circular entry animations
      if (card1Ref.current && card2Ref.current) {
        // Prepare cards 1 and 2 for semi-circular animation
        gsap.set(card1Ref.current, {
          visibility: "visible",
          opacity: 0,
          x: -500,
          y: 250,
        });

        gsap.set(card2Ref.current, {
          visibility: "visible",
          opacity: 0,
          x: 500,
          y: 250,
        });

        // Animate card 1 with semi-circular entry
        gsap.to(card1Ref.current, {
          opacity: 1,
          duration: 1.0,
          ease: "power2.out",
          motionPath: {
            path: [
              { x: -350, y: 180 },
              { x: -180, y: 60 },
              { x: 0, y: 0 },
            ],
            curviness: 2,
          },
        });

        // Animate card 2 with semi-circular entry
        gsap.to(card2Ref.current, {
          opacity: 1,
          duration: 1.0,
          ease: "power2.out",
          motionPath: {
            path: [
              { x: 350, y: 180 },
              { x: 180, y: 60 },
              { x: 0, y: 100 },
            ],
            curviness: 2,
          },
        });
      }
    }
  };

  // Create grid cells
  const renderGridCells = () => {
    // Create a 16x16 grid with colored cells in specific positions
    const cells = [];
    let cellIndex = 0;

    // Add all regular cells and colored cells
    for (let row = 1; row <= 16; row++) {
      for (let col = 1; col <= 16; col++) {
        // Check if this position should have a colored cell
        // Left side cells (columns 1-7)
        // Right side cells (columns 10-16)
        // Columns 8-9 remain uncolored to create separation
        const isColored =
          // Left side colored cells (blue)
          (row === 3 && col === 2) || // grid-cell-1
          (row === 3 && col === 4) || // grid-cell-2
          (row === 4 && col === 3) || // grid-cell-3
          (row === 5 && col === 5) || // grid-cell-4
          (row === 7 && col === 4) || // grid-cell-5
          (row === 2 && col === 6) || // grid-cell-6
          (row === 5 && col === 1) || // grid-cell-7
          (row === 8 && col === 3) || // grid-cell-14
          (row === 6 && col === 5) || // grid-cell-15
          (row === 4 && col === 7) || // grid-cell-16
          (row === 9 && col === 2) || // grid-cell-17
          // Right side colored cells (purple)
          (row === 3 && col === 10) || // grid-cell-8
          (row === 2 && col === 12) || // grid-cell-9
          (row === 4 && col === 11) || // grid-cell-10
          (row === 5 && col === 13) || // grid-cell-11
          (row === 8 && col === 12) || // grid-cell-12
          (row === 6 && col === 14) || // grid-cell-13
          (row === 4 && col === 15) || // grid-cell-18
          (row === 7 && col === 11) || // grid-cell-19
          (row === 9 && col === 14) || // grid-cell-20
          (row === 3 && col === 16) || // grid-cell-21
          (row === 6 && col === 10); // grid-cell-22

        if (isColored) {
          // Add colored cell with appropriate class
          let cellClass = "";

          // Left side cell classes
          if (row === 3 && col === 2) cellClass = "grid-cell-1";
          else if (row === 3 && col === 4) cellClass = "grid-cell-2";
          else if (row === 4 && col === 3) cellClass = "grid-cell-3";
          else if (row === 5 && col === 5) cellClass = "grid-cell-4";
          else if (row === 7 && col === 4) cellClass = "grid-cell-5";
          else if (row === 2 && col === 6) cellClass = "grid-cell-6";
          else if (row === 5 && col === 1) cellClass = "grid-cell-7";
          else if (row === 8 && col === 3) cellClass = "grid-cell-14";
          else if (row === 6 && col === 5) cellClass = "grid-cell-15";
          else if (row === 4 && col === 7) cellClass = "grid-cell-16";
          else if (row === 9 && col === 2) cellClass = "grid-cell-17";
          // Right side cell classes
          else if (row === 3 && col === 10) cellClass = "grid-cell-8";
          else if (row === 2 && col === 12) cellClass = "grid-cell-9";
          else if (row === 4 && col === 11) cellClass = "grid-cell-10";
          else if (row === 5 && col === 13) cellClass = "grid-cell-11";
          else if (row === 8 && col === 12) cellClass = "grid-cell-12";
          else if (row === 6 && col === 14) cellClass = "grid-cell-13";
          else if (row === 4 && col === 15) cellClass = "grid-cell-18";
          else if (row === 7 && col === 11) cellClass = "grid-cell-19";
          else if (row === 9 && col === 14) cellClass = "grid-cell-20";
          else if (row === 3 && col === 16) cellClass = "grid-cell-21";
          else if (row === 6 && col === 10) cellClass = "grid-cell-22";

          // Determine if cell is on left or right side for styling
          const sideClass = col < 8 ? "left-side-cell" : "right-side-cell";

          // Add additional transparency class to some cells for varied opacity
          const isTransparent =
            (row === 3 && col === 2) || // grid-cell-1
            (row === 5 && col === 5) || // grid-cell-4
            (row === 5 && col === 1) || // grid-cell-7
            (row === 4 && col === 7) || // grid-cell-16
            (row === 2 && col === 12) || // grid-cell-9
            (row === 5 && col === 13) || // grid-cell-11
            (row === 4 && col === 15) || // grid-cell-18
            (row === 3 && col === 16); // grid-cell-21

          const transparencyClass = isTransparent
            ? "grid-cell-transparent"
            : "grid-cell-solid";

          cells.push(
            <div
              key={`cell-${row}-${col}`}
              className={`grid-cell grid-cell-colored ${cellClass} ${sideClass} ${transparencyClass}`}
              ref={(el) => (gridCellsRef.current[cellIndex++] = el)}
              style={{ opacity: 0 }} // Initially hidden
            ></div>
          );
        } else {
          // Skip uncolored cells to hide them
          // Just add a placeholder div with no styling
          cells.push(
            <div key={`cell-${row}-${col}`} className="grid-cell-hidden"></div>
          );
        }
      }
    }

    return cells;
  };

  // Create background grid lines
  const renderBackgroundLines = () => {
    const lines = [];
    // Horizontal lines
    for (let i = 1; i <= 8; i++) {
      lines.push(
        <div
          key={`h-line-${i}`}
          className={`horizontal-line horizontal-line-${i}`}
        ></div>
      );
    }
    // Vertical lines
    for (let i = 1; i <= 8; i++) {
      lines.push(
        <div
          key={`v-line-${i}`}
          className={`vertical-line vertical-line-${i}`}
        ></div>
      );
    }
    return lines;
  };

  useEffect(() => {
    // Make sure ScrollTrigger is registered
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Set initial state for text elements
    if (headingRef.current && subheadingRef.current) {
      gsap.set([headingRef.current, subheadingRef.current], {
        opacity: 0,
        y: 30,
      });
    }

    // Set initial state for testimonial cards - two from left, two from right
    if (card1Ref.current) {
      gsap.set(card1Ref.current, {
        opacity: 0,
        x: -500,
        y: 250,
        visibility: "hidden",
      });
    }

    if (card2Ref.current) {
      gsap.set(card2Ref.current, {
        opacity: 0,
        x: 500,
        y: 250,
        visibility: "hidden",
      });
    }

    if (card3Ref.current) {
      gsap.set(card3Ref.current, {
        opacity: 0,
        x: -500,
        y: 250,
        visibility: "hidden",
      });
    }

    if (card4Ref.current) {
      gsap.set(card4Ref.current, {
        opacity: 0,
        x: 500,
        y: 250,
        visibility: "hidden",
      });
    }

    // Set initial state for all grid cells
    if (gridCellsRef.current.length > 0) {
      gridCellsRef.current.forEach((cell) => {
        if (cell) {
          gsap.set(cell, {
            opacity: 0,
            scale: 0.5,
            visibility: "hidden",
          });
        }
      });
    }

    // Define a function to create all animations
    const createAnimations = () => {
      // Create scroll trigger for the section text elements
      if (sectionRef.current && headingRef.current && subheadingRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => {
            // Animate heading, description and button
            gsap.to(headingRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            });

            gsap.to(subheadingRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.2,
              ease: "power2.out",
            });
          },
          once: false,
        });
      }

      // Initialize grid elements
      if (gridRef.current && bgLinesRef.current) {
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top 90%",
          onEnter: () => {
            gsap.to(gridRef.current, {
              opacity: 1,
              visibility: "visible",
              duration: 1.2,
              ease: "power2.out",
            });

            gsap.to(bgLinesRef.current, {
              opacity: 0.15,
              visibility: "visible",
              duration: 1.2,
              ease: "power2.out",
            });
          },
          once: true,
        });
      }

      // Animate grid cells to their final state
      if (testimonialsRef.current && gridCellsRef.current.length > 0) {
        const leftCells = gridCellsRef.current.filter((_, index) => index < 11);
        const rightCells = gridCellsRef.current.filter(
          (_, index) => index >= 11
        );

        // Left side grid cells animation
        ScrollTrigger.create({
          trigger: testimonialsRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(leftCells, {
              opacity: (i, target) => {
                const isTransparent = target.classList.contains(
                  "grid-cell-transparent"
                );
                return isTransparent ? 0.5 : 1;
              },
              scale: 1,
              visibility: "visible",
              duration: 0.8,
              stagger: 0.08,
              ease: "power2.out",
            });
          },
          once: true,
        });

        // Right side grid cells animation
        ScrollTrigger.create({
          trigger: testimonialsRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(rightCells, {
              opacity: (i, target) => {
                const isTransparent = target.classList.contains(
                  "grid-cell-transparent"
                );
                return isTransparent ? 0.5 : 1;
              },
              scale: 1,
              visibility: "visible",
              duration: 0.8,
              stagger: 0.08,
              ease: "power2.out",
            });
          },
          once: true,
        });
      }

      // Create semi-circular animations for cards - only on scroll down
      if (testimonialsRef.current) {
        // Card 1 - From left side
        if (card1Ref.current) {
          ScrollTrigger.create({
            trigger: testimonialsRef.current,
            start: "top 80%",
            markers: false, // Set to true temporarily for debugging
            onEnter: (self) => {
              // Make sure it's visible before animation
              gsap.set(card1Ref.current, { visibility: "visible" });

              // Only animate when scrolling down
              if (!self.direction || self.direction === 1) {
                gsap.to(card1Ref.current, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  duration: 1.0,
                  ease: "power2.out",
                  motionPath: {
                    path: [
                      { x: -350, y: 180 },
                      { x: -180, y: 60 },
                      { x: 0, y: 0 },
                    ],
                    curviness: 2,
                  },
                });
              }
            },
            once: true,
          });
        }

        // Card 2 - From right side
        if (card2Ref.current) {
          ScrollTrigger.create({
            trigger: testimonialsRef.current,
            start: "top 80%",
            markers: false, // Set to true temporarily for debugging
            onEnter: (self) => {
              // Make sure it's visible before animation
              gsap.set(card2Ref.current, { visibility: "visible" });

              // Only animate when scrolling down
              if (!self.direction || self.direction === 1) {
                gsap.to(card2Ref.current, {
                  opacity: 1,
                  x: 0,
                  y: 100,
                  duration: 1.0,
                  ease: "power2.out",
                  motionPath: {
                    path: [
                      { x: 350, y: 180 },
                      { x: 180, y: 60 },
                      { x: 0, y: 100 },
                    ],
                    curviness: 2,
                  },
                });
              }
            },
            once: true,
          });
        }
      }
    };

    // Use a delay to ensure all elements are rendered before setting up animations
    // First call immediately after initial render
    createAnimations();

    // Second call with a delay to catch any late DOM updates
    const initTimeout = setTimeout(() => {
      createAnimations();
      ScrollTrigger.refresh(true);
    }, 200);

    // Third call after window load event to ensure all resources are loaded
    const loadHandler = () => {
      createAnimations();
      ScrollTrigger.refresh(true);
    };

    window.addEventListener("load", loadHandler);

    return () => {
      // Clean up
      window.removeEventListener("load", loadHandler);
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section className="partner-love-section" ref={sectionRef}>
      <div className="partner-container">
        <div className="partner-content">
          <div className="client-svg-container" ref={headingRef}>
            <img src={clientImage} alt="Clients" className="client-svg" />
          </div>
          <h2 className="partner-subheading" ref={subheadingRef}>
            Say About us
          </h2>
        </div>

        {/* Grid section as background */}
        <div className="partner-grid-container">
          {/* Grid background */}
          <div
            className="partner-grid"
            ref={gridRef}
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {renderGridCells()}
          </div>

          {/* Background lines */}
          <div
            className="partner-bg-lines"
            ref={bgLinesRef}
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {renderBackgroundLines()}
          </div>

          {/* Testimonials grid on top of the grid background */}
          <div className="testimonials-grid" ref={testimonialsRef}>
            {/* First column */}
            <div style={{ position: "relative", height: "100%" }}>
              {/* Card 1 */}
              <div className="testimonial-card card-1" ref={card1Ref}>
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img src="/images/placeholder.svg" alt="Malte Lramer" />
                  </div>
                  <div className="testimonial-author">
                    <h4 className="author-name">Malte Lramer</h4>
                    <p className="author-title">Founder & CEO Credible</p>
                  </div>
                </div>
                <p className="testimonial-text">
                  "The Product Highway did a great job with a flagship GTM
                  4-month project for the Mahindra BEVs – XEV 9e and BE.05. From
                  the get-go both the founders, Piyush and Chitranh understood
                  the business objective, requirements and expectations very
                  well. Their can do and will do attitude is commendable wherein
                  they maintained delivery of the unique one-of-a-kind project
                  with high expectations within the tight timelines."
                  <br></br>
                  "The Product Highway did a great job with a flagship GTM
                  4-month project for the Mahindra BEVs – XEV 9e and BE.05. From
                  the get-go both the founders, Piyush and Chitranh understood
                  the business objective, requirements and expectations very
                  well. Their can do and will do attitude is commendable wherein
                  they maintained delivery of the unique one-of-a-kind project
                  with high expectations within the tight timelines."
                </p>
              </div>

              {/* Card 3 - Overlays Card 1 */}
              <div
                className="testimonial-card card-3"
                ref={card3Ref}
                style={{
                  visibility: "hidden",
                  opacity: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img src="/images/placeholder.svg" alt="John Smith" />
                  </div>
                  <div className="testimonial-author">
                    <h4 className="author-name">John Smith</h4>
                    <p className="author-title">CTO at TechVision</p>
                  </div>
                </div>
                <p className="testimonial-text">
                  "We had approached many agencies who said no to the project
                  because they didn't want to risk it on such a large project
                  with a tight schedule, but Piyush took the challenge head on
                  and showed unwavering confidence through the delivery. These
                  are guys who are dedicated and go above and beyond and treat
                  the client's deliverable as their own."
                  <br></br>
                  "We had approached many agencies who said no to the project
                  because they didn't want to risk it on such a large project
                  with a tight schedule, but Piyush took the challenge head on
                  and showed unwavering confidence through the delivery. These
                  are guys who are dedicated and go above and beyond and treat
                  the client's deliverable as their own."
                </p>
              </div>
            </div>

            {/* Second column */}
            <div style={{ position: "relative", height: "100%" }}>
              {/* Card 2 */}
              <div
                className="testimonial-card card-2"
                ref={card2Ref}
                style={{
                  transform: "translateY(150px)",
                  pointerEvents: "none",
                }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img src="/images/placeholder.svg" alt="Malte Lramer" />
                  </div>
                  <div className="testimonial-author">
                    <h4 className="author-name">Malte Lramer</h4>
                    <p className="author-title">Founder & CEO Credible</p>
                  </div>
                </div>
                <p className="testimonial-text">
                  "Thrilled to give a shout to Product Highway for being an
                  amazing tech partner! Their teamwork has been key in shaping
                  our digital journey. The path which they respond in a dynamic
                  environment is truly commendable. Allowing us to reduce our
                  clients beyond their expectations. They vested with us every
                  step of the way, not just there in the backend."
                  <br></br>
                  "Thrilled to give a shout to Product Highway for being an
                  amazing tech partner! Their teamwork has been key in shaping
                  our digital journey. The path which they respond in a dynamic
                  environment is truly commendable. Allowing us to reduce our
                  clients beyond their expectations. They vested with us every
                  step of the way, not just there in the backend."
                </p>
              </div>

              {/* Card 4 - Overlays Card 2 */}
              <div
                className="testimonial-card card-4"
                ref={card4Ref}
                style={{
                  visibility: "hidden",
                  opacity: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  transform: "translateY(150px)",
                  pointerEvents: "none",
                }}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <img src="/images/placeholder.svg" alt="Sarah Johnson" />
                  </div>
                  <div className="testimonial-author">
                    <h4 className="author-name">Sarah Johnson</h4>
                    <p className="author-title">
                      Marketing Director, Innovate Inc
                    </p>
                  </div>
                </div>
                <p className="testimonial-text">
                  "It's been a pleasure working with them who have shown that
                  they are dependable, professional and show high maturity
                  levels inspite of how young their company is. The work
                  delivered by the team was excellent with the final UI and its
                  finesse going beyond expectations. The prompt and continuous
                  support delivered by Chitranh and team through the project was
                  exceptional."
                  <br></br>
                  "It's been a pleasure working with them who have shown that
                  they are dependable, professional and show high maturity
                  levels inspite of how young their company is. The work
                  delivered by the team was excellent with the final UI and its
                  finesse going beyond expectations. The prompt and continuous
                  support delivered by Chitranh and team through the project was
                  exceptional."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows in a separate container */}
        <div className="testimonial-navigation">
          <button
            className={`nav-arrow prev ${
              currentPage === 0 ? "opacity-50" : ""
            }`}
            onClick={() => handleNavigation("prev")}
            disabled={currentPage === 0}
            aria-label="Previous testimonials"
          >
            &#8592;
          </button>
          <button
            className={`nav-arrow next ${
              currentPage === 1 ? "opacity-50" : ""
            }`}
            onClick={() => handleNavigation("next")}
            disabled={currentPage === 1}
            aria-label="Next testimonials"
          >
            &#8594;
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnerLoveSection;
