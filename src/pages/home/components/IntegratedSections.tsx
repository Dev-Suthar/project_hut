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

    // Set initial states - updated for new animations
    gsap.set(firstComponentRef.current, {
      x: 0,
      y: "20%", // Start translated up
      scale: 0.8, // Start scaled down
      opacity: 0.6, // Start slightly faded
      rotation: 0, // No initial rotation
    });

    gsap.set(secondComponentRef.current, {
      scale: 0.8, // Start scaled down
      opacity: 0,
      yPercent: 30, // Start below viewport using yPercent instead of y
      rotation: -5, // Slight initial rotation
    });

    // Banner animation - more subtle and smooth with parallax effect
    if (bannerRef.current) {
      ScrollTrigger.create({
        trigger: bannerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Enhanced parallax effect
          gsap.to(bannerRef.current, {
            y: self.progress * -10, // Increased movement for more noticeable effect
            duration: 0.05, // Even faster updates for smoother feel
            overwrite: "auto",
            ease: "none",
          });
        },
      });
    }

    // Main timeline with improved cubic-bezier transitions
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 3, // Increased scrub value for slower, more controlled animation
        pin: true,
        anticipatePin: 1,
        markers: false,
        pinSpacing: true,
        fastScrollEnd: true,
        preventOverlaps: true,
      },
    });

    // Create a separate ScrollTrigger for cleanup
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onLeaveBack: () => {
        if (spacerRef.current) {
          spacerRef.current.style.display = "block";
        }
      },
      onLeave: () => {
        if (spacerRef.current) {
          spacerRef.current.style.display = "none";
        }
      },
    });

    // FIRST COMPONENT - THREE STATE ANIMATION
    // 1. Initial State to Active State
    masterTimeline.to(
      firstComponentRef.current,
      {
        x: 0,
        y: 0, // Centered
        scale: 1, // Full size
        opacity: 1, // Fully visible
        rotation: 0, // No rotation
        duration: 3.5, // Increased duration for slower animation
        ease: "cubic-bezier(0.23, 1, 0.32, 1)", // Slower ease-in-out
      },
      0
    );

    // 2. Active State to Exit State
    masterTimeline.to(
      firstComponentRef.current,
      {
        x: "-75%", // Move left but not completely off-screen
        y: "-20%", // Move up slightly
        scale: 0.7, // Scale down
        opacity: 0, // Fade out
        rotation: -10, // Rotate slightly
        duration: 4, // Increased duration for slower exit
        ease: "cubic-bezier(0.43, 0, 0.22, 1)", // Slower cubic-bezier for smoother exit
      },
      2
    ); // Increased delay for longer active state

    // SECOND COMPONENT - THREE STATE ANIMATION
    // 1. Initial State (invisible)
    masterTimeline.set(
      secondComponentRef.current,
      {
        scale: 0.8,
        opacity: 0,
        yPercent: 30, // Use yPercent instead of y to work better with translate(-50%, -50%)
        rotation: -5,
      },
      0
    );

    // 2. Transition to Active State
    masterTimeline.to(
      secondComponentRef.current,
      {
        scale: 1, // Full size
        opacity: 1, // Fully visible
        yPercent: 0, // Centered using yPercent
        rotation: 0, // No rotation
        duration: 4, // Increased duration for slower entrance
        ease: "cubic-bezier(0.22, 1, 0.36, 1)", // Slower cubic-bezier with less bounce
      },
      2.5
    ); // Adjusted to start later

    // Team Section animation with staggered card animations
    if (contentRef.current && cardsRef.current.length > 0) {
      // Set initial states for cards with depth effect
      gsap.set(cardsRef.current.filter(Boolean), {
        y: 80,
        opacity: 0,
        scale: 0.9,
        force3D: true,
        transformOrigin: "center bottom",
      });

      // Animate cards with staggered effect and custom cubic-bezier
      masterTimeline.to(
        cardsRef.current.filter(Boolean),
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 3, // Increased duration for slower card animation
          stagger: 0.4, // Increased stagger for more spaced-out card animations
          ease: "cubic-bezier(0.25, 1, 0.5, 1)", // Custom cubic-bezier for smooth entrance
          force3D: true,
        },
        3.5
      ); // Adjusted to start later
    }

    // FORM content scale and fade in with improved cubic-bezier
    masterTimeline.to(
      formRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 2.5, // Increased duration
        ease: "cubic-bezier(0.4, 0, 0.2, 1)", // Material design style cubic-bezier
        force3D: true,
      },
      4.2
    ); // Adjusted to start later

    // Adjust spacer height for proper animations
    if (spacerRef.current) {
      spacerRef.current.style.height = "200vh"; // Increased height for even longer scrolling duration
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
        willChange: "transform, opacity",
        force3D: true,
        backfaceVisibility: "hidden", // Improved hardware acceleration
        perspective: 1000, // Add perspective for 3D transforms
      }
    );

    // Enhanced grid cell animations with staggered reveal
    if (gridRef.current) {
      const gridCells = gridRef.current.querySelectorAll(".grid-cell-colored");

      gsap.set(gridCells, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "center center",
      });

      // Create a separate timeline for grid animations
      const gridTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gridTimeline.to(gridRef.current, {
        opacity: 1,
        visibility: "visible",
        duration: 0.5,
        ease: "cubic-bezier(0.4, 0, 0.2, 1)",
      });

      gridTimeline.to(
        gridCells,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.03, // Quick stagger for cell reveal
          ease: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Slight bounce
        },
        "-=0.3"
      );
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
          style={{ height: "200vh", maxHeight: "200vh" }}
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
            willChange: "transform, opacity",
            paddingTop: "0vh",
            transition: "transform 1s cubic-bezier(0.23, 1, 0.32, 1)", // Slower transition with adjusted easing
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
            transformOrigin: "center center",
            position: "fixed",
            top: "15%",
            left: "50%",
            transform: "translate(-50%, -50%)", // This centers the element
            willChange: "transform, opacity",
            zIndex: "1",
            transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)", // Slower transition with adjusted easing
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
              willChange: "transform, opacity",
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
