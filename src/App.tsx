import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import AppRouter from "./app-router/Router";
// Register the ScrollTrigger plugin globally
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Home page component to contain all main page content

const App: React.FC = () => {
  // State for modal visibility

  // Add effect to optimize scrolling performance
  useEffect(() => {
    // Ensure plugins are registered
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Configure GSAP for optimal performance
    gsap.config({
      nullTargetWarn: false,
      autoSleep: 60,
      force3D: true,
    });

    // Improve ticker performance
    gsap.ticker.lagSmoothing(0);

    // Set default ease for all animations
    gsap.defaults({
      ease: "power2.out",
      duration: 0.5,
      force3D: true,
    });

    // Configure ScrollTrigger defaults for better performance
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
    });

    // Use passive listeners by default for better performance
    // except for touch events that may need preventDefault
    const preventDefaultTouchMove = (e: TouchEvent) => {
      // Only prevent default for horizontal scrolling on body elements
      const target = e.target as HTMLElement;
      const isScrollableElement =
        target &&
        (target.scrollHeight > target.clientHeight ||
          target.classList.contains("services-detail-section") ||
          target.classList.contains("project-roadmap-section"));

      // Allow scrolling on elements that should scroll
      if (
        !isScrollableElement &&
        !target.closest('input, button, a, [role="button"], textarea')
      ) {
        e.preventDefault();
      }
    };

    // Listen for resize to refresh ScrollTrigger
    const handleResize = () => {
      // Debounce the refresh to prevent excessive updates
      if (window.innerWidth > 0) {
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 200);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("touchmove", preventDefaultTouchMove, {
      passive: false,
    });

    // Optimize initial ScrollTrigger refresh
    // Set a high-priority RAF callback to ensure ScrollTrigger is initialized early
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);

      // Second refresh after DOM is more stable
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 300);
    });

    // Third refresh after images and other resources are loaded
    window.addEventListener("load", () => {
      // Use requestIdleCallback if available for non-critical refreshes
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(() => {
          ScrollTrigger.refresh(true);
        });
      } else {
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 500);
      }
    });

    // Fix for mobile momentum scrolling - updated to prevent double scrollbars
    if ("ontouchstart" in window) {
      document.documentElement.style.height = "100%";
      document.body.style.height = "100%";
      document.body.style.position = "relative";
      document.body.style.overscrollBehavior = "none";
      // Add this to fix the double scrollbar issue
      document.documentElement.style.overflowY = "auto";
      document.documentElement.style.overflowX = "hidden";
    }

    // Handle visibility changes for better Scroll Trigger behavior
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 300);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("touchmove", preventDefaultTouchMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(rafId);

      // Kill all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <AppRouter />
    </div>
  );
};

export default App;
