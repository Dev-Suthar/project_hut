import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import "./Hero.css";
import gsap from "gsap";

// Define TypeScript interfaces for props and state
interface ImagesLoadedState {
  designer: boolean;
  developer: boolean;
  manager: boolean;
}

// Define screen size type for better type safety
type ScreenSizeCategory = "xs" | "sm" | "md" | "lg" | "xl";

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const floatingItemsRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const bottomTextRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [animationsInitialized, setAnimationsInitialized] =
    useState<boolean>(false);
  const [animationsComplete, setAnimationsComplete] = useState<boolean>(false);
  const [layoutInitialized, setLayoutInitialized] = useState<boolean>(false);

  // Add state to track image loading
  const [imagesLoaded, setImagesLoaded] = useState<ImagesLoadedState>({
    designer: false,
    developer: false,
    manager: false,
  });

  // Refs for animation targets
  const requestRef = useRef<number | null | NodeJS.Timeout>(null);
  const previousTimeRef = useRef<number>(0);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mouse position state
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Add last animation timestamp to track tab visibility
  const lastAnimationTimestampRef = useRef<number>(Date.now());
  // Add animation active flag to prevent multiple animation loops
  const isAnimationActiveRef = useRef<boolean>(false);

  // Card placeholder colors - matching Figma design
  const designerCardColor = "#D6DBDD";
  const developerCardColor = "#D6DBDD";
  const managerCardColor = "#D6DBDD";

  // Add image URLs for the cards
  const designerCardImage =
    "https://s3-alpha-sig.figma.com/img/9e31/3991/5ed043d1a3eb81793ec6fa33b13b07e8?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=o-umtNul6WUphct03gt7kKrgAK0kBdPuVEzruX5cSmgz6MpB~5BQewQY~Btax7i4mUHxqkYB~xCZ~MKijAcMmHrswNYUxVezHu8G8UcglEJyWg4pjH9NrWkSdrL6l7J6isAnIq1W4DZ4fj3Hnrn76McoIPDZ4Ec-HegE26KpiF4vBftySUuFfS4ykVVUonA8FOhc4mYwAVyMr3zc4jvmErriYPWEbV9YuTikwBkToU3CABeq5P4ALcgVJ4pRVprfFa9rRnsfdCwEX8FAWmaC~QFSJtnY38O~~NXDHMo-JPVatI5vk9-eyBeL-wbe2-ecKFp8Bhk51qQJyL6IRavoTA__";
  const developerCardImage =
    "https://s3-alpha-sig.figma.com/img/3d2f/041e/31a7d6c1d90643ad354ea082414a4c5a?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tJWpYW0vULYWfyDh3ot40qFdJcGY0nb0MwQos6ClC6s9XqTr-9JmvzRS0dUNFAbktL1sksQL1YF29TGBTBKJdWOsDp0NkS-UttlYe80OxAp~94mY53YXgdK0Vtp0OygZcbO4Gb7sT9wK45KTT94eOTJb~d1JDCRxiYx7tu3b3GxkoM3uvRZkLPmHAXVoePr-mfPotypS5mb4oIAcvoOp800FpEaWBijOrJmuG8PU0ktlHc7wKie5FFEUUU9DeBlAzZ1~Yqnf927Kn7gaPs-eam~fgk8wLYK-w9gSl9aDz4wBlKxPuoaABGUHR-bczy1r8Ecq3S6PKF2j2ow80Soo0A__";
  const managerCardImage =
    "https://s3-alpha-sig.figma.com/img/087d/a659/8bf2db9a96aa5a1c4f2daa63233793f1?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=koKr~jM66gxWicg8R1b1iVAOq-FgDuhXH2i1-syWYGuQfh-uWLkB0CsMHFfTlg3ZZqm4tZCc6uI8FGD-I9zCyaNvAXrhmseAw0mer7yvIWOnppRwyqdjA~CoVubFN7~1Uo4JpPh46-GAcH8fvv7rxXPXbvGyo5W~t2KBkb4LL3we1bH9Mhl6XCNZgGXbZJaEY7FnBPy6nX4-qfJkw4xiPhdyKSoSlpUzemdN0a~moL~Ng~LJa2cwfGxtM9PfacsUQrHlQ74R5ijGf6FC554aFszNqOF-nVhzWaOUzCwPYYg~NuBAfRnQDd1oKsAG64hcm8FswBFe4WG0dwgL0DJrkA__";

  // Add this immediately after the existing refs
  const cardVisibilityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Add more detailed screen size detection
  const [screenSize, setScreenSize] = useState<ScreenSizeCategory>(
    getScreenSizeCategory()
  );

  // Add optimization state for performance on mobile
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Function to determine screen size category
  function getScreenSizeCategory(): ScreenSizeCategory {
    const width = window.innerWidth;
    if (width < 576) return "xs"; // Extra small
    if (width < 768) return "sm"; // Small
    if (width < 992) return "md"; // Medium
    if (width < 1200) return "lg"; // Large
    return "xl"; // Extra large
  }

  // Modify the resize handler to detect mobile
  const handleResizeDebounce = useCallback(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new debounce timer (200ms for smoother transitions)
    debounceTimerRef.current = setTimeout(() => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setScreenSize(getScreenSizeCategory());

      // Set mobile flag for performance optimizations
      setIsMobile(width < 768);

      // Reset animations when window is resized
      if (animationsInitialized) {
        initAnimations();
      }

      // Force reposition cards after resize
      if (floatingItemsRef.current && animationsComplete) {
        repositionCards(width);
      }
    }, 200);
  }, [animationsInitialized, animationsComplete]);

  // Function to handle mouse move for parallax effect
  const handleMouseMoveDebounce = useCallback((e: MouseEvent) => {
    // Always track mouse position for immediate response
    mousePosition.current = {
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    };

    // Start animation frame if not already running
    if (!isAnimationActiveRef.current && floatingItemsRef.current) {
      isAnimationActiveRef.current = true;
      requestRef.current = requestAnimationFrame(animateParallaxDebounce);
    }
  }, []);

  // Add function to reposition cards based on screen size
  const repositionCards = useCallback((width: number) => {
    if (!floatingItemsRef.current) return;

    const items = floatingItemsRef.current.querySelectorAll(".floating-item");
    const designerCard = items[0] as HTMLElement;
    const developerCard = items[1] as HTMLElement;
    const managerCard = items.length > 2 ? (items[2] as HTMLElement) : null;

    if (width < 576) {
      // Extra small screens
      // Stack cards vertically in the center
      if (designerCard) {
        gsap.set(designerCard, {
          clearProps: "all",
          position: "relative",
          top: "0%",
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          rotation: -5,
          scale: 0.9,
          opacity: 1,
          visibility: "visible",
          margin: "10px 0",
        });
      }

      if (developerCard) {
        gsap.set(developerCard, {
          clearProps: "all",
          position: "relative",
          top: "0%",
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          rotation: 5,
          scale: 0.9,
          opacity: 1,
          visibility: "visible",
          margin: "30px 0 10px 0",
        });
      }

      if (managerCard) {
        gsap.set(managerCard, {
          clearProps: "all",
          position: "relative",
          top: "0%",
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          rotation: -7,
          scale: 0.9,
          opacity: 1,
          visibility: "visible",
          margin: "10px 0 30px 0",
        });
      }

      // Make floating-items a vertical container for mobile
      gsap.set(floatingItemsRef.current, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "auto",
        width: "100%",
        padding: "20px 0",
        marginTop: "40px",
      });
    } else if (width < 768) {
      // Small screens
      // Similar to XS but with slightly different positioning
      // Almost identical layout but with different rotations and spacing
      if (designerCard) {
        gsap.set(designerCard, {
          clearProps: "all",
          position: "relative",
          top: "0%",
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          rotation: -8,
          scale: 0.95,
          opacity: 1,
          visibility: "visible",
          margin: "15px 0",
        });
      }

      if (developerCard) {
        gsap.set(developerCard, {
          clearProps: "all",
          position: "relative",
          top: "0%",
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          rotation: 8,
          scale: 0.95,
          opacity: 1,
          visibility: "visible",
          margin: "40px 0 15px 0",
        });
      }

      if (managerCard) {
        gsap.set(managerCard, {
          clearProps: "all",
          position: "relative",
          top: "0%",
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          rotation: -10,
          scale: 0.95,
          opacity: 1,
          visibility: "visible",
          margin: "15px 0 40px 0",
        });
      }

      // Make floating-items a vertical container for mobile
      gsap.set(floatingItemsRef.current, {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "auto",
        width: "100%",
        padding: "30px 0",
        marginTop: "50px",
      });
    } else if (width < 992) {
      // Medium screens - Tablet
      // Position cards in a triangle pattern
      if (designerCard) {
        gsap.set(designerCard, {
          position: "absolute",
          top: "35%",
          left: "20%",
          xPercent: -50,
          yPercent: -50,
          rotation: -20,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      if (developerCard) {
        gsap.set(developerCard, {
          position: "absolute",
          top: "35%",
          left: "80%",
          xPercent: -50,
          yPercent: -50,
          rotation: 10,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      if (managerCard) {
        gsap.set(managerCard, {
          position: "absolute",
          top: "75%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          rotation: -12,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      // Reset floating-items container for desktop
      gsap.set(floatingItemsRef.current, {
        position: "absolute",
        display: "block",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      });
    } else if (width < 1200) {
      // Large screens
      // Position cards with more spread
      if (designerCard) {
        gsap.set(designerCard, {
          position: "absolute",
          top: "40%",
          left: "5%",
          xPercent: -50,
          yPercent: -50,
          rotation: -25,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      if (developerCard) {
        gsap.set(developerCard, {
          position: "absolute",
          top: "35%",
          left: "95%",
          xPercent: -50,
          yPercent: -50,
          rotation: 15,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      if (managerCard) {
        gsap.set(managerCard, {
          position: "absolute",
          top: "85%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          rotation: -12,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      // Reset floating-items container for desktop
      gsap.set(floatingItemsRef.current, {
        position: "absolute",
        display: "block",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      });
    } else {
      // Extra large screens
      // Position cards with maximum spread
      if (designerCard) {
        gsap.set(designerCard, {
          position: "absolute",
          top: "45%",
          left: "0%",
          xPercent: -50,
          yPercent: -50,
          rotation: -30,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      if (developerCard) {
        gsap.set(developerCard, {
          position: "absolute",
          top: "40%",
          left: "100%",
          xPercent: -50,
          yPercent: -50,
          rotation: 10,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      if (managerCard) {
        gsap.set(managerCard, {
          position: "absolute",
          top: "90%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          rotation: -12,
          scale: 1,
          opacity: 1,
          visibility: "visible",
        });
      }

      // Reset floating-items container for desktop
      gsap.set(floatingItemsRef.current, {
        position: "absolute",
        display: "block",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      });
    }
  }, []);

  // Modify the ensureCardsVisible function to include repositioning
  const ensureCardsVisible = useCallback(() => {
    if (floatingItemsRef.current && animationsComplete) {
      const items = floatingItemsRef.current.querySelectorAll(".floating-item");
      let anyCardFixed = false;

      items.forEach((item) => {
        const element = item as HTMLElement;

        try {
          // Force cards to be visible - this is the key fix
          if (
            window.getComputedStyle(element).opacity < "0.9" ||
            element.style.opacity === "0" ||
            !element.style.transform ||
            element.style.visibility === "hidden" ||
            element.getBoundingClientRect().width === 0
          ) {
            // Add check for zero width (hidden elements)
            anyCardFixed = true;

            // Reset data attributes to prevent NaN propagation on animation resume
            element.setAttribute("data-x", "0");
            element.setAttribute("data-y", "0");

            gsap.to(element, {
              opacity: 1,
              visibility: "visible",
              x: 0, // Reset any problematic transformations
              y: 0,
              duration: 0.2,
              overwrite: "auto",
              force3D: true,
              immediateRender: true, // Force immediate rendering
              onComplete: () => {
                // Ensure the card stays visible
                element.style.opacity = "1";
                element.style.visibility = "visible";

                // Reset transform if it's causing issues
                if (
                  !element.style.transform ||
                  element.getBoundingClientRect().width === 0
                ) {
                  repositionCards(windowWidth);
                }
              },
            });
          }
        } catch (err) {
          // Fallback if error occurs when checking card visibility
          console.error("Error in ensureCardsVisible:", err);
          gsap.set(element, {
            opacity: 1,
            visibility: "visible",
            x: 0,
            y: 0,
            scale: 1,
            force3D: true,
          });
        }
      });

      // Log if any cards needed fixing (helpful for debugging)
      if (anyCardFixed) {
        console.log("Fixed disappearing cards");
      }
    }
  }, [animationsComplete, repositionCards, windowWidth]);

  // Add initAnimations function declaration here
  const initAnimations = useCallback(() => {
    if (!heroRef.current) return;

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(".hero-title-line");
    gsap.killTweensOf(".bottom-text-container");
    gsap.killTweensOf(".grid-cell-colored");

    // Don't kill floating item animations during re-init to prevent disappearing
    // This prevents cards from disappearing during fast scrolling
    if (!animationsComplete) {
      // Don't set initial opacity to 0 if layout is already initialized
      if (!layoutInitialized) {
        gsap.set(".floating-item", {
          y: 100,
          opacity: 0,
          filter: "blur(15px)",
        });
      } else {
        // For subsequent animations, keep cards visible but apply subtle effects
        gsap.set(".floating-item", { opacity: 1, visibility: "visible" });
      }
    }

    // Set initial states
    gsap.set(".hero-title-line", { y: 50, opacity: 0, filter: "blur(10px)" });
    gsap.set(".bottom-text-container", { y: 30, opacity: 0 });
    gsap.set(".grid-cell-colored", { opacity: 0, scale: 0.8 });

    // Create a timeline for better sequencing
    const mainTimeline = gsap.timeline({
      onComplete: () => {
        setAnimationsComplete(true);
        if (heroRef.current) {
          heroRef.current.classList.add("animation-complete");
        }
      },
    });

    // Add animations to timeline
    mainTimeline
      // Animate grid cells first
      .to(
        ".grid-cell-colored",
        {
          opacity: 0.8,
          scale: 1,
          duration: 1.8,
          stagger: 0.06,
          ease: "power2.out",
          force3D: true,
        },
        0
      )

      // Animate title lines
      .to(
        ".hero-title-line",
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          stagger: 0.25,
          ease: "power3.out",
          force3D: true,
        },
        0.3
      );

    // Only animate floating items if they haven't been animated yet or aren't visible
    if (!animationsComplete) {
      // Apply different animations based on screen size
      if (windowWidth < 768) {
        // Mobile
        // For mobile, animate cards with a simpler entrance
        mainTimeline.to(
          ".floating-item",
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            force3D: true,
          },
          0.8
        );
      } else {
        // Desktop animation (original)
        mainTimeline.to(
          ".floating-item",
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.4,
            stagger: 0.2,
            ease: "power2.out",
            force3D: true,
          },
          0.8
        );
      }
    } else {
      // If animations already completed, ensure floating items remain visible
      gsap.set(".floating-item", { opacity: 1, y: 0, filter: "blur(0px)" });
    }

    // Animate bottom text
    mainTimeline.to(
      ".bottom-text-container",
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        force3D: true,
      },
      1.2
    );

    // Set animations as initialized
    setAnimationsInitialized(true);

    // Ensure cards are visible after animations initialize
    setTimeout(ensureCardsVisible, 100);
    setTimeout(ensureCardsVisible, 500);
    setTimeout(ensureCardsVisible, 1000);
  }, [animationsComplete, ensureCardsVisible, windowWidth, layoutInitialized]);

  // Optimize the animation loop for mobile
  const animateParallaxDebounce = useCallback(
    (time: number) => {
      // Update last animation timestamp
      lastAnimationTimestampRef.current = Date.now();

      if (previousTimeRef.current === 0) {
        previousTimeRef.current = time;
      }

      previousTimeRef.current = time;

      // Skip intensive animations on mobile for better performance
      if (isMobile) {
        // On mobile, only apply minimal animations or skip altogether
        if (floatingItemsRef.current) {
          const items =
            floatingItemsRef.current.querySelectorAll(".floating-item");

          items.forEach((item) => {
            // Apply minimal animations for mobile
            gsap.set(item, {
              scale: 1,
              opacity: 1,
              force3D: true,
              visibility: "visible", // Ensure visibility is explicit
            });
          });
        }

        // Continue animation loop at a lower framerate for mobile
        requestRef.current = setTimeout(() => {
          requestAnimationFrame(animateParallaxDebounce);
        }, 100); // Add delay for mobile to reduce CPU usage

        return;
      }

      // Full animation for desktop
      if (floatingItemsRef.current) {
        const items =
          floatingItemsRef.current.querySelectorAll(".floating-item");

        items.forEach((item) => {
          const element = item as HTMLElement;

          // Skip animations for invisible elements to prevent NaN calculations
          if (
            element.style.visibility === "hidden" ||
            !element.isConnected ||
            element.getBoundingClientRect().width === 0
          ) {
            // Reset the element to a valid state
            gsap.set(element, {
              x: 0,
              y: 0,
              opacity: 1,
              visibility: "visible",
              force3D: true,
            });

            // Reset data attributes to prevent NaN propagation
            element.setAttribute("data-x", "0");
            element.setAttribute("data-y", "0");
            return;
          }

          const speed = parseFloat(
            element.getAttribute("data-speed") || "0.03"
          );
          const directionX = parseFloat(
            element.getAttribute("data-direction-x") || "1"
          );
          const directionY = parseFloat(
            element.getAttribute("data-direction-y") || "1"
          );

          // Safely parse current positions with fallbacks to prevent NaN
          let currentX = 0;
          let currentY = 0;

          try {
            currentX = parseFloat(element.getAttribute("data-x") || "0") || 0;
            currentY = parseFloat(element.getAttribute("data-y") || "0") || 0;

            // Safety check for NaN/invalid values
            if (isNaN(currentX) || !isFinite(currentX)) currentX = 0;
            if (isNaN(currentY) || !isFinite(currentY)) currentY = 0;
          } catch (e) {
            // Reset if any parsing errors occur
            currentX = 0;
            currentY = 0;
          }

          // Get item's position in the viewport
          const rect = element.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const itemCenterY = rect.top + rect.height / 2;

          // Calculate normalized direction from mouse to item (-1 to 1 range)
          const mouseX =
            mousePosition.current.x * window.innerWidth + window.innerWidth / 2;
          const mouseY =
            mousePosition.current.y * window.innerHeight +
            window.innerHeight / 2;

          // Vector from mouse to item center
          const vectorX = (itemCenterX - mouseX) / window.innerWidth;
          const vectorY = (itemCenterY - mouseY) / window.innerHeight;

          // Calculate distance from mouse to item (0-1 range)
          const distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
          const normalizedDistance = Math.min(distance * 3, 1); // Amplify effect for nearby items

          // Calculate movement with directional push away from mouse
          const pushFactor = 250; // Strength of push effect
          const targetX = vectorX * pushFactor * speed * directionX;
          const targetY = vectorY * pushFactor * speed * directionY;

          // Apply smooth easing with distance-based damping
          const easing = 0.1 + 0.15 * (1 - normalizedDistance); // Faster response when closer

          // Clamping to prevent extreme values
          let newX = currentX + (targetX - currentX) * easing;
          let newY = currentY + (targetY - currentY) * easing;

          // Clamp values to prevent extreme movement
          const maxOffset = 500;
          newX = Math.max(Math.min(newX, maxOffset), -maxOffset);
          newY = Math.max(Math.min(newY, maxOffset), -maxOffset);

          // Store current position as data attributes
          element.setAttribute("data-x", newX.toString());
          element.setAttribute("data-y", newY.toString());

          // Calculate dynamic perspective tilt based on direction vector
          const tiltX = -vectorY * 20 * directionY * normalizedDistance;
          const tiltY = vectorX * 20 * directionX * normalizedDistance;

          // Calculate scale effect based on distance (cards grow slightly as mouse approaches)
          const baseScale = 1;
          const scaleBoost = 0.08 * (1 - normalizedDistance);
          const scale = baseScale + scaleBoost;

          try {
            // Apply transform with hardware acceleration including perspective effects
            gsap.set(element, {
              x: newX,
              y: newY,
              rotationX: tiltX,
              rotationY: tiltY,
              scale: scale,
              rotation: element.classList.contains("manager-card")
                ? -12 + vectorX * 5
                : element.classList.contains("designer-card")
                ? -5 + vectorX * 3
                : 5 + vectorX * 3,
              force3D: true,
              transformPerspective: 1000,
              opacity: 1, // Always ensure opacity is 1
              visibility: "visible", // Always ensure visibility
            });
          } catch (err) {
            // Fallback if animation fails - reset to safe values
            gsap.set(element, {
              x: 0,
              y: 0,
              opacity: 1,
              visibility: "visible",
              scale: 1,
              rotation: 0,
              force3D: true,
            });
          }
        });
      }

      // Continue animation loop
      requestRef.current = requestAnimationFrame(animateParallaxDebounce);
    },
    [isMobile]
  );

  // Initialize floating animation for desktop
  const initFloatingAnimation = useCallback(() => {
    if (windowWidth >= 1024 && animationsComplete) {
      const items = document.querySelectorAll(".floating-item");

      items.forEach((item, index) => {
        // Create random values for floating animation
        const randomY = Math.random() * 15 + 5;
        const randomDuration = Math.random() * 3 + 5;
        const randomDelay = Math.random() * 2;

        // Apply floating animation with GSAP
        gsap.to(item, {
          y: randomY,
          duration: randomDuration,
          delay: randomDelay,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      });
    }
  }, [windowWidth, animationsComplete]);

  // Function to handle image load events
  const handleImageLoaded = (cardType: keyof ImagesLoadedState) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [cardType]: true,
    }));
  };

  // Function to handle image load errors
  const handleImageError = (cardType: keyof ImagesLoadedState) => {
    console.error(`Failed to load ${cardType} image`);
    // Keep the card visible even if image fails to load
    setImagesLoaded((prev) => ({
      ...prev,
      [cardType]: true,
    }));
  };

  // Use useLayoutEffect to position cards before browser paint
  useLayoutEffect(() => {
    // Set initial screen size and mobile flag
    const width = window.innerWidth;
    setWindowWidth(width);
    setScreenSize(getScreenSizeCategory());
    setIsMobile(width < 768);

    // Position cards immediately before first paint
    if (floatingItemsRef.current && !layoutInitialized) {
      repositionCards(width);
      setLayoutInitialized(true);
    }
  }, [layoutInitialized, repositionCards]);

  // Add effect to reposition cards when screen size changes
  useEffect(() => {
    if (layoutInitialized) {
      repositionCards(windowWidth);
    }
  }, [layoutInitialized, repositionCards, screenSize, windowWidth]);

  // Add visibility change handler to detect tab focus changes
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      // Page is now hidden, cleanup animation loop
      if (requestRef.current) {
        if (isMobile) {
          clearTimeout(requestRef.current as NodeJS.Timeout);
        } else {
          cancelAnimationFrame(requestRef.current as number);
        }
        requestRef.current = null;
        isAnimationActiveRef.current = false;
      }
    } else {
      // Page is visible again
      const timeSinceLastAnimation =
        Date.now() - lastAnimationTimestampRef.current;

      // If it's been a while since the last animation, reset the cards
      if (timeSinceLastAnimation > 500) {
        // 500ms threshold
        // Reset card positions on becoming visible after being hidden
        if (floatingItemsRef.current) {
          const items =
            floatingItemsRef.current.querySelectorAll(".floating-item");

          items.forEach((item) => {
            const element = item as HTMLElement;
            // Reset position data attributes
            element.setAttribute("data-x", "0");
            element.setAttribute("data-y", "0");

            // Apply stable base position
            gsap.set(element, {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              visibility: "visible",
              force3D: true,
            });
          });
        }

        // Force card repositioning
        repositionCards(window.innerWidth);

        // Enforce card visibility
        ensureCardsVisible();
      }

      // Restart animation if needed
      if (!isAnimationActiveRef.current && floatingItemsRef.current) {
        isAnimationActiveRef.current = true;
        requestRef.current = requestAnimationFrame(animateParallaxDebounce);
      }
    }
  }, [animateParallaxDebounce, ensureCardsVisible, isMobile, repositionCards]);

  // Modify the effect for initialization to account for mobile detection and visibility changes
  useEffect(() => {
    // Only initialize animations if layout is already set
    if (layoutInitialized) {
      // Initialize animations
      initAnimations();
    }

    // Add event listeners
    window.addEventListener("resize", handleResizeDebounce);

    // Add mousemove listener to document for better tracking
    document.addEventListener(
      "mousemove",
      handleMouseMoveDebounce as unknown as EventListener
    );

    // Add visibility change listener to handle tab switching
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add mouse leave/enter listeners for the window
    document.addEventListener("mouseleave", () => {
      // When mouse leaves window, pause animation loop
      if (requestRef.current) {
        if (isMobile) {
          clearTimeout(requestRef.current as NodeJS.Timeout);
        } else {
          cancelAnimationFrame(requestRef.current as number);
        }
        requestRef.current = null;
        isAnimationActiveRef.current = false;
      }
    });

    document.addEventListener("mouseenter", () => {
      // When mouse enters window, restart animation loop
      if (!isAnimationActiveRef.current && floatingItemsRef.current) {
        isAnimationActiveRef.current = true;
        requestRef.current = requestAnimationFrame(animateParallaxDebounce);
      }
    });

    // Add scroll event listener to ensure cards stay visible
    const handleScroll = () => {
      // Schedule immediate card visibility check
      ensureCardsVisible();

      // Additional check after scroll finishes - critical for fixing the issue
      clearTimeout(debounceTimerRef.current as NodeJS.Timeout);
      debounceTimerRef.current = setTimeout(() => {
        ensureCardsVisible();
      }, 100);
    };

    // Use passive event listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Start animation loop for parallax
    if (!isAnimationActiveRef.current) {
      isAnimationActiveRef.current = true;
      requestRef.current = requestAnimationFrame(animateParallaxDebounce);
    }

    // Add a special listener for scrollend (when available in browser)
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", ensureCardsVisible, {
        passive: true,
      });
    }

    // Setup periodic card visibility check for robustness
    const periodicCheckInterval = setInterval(() => {
      ensureCardsVisible();
    }, 5000); // Check every 5 seconds

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResizeDebounce);
      document.removeEventListener(
        "mousemove",
        handleMouseMoveDebounce as unknown as EventListener
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mouseleave", () => {});
      document.removeEventListener("mouseenter", () => {});
      window.removeEventListener("scroll", handleScroll);

      if ("onscrollend" in window) {
        window.removeEventListener("scrollend", ensureCardsVisible);
      }

      // Cancel animation frame or timeout
      if (requestRef.current) {
        if (isMobile) {
          clearTimeout(requestRef.current as NodeJS.Timeout);
        } else {
          cancelAnimationFrame(requestRef.current as number);
        }
        requestRef.current = null;
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Clear the periodic check interval
      clearInterval(periodicCheckInterval);

      // Reset animation active flag
      isAnimationActiveRef.current = false;

      // Kill all GSAP animations to prevent memory leaks
      gsap.killTweensOf(".hero-title-line");
      gsap.killTweensOf(".bottom-text-container");
      gsap.killTweensOf(".grid-cell-colored");
      gsap.killTweensOf(".floating-item");
    };
  }, [
    handleResizeDebounce,
    handleMouseMoveDebounce,
    animateParallaxDebounce,
    initAnimations,
    animationsComplete,
    ensureCardsVisible,
    isMobile,
    layoutInitialized,
    handleVisibilityChange,
  ]);

  // Create grid cells
  const renderGridCells = () => {
    // Create a 16x16 grid with colored cells in specific positions
    const cells = [];

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

          cells.push(
            <div
              key={`cell-${row}-${col}`}
              className={`grid-cell grid-cell-colored ${cellClass}`}
            ></div>
          );
        } else {
          // Add regular grid cell
          cells.push(
            <div key={`cell-${row}-${col}`} className="grid-cell"></div>
          );
        }
      }
    }

    return cells;
  };

  // Create background grid lines
  const renderBackgroundLines = () => {
    const lines = [];
    // Horizontal lines - updated to 8 lines
    for (let i = 1; i <= 8; i++) {
      lines.push(
        <div
          key={`h-line-${i}`}
          className={`horizontal-line horizontal-line-${i}`}
        ></div>
      );
    }
    // Vertical lines - updated to 8 lines
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
    <section className="hero" ref={heroRef}>
      <div className="hero-bg-gradient"></div>
      <div className="hero-grid">{renderGridCells()}</div>
      <div className="hero-bg-lines">{renderBackgroundLines()}</div>

      <div className="container">
        <div className="hero-content flex flex-wrap self-center mx-auto">
          <h1 ref={titleRef}>
            <span className="hero-title-line lg:text-[110px] text-[80px] lg:mt-0 mt-10">
              Build & Scale
            </span>
            <span className="hero-title-line lg:text-[110px] text-[80px]">
              with AI-Powered
            </span>
            <span className="hero-title-line lg:text-[110px] text-[80px]">
              Product Development
            </span>
          </h1>

          <div className="floating-items" ref={floatingItemsRef} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
