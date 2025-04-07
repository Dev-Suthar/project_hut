import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./IntegratedSections.css";
import arrow from "assets/arrow.webp"; // Using arrow.webp instead of SVG

// Add props interface
interface IntegratedSectionsProps {
  onOpenPricingModal: () => void;
}

const IntegratedSections: React.FC<IntegratedSectionsProps> = ({
  onOpenPricingModal,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const firstComponentRef = useRef<HTMLDivElement>(null);
  const secondComponentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bgLinesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // Make sure ScrollTrigger is registered
    if (
      !gsap.globalTimeline
        .getChildren()
        .find((t) => t.vars && t.vars.id === "ScrollTrigger")
    ) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Set initial states
    gsap.set(firstComponentRef.current, { x: 0, y: 0, scale: 1, opacity: 1 });
    gsap.set(secondComponentRef.current, { scale: 2, opacity: 0 }); // Start with larger scale

    // Banner animation - more subtle and smooth
    if (bannerRef.current) {
      ScrollTrigger.create({
        trigger: bannerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Smoother parallax with less movement
          gsap.to(bannerRef.current, {
            y: self.progress * -5, // Reduced movement amount
            duration: 0.1, // Faster updates for smoother feel
            overwrite: "auto", // Prevent animation queue buildup
            ease: "none", // Linear movement for smoothness
          });
        },
      });
    }

    // Main timeline that will control all animations
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        pin: true,
        anticipatePin: 1,
        markers: false,
        pinSpacing: true,
        fastScrollEnd: true,
        preventOverlaps: true,
      },
    });

    // Create a separate ScrollTrigger for cleanup with smoother behavior
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onLeaveBack: () => {
        // When scrolling back to top, ensure animation shows properly
        if (spacerRef.current) {
          spacerRef.current.style.display = "block";
        }
      },
      onLeave: () => {
        // When scrolling down and leaving the section, hide spacer
        if (spacerRef.current) {
          spacerRef.current.style.display = "none";
        }
      },
    });

    // FIRST COMPONENT - stick, then move left, scale down, and fade out
    masterTimeline.to(
      firstComponentRef.current,
      {
        x: 0, // Stick in place initially
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0, // Instant stick
        ease: "none",
      },
      0
    );

    masterTimeline.to(
      firstComponentRef.current,
      {
        x: "-100%", // Move to the left
        y: "-100%", // Move to the top
        scale: 0.5, // Zoom out
        opacity: 0, // Fade out
        duration: 2, // Keep the duration for slower transition
        ease: "power3.inOut", // Keep the easing for smooth transition
      },
      0.5
    ); // Start after initial stick

    // SECOND COMPONENT - suddenly appear large, then scale down to actual size
    masterTimeline.to(
      secondComponentRef.current,
      {
        scale: 2, // Start large
        opacity: 0, // Start invisible
        duration: 0, // Instant appearance
        ease: "none",
      },
      0
    );

    masterTimeline.to(
      secondComponentRef.current,
      {
        scale: 1, // Scale down to actual size
        opacity: 1, // Fade in
        duration: 2, // Keep the duration for slower transition
        ease: "power3.out", // Keep the easing for smooth transition
      },
      1
    ); // Start after first component fades out

    // Team Section animation
    if (contentRef.current && cardsRef.current.length > 0) {
      // Set initial states for cards
      gsap.set(cardsRef.current.filter(Boolean), {
        y: 50,
        opacity: 0,
        force3D: true, // Hardware acceleration
      });

      // Animate cards staggered with smoother timing
      masterTimeline.to(
        cardsRef.current.filter(Boolean),
        {
          y: 0,
          opacity: 1,
          duration: 1.2, // Slightly longer for smoother animation
          stagger: 0.15, // Slightly longer stagger
          ease: "power2.out",
          force3D: true, // Hardware acceleration
        },
        1.2
      ); // Start after second component is visible
    }

    // FORM content scale and fade in with improved timing
    masterTimeline.to(
      formRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 1, // Slightly longer for smoother animation
        ease: "power2.out", // Consistent easing
        force3D: true, // Hardware acceleration
      },
      1.5
    );

    // Adjust spacer height for proper animations
    if (spacerRef.current) {
      spacerRef.current.style.height = "100vh";
    }

    // Add smoother transforms to all animated elements
    gsap.set(
      [
        firstComponentRef.current,
        secondComponentRef.current,
        formRef.current,
        contentRef.current,
        ...cardsRef.current.filter(Boolean),
      ],
      {
        willChange: "transform, opacity", // Hint to browser for optimization
        force3D: true, // Hardware acceleration
      }
    );

    // Add animation for grid cells
    if (gridRef.current) {
      gsap.set(gridRef.current, { opacity: 0, visibility: "hidden" });

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
        },
        once: false,
        onLeaveBack: () => {
          gsap.to(gridRef.current, {
            opacity: 0,
            visibility: "hidden",
            duration: 0.8,
          });
        },
      });
    }

    return () => {
      // Clean up ScrollTrigger when component unmounts
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Handle button clicks to open pricing modal with a simpler approach
  const handleFullServiceTeamClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    // Simply open the modal - the Modal component will handle positioning
    onOpenPricingModal();
  };

  const handleBuildYourOwnTeamClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    // Simply open the modal - the Modal component will handle positioning
    onOpenPricingModal();
  };

  // Create grid cells for TeamSection
  const renderGridCells = () => {
    // Create a 16x16 grid with colored cells in specific positions
    const cells = [];
    let cellIndex = 0;

    // Add all regular cells and colored cells
    for (let row = 1; row <= 16; row++) {
      for (let col = 1; col <= 16; col++) {
        // Check if this position should have a colored cell
        const isColored =
          (row === 3 && col === 2) || // grid-cell-1
          (row === 3 && col === 3) || // grid-cell-2
          (row === 4 && col === 3) || // grid-cell-3
          (row === 4 && col === 4) || // grid-cell-4
          (row === 7 && col === 4) || // grid-cell-5
          (row === 2 && col === 7) || // grid-cell-6
          (row === 4 && col === 7) || // grid-cell-7
          (row === 4 && col === 8) || // grid-cell-8
          (row === 5 && col === 7) || // grid-cell-9
          (row === 2 && col === 12) || // grid-cell-10
          (row === 3 && col === 12) || // grid-cell-11
          (row === 3 && col === 13) || // grid-cell-12
          (row === 5 && col === 14); // grid-cell-13

        if (isColored) {
          // Add colored cell with appropriate class
          let cellClass = "";

          if (row === 3 && col === 2) cellClass = "grid-cell-1";
          else if (row === 3 && col === 3) cellClass = "grid-cell-2";
          else if (row === 4 && col === 3) cellClass = "grid-cell-3";
          else if (row === 4 && col === 4) cellClass = "grid-cell-4";
          else if (row === 7 && col === 4) cellClass = "grid-cell-5";
          else if (row === 2 && col === 7) cellClass = "grid-cell-6";
          else if (row === 4 && col === 7) cellClass = "grid-cell-7";
          else if (row === 4 && col === 8) cellClass = "grid-cell-8";
          else if (row === 5 && col === 7) cellClass = "grid-cell-9";
          else if (row === 2 && col === 12) cellClass = "grid-cell-10";
          else if (row === 3 && col === 12) cellClass = "grid-cell-11";
          else if (row === 3 && col === 13) cellClass = "grid-cell-12";
          else if (row === 5 && col === 14) cellClass = "grid-cell-13";

          // Determine if cell is on left or right side for styling
          const sideClass = col < 8 ? "left-side-cell" : "right-side-cell";

          // Add additional transparency class to some cells for varied opacity
          const isTransparent =
            (row === 3 && col === 2) || // grid-cell-1
            (row === 4 && col === 4) || // grid-cell-4
            (row === 4 && col === 7) || // grid-cell-7
            (row === 2 && col === 12); // grid-cell-10

          const transparencyClass = isTransparent
            ? "grid-cell-transparent"
            : "grid-cell-solid";

          // Calculate the gridArea property to ensure cells are perfectly aligned
          const gridArea = `${row} / ${col} / ${row + 1} / ${col + 1}`;

          cells.push(
            <div
              key={`cell-${row}-${col}`}
              className={`grid-cell grid-cell-colored ${cellClass} ${sideClass} ${transparencyClass}`}
              style={{
                opacity: 0,
                margin: 0,
                padding: 0,
                border: 0,
                boxSizing: "border-box",
                fontSize: 0,
                lineHeight: 0,
                gridArea: gridArea,
                width: "100%",
                height: "100%",
                display: "block",
              }}
            ></div>
          );
        } else {
          // Skip uncolored cells to hide them
          // Just add a placeholder div with no styling
          // Calculate the gridArea property for hidden cells too
          const gridArea = `${row} / ${col} / ${row + 1} / ${col + 1}`;

          cells.push(
            <div
              key={`cell-${row}-${col}`}
              className="grid-cell-hidden"
              style={{
                margin: 0,
                padding: 0,
                border: 0,
                fontSize: 0,
                lineHeight: 0,
                gridArea: gridArea,
                width: "100%",
                height: "100%",
              }}
            ></div>
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

  return (
    <div
      className="integrated-sections-wrapper"
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        ref={sectionRef}
        className="integrated-sections relative bg-black"
        style={{
          height: "100vh",
          maxHeight: "100vh",
          marginBottom: 0,
          paddingBottom: 0,
        }}
      >
        {/* SPACER for scrolling - height adjusted for animation */}
        <div
          ref={spacerRef}
          className="spacer-div"
          style={{ height: "100vh", maxHeight: "100vh" }}
        ></div>

        {/* FIRST COMPONENT - Roadmap style */}
        <div
          ref={firstComponentRef}
          className="min-h-screen flex items-center justify-center fixed top-0 left-0 w-full project-roadmap-style"
          style={{
            transformOrigin: "center center",
            background: "#000000",
            perspective: "1200px",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity", // Optimize for animation
            paddingTop: "0vh", // Reduced padding from top
          }}
        >
          <div className="roadmap-content w-full max-w-4xl mx-auto">
            <div className="roadmap-step">
              <span className="step-action" style={{ color: "#4977FE" }}>
                Share
              </span>
              <h2 className="step-title">Requirements</h2>
            </div>

            <div className="roadmap-step">
              <span className="step-action" style={{ color: "#46D5B3" }}>
                Agree on
              </span>
              <h2 className="step-title">Scope & models</h2>
            </div>

            <div className="roadmap-step">
              <span className="step-action" style={{ color: "#FEE15F" }}>
                Onboard
              </span>
              <h2 className="step-title">The team</h2>
            </div>

            {/* BUILD BANNER */}
            <div className="build-banner-container" ref={bannerRef}>
              <div className="roadmap-banner">
                <div className="banner-text">
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                </div>

                <div className="banner-text reverse">
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS BUILD SOMETHING COOL</span>
                  <span className="arrow-icon">
                    <img src={arrow} alt="arrow" width="34" height="27" />
                  </span>
                  <span>LETS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECOND COMPONENT - Team Section */}
        <div
          ref={secondComponentRef}
          className="fixed w-full h-full"
          style={{
            backgroundColor: "#000000",
            opacity: 0, // Initial state
            transformOrigin: "center center", // Ensures rotation happens from the center
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            willChange: "transform, opacity", // Optimize for animation
            zIndex: "1", // Lower z-index to ensure modal can go on top
          }}
        >
          {/* Team Section Component */}
          <div
            className="team-section-container fully-visible"
            style={{ fontSize: 0, lineHeight: 0 }}
          >
            {/* Background elements */}
            <div className="team-bg-gradient"></div>

            {/* Grid background */}
            <div
              className="team-grid grid-no-gap"
              ref={gridRef}
              style={{
                opacity: 0,
                visibility: "hidden",
                gap: 0,
                margin: 0,
                padding: 0,
                fontSize: 0,
                lineHeight: 0,
                borderCollapse: "collapse",
                borderSpacing: 0,
              }}
            >
              {renderGridCells()}
            </div>

            {/* Background lines */}
            <div
              className="team-bg-lines"
              ref={bgLinesRef}
              style={{ opacity: 0.15, visibility: "visible" }}
            >
              {renderBackgroundLines()}
            </div>

            {/* Main content */}
            <div
              className="team-section-content"
              ref={contentRef}
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="team-cards">
                <div
                  className="team-card"
                  ref={(el) => (cardsRef.current[0] = el)}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="team-card-inner">
                    <div className="team-card-header">
                      <h3>Full-Service Team</h3>
                      <p className="team-card-subtitle">
                        (We Handle Everything)
                      </p>
                    </div>
                    <div className="team-card-divider"></div>
                    <button
                      className="team-card-button"
                      onClick={handleFullServiceTeamClick}
                    >
                      GET A FULL-SERVICE TEAM
                    </button>
                    <ul className="team-card-list">
                      <li>
                        <span className="arrow-icon">
                          <img src={arrow} alt="Arrow" />
                        </span>
                        <span>WE MANAGE DESIGN, DEVELOPMENT, AND STRATEGY</span>
                      </li>
                      <li>
                        <span className="arrow-icon">
                          <img src={arrow} alt="Arrow" />
                        </span>
                        <span>MINIMAL CLIENT INVOLVEMENT</span>
                      </li>
                      <li>
                        <span className="arrow-icon">
                          <img src={arrow} alt="Arrow" />
                        </span>
                        <span>AI-POWERED WORKFLOWS AND EXPERT LED TEAMS</span>
                      </li>
                    </ul>
                    <div className="team-card-footer">
                      <p className="team-card-footer-desc">
                        Ideal for: Rapid MVPs, scaling products, and hands-off
                        execution
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="team-card"
                  ref={(el) => (cardsRef.current[1] = el)}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="team-card-inner">
                    <div className="team-card-header">
                      <h3>Build Your Own Team</h3>
                      <p className="team-card-subtitle">
                        (Tailored Talent, Your way)
                      </p>
                    </div>
                    <div className="team-card-divider"></div>
                    <button
                      className="team-card-button"
                      onClick={handleBuildYourOwnTeamClick}
                    >
                      BUILD YOUR OWN TEAM
                    </button>
                    <ul className="team-card-list">
                      <li>
                        <span className="arrow-icon">
                          <img src={arrow} alt="Arrow" />
                        </span>
                        <span>CHOOSE THE RIGHT MIX OF EXPERTS UPFRONT</span>
                      </li>
                      <li>
                        <span className="arrow-icon">
                          <img src={arrow} alt="Arrow" />
                        </span>
                        <span>
                          CLIENT-LED EXECUTION: YOU MANAGE THE PROJECT, WE
                          PROVIDE THE TALENT
                        </span>
                      </li>
                      <li>
                        <span className="arrow-icon">
                          <img src={arrow} alt="Arrow" />
                        </span>
                        <span>
                          OUR EXPERTS WORK AS AN EXTENSION OF YOUR TEAM
                        </span>
                      </li>
                    </ul>
                    <div className="team-card-footer">
                      <p className="team-card-footer-desc">
                        Ideal for: Teams that need specific expertise
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORM CONTENT */}
          <div
            ref={formRef}
            className="w-full max-w-4xl mx-auto p-8"
            style={{
              opacity: 0,
              scale: 0.8,
              willChange: "transform, opacity", // Optimize for animation
            }}
          >
            {/* Form content removed since TeamSection now replaces it */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedSections;
