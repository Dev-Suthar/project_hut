import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './FAQSection.css';

// Declare the faqResizeTimeout property on the Window interface
declare global {
  interface Window {
    faqResizeTimeout: NodeJS.Timeout | null;
  }
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Force GSAP to refresh on window resize to handle animation issues
window.addEventListener('resize', () => {
  // Use debounced refresh for better performance
  if (window.faqResizeTimeout) {
    clearTimeout(window.faqResizeTimeout);
  }
  window.faqResizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [expandedHeight, setExpandedHeight] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faqContainerRef = useRef<HTMLDivElement>(null);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const footerSpacerRef = useRef<HTMLDivElement | null>(null);
  const scrollThrottleRef = useRef<number | null>(null);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);

    // Force GSAP to register and initialize
    if (typeof window !== 'undefined') {
      // Re-register plugins to ensure they're available
      gsap.registerPlugin(ScrollTrigger);

      // Force a refresh of ScrollTrigger with a slight delay to ensure DOM is ready
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 300);

      // Add a scroll event listener with improved throttling
      const handleScroll = () => {
        if (scrollThrottleRef.current) return;

        scrollThrottleRef.current = requestAnimationFrame(() => {
          // Check if animations need to be refreshed
          if (!animationTimelineRef.current) {
            ScrollTrigger.refresh(true);
          }
          scrollThrottleRef.current = null;
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      // Clean up
      return () => {
        clearTimeout(refreshTimer);
        window.removeEventListener('scroll', handleScroll);
        if (scrollThrottleRef.current) {
          cancelAnimationFrame(scrollThrottleRef.current);
        }
        setIsMounted(false);
      };
    }

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Initialize GSAP context
  useLayoutEffect(() => {
    if (!isMounted) return;

    // Create a context so we can kill all GSAP animations for this component
    const ctx = gsap.context(() => {}, sectionRef);

    // Clean up the context when component unmounts
    return () => {
      if (ctx.revert) {
        ctx.revert();
      }
    };
  }, [isMounted]);

  // Create a footer spacer element when component mounts
  useEffect(() => {
    if (!isMounted) return;

    // Create footer spacer if it doesn't exist
    if (!document.getElementById('footer-spacer')) {
      const spacer = document.createElement('div');
      spacer.id = 'footer-spacer';
      spacer.style.height = '20px'; // Set initial height to ensure spacing (reduced from 60px to 20px)
      spacer.style.transition = 'height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'; // Improved easing
      spacer.style.width = '100%';
      spacer.style.display = 'block';
      spacer.style.position = 'relative';
      spacer.style.zIndex = '1';

      // Insert before the footer or at the end of the body if footer not found
      const footer = document.querySelector('.ModernFooter') || document.querySelector('footer');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(spacer, footer);
        footerSpacerRef.current = spacer;
      } else {
        // Fallback: append to the end of the body or after the FAQ section
        const faqSection = document.querySelector('.faq-section');
        if (faqSection && faqSection.parentNode) {
          faqSection.parentNode.insertBefore(spacer, faqSection.nextSibling);
        } else {
          document.body.appendChild(spacer);
        }
        footerSpacerRef.current = spacer;
      }
    } else {
      footerSpacerRef.current = document.getElementById('footer-spacer') as HTMLDivElement;
      footerSpacerRef.current.style.height = '20px'; // Ensure minimum height (reduced from 60px to 20px)
    }

    return () => {
      // Remove the spacer when component unmounts
      if (footerSpacerRef.current && footerSpacerRef.current.parentNode) {
        footerSpacerRef.current.parentNode.removeChild(footerSpacerRef.current);
      }
    };
  }, [isMounted]);

  // Update footer spacer height when expandedHeight changes with smooth transition
  useEffect(() => {
    if (footerSpacerRef.current) {
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        // Ensure minimum height of 20px (reduced from 60px to 20px)
        footerSpacerRef.current!.style.height = `${Math.max(20, expandedHeight)}px`;
      });
    }
  }, [expandedHeight]);

  // Toggle FAQ dropdown with improved animations
  const toggleFAQ = (index: number) => {
    // Safety check for valid index and faqRefs
    if (index === undefined || !faqRefs.current || index >= faqRefs.current.length || !faqRefs.current[index]) {
      return;
    }

    const BASE_HEIGHT = 85; // Base height for closed FAQ items

    if (activeIndex === index) {
      // Close the currently open FAQ
      const faqDropdown = faqRefs.current[index];
      if (!faqDropdown) return;

      // Remove active class
      faqDropdown.classList.remove('active');

      // Apply hardware acceleration
      faqDropdown.style.transform = 'translateZ(0)';
      faqDropdown.style.height = `${BASE_HEIGHT}px`;

      const plusText = faqDropdown.querySelector('.plus-text');
      const dropdownList = faqDropdown.querySelector('.faq-dropdown-list');

      // Move the FAQS title back to its original position with improved animation
      if (titleRef.current) {
        const stickyBlock = titleRef.current.closest('.sticky-block') as HTMLElement;
        if (stickyBlock) {
          gsap.to(stickyBlock, {
            y: 0,
            duration: 0.3,
            ease: 'power3.out',
            force3D: true // Enable hardware acceleration
          });
        }
      }

      if (plusText) {
        gsap.to(plusText, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });
      }

      if (dropdownList) {
        gsap.to(dropdownList, {
          opacity: 0,
          height: 0,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true,
          onComplete: () => {
            // Ensure dropdown list is visible in the DOM but with height 0
            (dropdownList as HTMLElement).style.display = 'block';

            // Reset expanded height to minimum (60px)
            setExpandedHeight(60);

            // Reset z-index
            if (sectionRef.current) {
              sectionRef.current.style.zIndex = '1';
            }
          }
        });
      }

      setActiveIndex(null);
    } else {
      // Close previously open FAQ if any
      if (activeIndex !== null && faqRefs.current[activeIndex]) {
        const prevFaqDropdown = faqRefs.current[activeIndex];
        if (prevFaqDropdown) {
          // Remove active class from previous dropdown
          prevFaqDropdown.classList.remove('active');

          // Apply hardware acceleration
          prevFaqDropdown.style.transform = 'translateZ(0)';
          prevFaqDropdown.style.height = `${BASE_HEIGHT}px`;

          const prevPlusText = prevFaqDropdown.querySelector('.plus-text');
          const prevDropdownList = prevFaqDropdown.querySelector('.faq-dropdown-list');

          if (prevPlusText) {
            gsap.to(prevPlusText, {
              rotation: 0,
              duration: 0.3,
              ease: 'power2.out',
              force3D: true
            });
          }

          if (prevDropdownList) {
            gsap.to(prevDropdownList, {
              opacity: 0,
              height: 0,
              duration: 0.3,
              ease: 'power2.out',
              force3D: true,
              onComplete: () => {
                // Ensure dropdown list is visible in the DOM but with height 0
                (prevDropdownList as HTMLElement).style.display = 'block';
              }
            });
          }
        }
      }

      // Open the clicked FAQ
      const faqDropdown = faqRefs.current[index];
      if (!faqDropdown) return;

      // Add active class
      faqDropdown.classList.add('active');

      // Apply hardware acceleration
      faqDropdown.style.transform = 'translateZ(0)';

      const dropdownList = faqDropdown.querySelector('.faq-dropdown-list');
      if (!dropdownList) {
        return;
      }

      // Ensure the dropdown list is displayed before measuring its height
      (dropdownList as HTMLElement).style.display = 'block';

      const contentHeight = dropdownList.scrollHeight;

      // Use GSAP for smoother height animation
      gsap.to(faqDropdown, {
        height: BASE_HEIGHT + contentHeight,
        duration: 0.3,
        ease: 'power2.out',
        force3D: true
      });

      const plusText = faqDropdown.querySelector('.plus-text');

      if (plusText) {
        gsap.to(plusText, {
          rotation: 45, // Rotate 45 degrees to make a "×" symbol
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });
      }

      // Calculate the position to move the FAQS title to (level of the last FAQ question, not below it)
      if (titleRef.current && faqContainerRef.current) {
        // Get the sticky block element (parent of the title)
        const stickyBlock = titleRef.current.closest('.sticky-block');

        if (stickyBlock && faqRefs.current.length > 0) {
          // Get the last FAQ item (not the expanded one, but the last one in the list)
          const lastFaqItem = faqRefs.current[faqRefs.current.length - 1];

          if (lastFaqItem) {
            // Calculate the distance to move the sticky block
            const lastFaqRect = lastFaqItem.getBoundingClientRect();
            const stickyBlockRect = stickyBlock.getBoundingClientRect();
            
            // Calculate the y-position of the top of the last FAQ question
            // This ensures the heading stops at the level of the last question, not below it
            const lastFaqTop = lastFaqRect.top;
            const stickyBlockTop = stickyBlockRect.top;
            
            // Get the height of the sticky block (containing both heading and description)
            const stickyBlockHeight = stickyBlockRect.height;
            
            // Calculate moveDistance to position the block a bit higher, considering the heading and description height
            // The "-100" value makes it stop higher above the last FAQ
            const moveDistance = Math.max(0, lastFaqTop - stickyBlockTop - 100);
            
            // Limit the maximum movement based on viewport height
            const viewportHeight = window.innerHeight;
            const maxMoveDistance = viewportHeight * 0.25; // Limit to 25% of viewport height
            
            const finalMoveDistance = Math.min(moveDistance, maxMoveDistance);

            // Move the sticky block to the top of the last question with improved animation
            gsap.to(stickyBlock, {
              y: finalMoveDistance,
              duration: 0.3,
              ease: 'power3.out',
              force3D: true // Enable hardware acceleration
            });
          }
        }
      }

      gsap.to(dropdownList, {
        opacity: 1,
        height: contentHeight,
        duration: 0.3,
        ease: 'power2.out',
        force3D: true,
        onComplete: () => {
          // Calculate the space needed based on the content height and position
          const faqRect = faqDropdown.getBoundingClientRect();
          const sectionRect = sectionRef.current!.getBoundingClientRect();

          // Adjust spacing based on viewport height for better responsiveness
          const viewportHeight = window.innerHeight;
          const bottomSpaceRatio = viewportHeight < 768 ? 0.15 : 0.2; // Less space on smaller screens

          const bottomSpace = faqRect.bottom - sectionRect.bottom + contentHeight + (viewportHeight * bottomSpaceRatio);

          // Set expanded height to push down the footer (minimum 60px)
          setExpandedHeight(Math.max(60, bottomSpace));

          // Increase z-index of FAQ section to ensure it's above other content
          if (sectionRef.current) {
            sectionRef.current.style.zIndex = '10';
          }

          // Scroll to show the expanded content if it's out of view
          // Only for lower items that might be out of view
          if (index >= 3 || faqRect.bottom > viewportHeight) {
            // Calculate scroll position based on viewport size
            const scrollPadding = viewportHeight < 768 ? 50 : 70;

            // Use smoother scrolling with GSAP
            gsap.to(window, {
              scrollTo: {
                y: window.scrollY + (faqRect.bottom - viewportHeight + scrollPadding),
                autoKill: true
              },
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        }
      });

      setActiveIndex(index);
    }
  };

  // Setup the scroll animation with improved performance
  useEffect(() => {
    if (!isMounted) return;

    // Force ScrollTrigger to refresh after a short delay to ensure proper initialization
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);

    // Track animation instances for cleanup
    const animations = {
      scrollTrigger: null as ScrollTrigger | null,
      titleTimeline: null as gsap.core.Timeline | null,
      textTimeline: null as gsap.core.Timeline | null
    };

    // Function to adjust plus sign positioning based on screen size
    const adjustPlusSignPositioning = () => {
      const faqItems = document.querySelectorAll('.faq-dropdown-toggle');
      faqItems.forEach(item => {
        const plusSign = item.querySelector('.plus-text');
        if (plusSign) {
          const screenWidth = window.innerWidth;
          if (screenWidth <= 479) {
            (plusSign as HTMLElement).style.right = '15px';
            (plusSign as HTMLElement).style.fontSize = '26px';
          } else if (screenWidth <= 767) {
            (plusSign as HTMLElement).style.right = '18px';
            (plusSign as HTMLElement).style.fontSize = '28px';
          } else {
            (plusSign as HTMLElement).style.right = '20px';
            (plusSign as HTMLElement).style.fontSize = '32px';
          }
        }
      });
    };

    // Run initially
    adjustPlusSignPositioning();

    // Function to safely access refs with improved animations
    const setupTextAnimation = () => {
      // Only proceed if component is mounted and all necessary refs are available
      if (!isMounted || !titleRef.current || !textRef.current) {
        return;
      }

      // Clear any existing animations first
      gsap.killTweensOf(titleRef.current);
      gsap.killTweensOf(textRef.current);

      // Create a timeline for the title animation
      const titleTimeline = gsap.timeline({
        paused: true,
        defaults: { 
          force3D: true, // Enable hardware acceleration
          ease: "power2.out"
        }
      });
      animations.titleTimeline = titleTimeline;

      // Add the horizontal animation (left to right)
      titleTimeline.fromTo(titleRef.current, 
        { 
          x: '-100%', 
          opacity: 0,
          y: 0
        }, 
        {
          x: '0%',
          opacity: 1,
          duration: 0.5, // Faster horizontal movement
          ease: "power1.out" // Smoother easing for horizontal movement
        },
        0 // Start at the beginning
      );

      // Add the vertical animation (top to bottom) - adjusted to move less
      titleTimeline.to(titleRef.current, {
        y: (_, target) => {
          // Calculate dynamic distance based on viewport size - reduced to stop at question level
          const viewportWidth = window.innerWidth;
          // Return smaller vertical movement values - significantly reduced
          return viewportWidth < 768 ? 50 : viewportWidth < 1024 ? 60 : 70;
        },
        duration: 0.5, // Faster vertical movement
        ease: "power1.inOut" // Smoother easing for vertical movement
      }, 
      0.4 // Start slightly before the horizontal animation completes
      );

      // Create a timeline for the text animation
      const textTimeline = gsap.timeline({
        paused: true,
        defaults: { 
          force3D: true, // Enable hardware acceleration
          ease: "power2.out"
        }
      });
      animations.textTimeline = textTimeline;

      // Add the vertical animation for text (bottom to top, then top to bottom)
      textTimeline.fromTo(textRef.current,
        {
          y: '30px',
          opacity: 0
        },
        {
          y: '0px',
          opacity: 1,
          duration: 0.5, // Faster initial appearance
          ease: "power1.out" // Smoother easing
        },
        0.2 // Start after title begins to appear
      );

      // Add the vertical animation (top to bottom) - adjusted to move less
      textTimeline.to(textRef.current, {
        y: (_, target) => {
          // Calculate dynamic distance based on viewport size - reduced to stop at question level
          const viewportWidth = window.innerWidth;
          // Return smaller vertical movement values - significantly reduced
          return viewportWidth < 768 ? 40 : viewportWidth < 1024 ? 50 : 60;
        },
        duration: 0.5, // Faster vertical movement
        ease: "power1.inOut" // Smoother easing
      }, 
      0.5 // Start after initial appearance completes
      );

      // Create a ScrollTrigger that controls both animations
      const scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%", // Start even earlier for smoother entry
        end: "center 40%", // End higher in the viewport for less movement
        scrub: 0.5, // Smoother scrubbing with less delay
        markers: false,
        onUpdate: (self) => {
          // Calculate progress for both timelines
          const progress = self.progress;
          
          // Limit progress to prevent text from moving too far down
          const limitedProgress = Math.min(progress, 0.6);

          // Update both timelines based on scroll progress with a limit
          titleTimeline.progress(limitedProgress);
          textTimeline.progress(limitedProgress);
        },
        onEnter: () => {
          // Make elements visible when entering
          gsap.set([titleRef.current, textRef.current], { visibility: 'visible' });
        },
        onLeaveBack: (self) => {
          // Reset to initial state when scrolling all the way back up
          if (self.progress === 0) {
            gsap.set(titleRef.current, { x: '-100%', y: 0, opacity: 0 });
            gsap.set(textRef.current, { y: '30px', opacity: 0 });
          }
        }
      });
      animations.scrollTrigger = scrollTrigger;

      // Set initial states with hardware acceleration
      gsap.set(titleRef.current, { 
        x: '-100%', 
        y: 0,
        opacity: 0, 
        visibility: 'visible',
        force3D: true // Enable hardware acceleration
      });

      gsap.set(textRef.current, { 
        y: '30px', 
        opacity: 0, 
        visibility: 'visible',
        force3D: true // Enable hardware acceleration
      });
    };

    // Setup the animation for FAQ items with improved performance
    const setupFAQAnimation = () => {
      if (!isMounted || !faqContainerRef.current) {
        return;
      }

      const faqItems = faqContainerRef.current.querySelectorAll('.faq-dropdown');
      if (!faqItems || faqItems.length === 0) {
        return;
      }

      // Set all FAQ items to be fully visible with hardware acceleration
      gsap.set(faqItems, { 
        y: '0px', 
        opacity: 1,
        force3D: true // Enable hardware acceleration
      });

      gsap.set(faqContainerRef.current, { 
        y: '0px',
        force3D: true // Enable hardware acceleration
      });

      // Remove any existing animations
      gsap.killTweensOf(faqContainerRef.current);
      faqItems.forEach(item => {
        gsap.killTweensOf(item);
      });

      // Remove any scroll-based animations
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === faqContainerRef.current || 
            (trigger.vars as any).animation && (trigger.vars as any).animation.targets && 
            (trigger.vars as any).animation.targets.includes(faqContainerRef.current)) {
          trigger.kill();
        }
      });
    };

    // Setup both animations
    setupTextAnimation();
    setupFAQAnimation();

    // Handle window resize to update animations
    const handleResize = () => {
      // Kill existing animations
      if (animations.scrollTrigger) {
        animations.scrollTrigger.kill();
      }

      // Re-setup animations with new viewport dimensions
      setupTextAnimation();

      // Adjust plus sign positioning
      adjustPlusSignPositioning();

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    };

    // Add debounced resize listener
    let resizeTimeout: NodeJS.Timeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 200);
    });

    // Clean up function
    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(resizeTimeout);

      // Kill any ScrollTriggers for this section
      if (animations.scrollTrigger) {
        animations.scrollTrigger.kill();
      }

      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current || 
            trigger.vars.trigger === faqContainerRef.current) {
          trigger.kill();
        }
      });

      // Clear all GSAP animations
      if (animations.titleTimeline) {
        animations.titleTimeline.kill();
      }

      if (animations.textTimeline) {
        animations.textTimeline.kill();
      }

      gsap.killTweensOf(titleRef.current);
      gsap.killTweensOf(textRef.current);
      gsap.killTweensOf(faqContainerRef.current);
      if (faqContainerRef.current) {
        const faqItems = faqContainerRef.current.querySelectorAll('.faq-dropdown');
        if (faqItems && faqItems.length) {
          gsap.killTweensOf(faqItems);
        }
      }

      // Remove the footer spacer
      if (footerSpacerRef.current && footerSpacerRef.current.parentNode) {
        footerSpacerRef.current.parentNode.removeChild(footerSpacerRef.current);
      }

      // Clear any pending animation frames
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current);
      }

      // Remove event listener
      window.removeEventListener('resize', handleResize);
    };
  }, [isMounted]);

  // Initialize refs array when component mounts with improved performance
  useEffect(() => {
    faqRefs.current = faqRefs.current.slice(0, faqItems.length);

    // Initialize FAQ items when component mounts
    if (isMounted && faqContainerRef.current) {
      const faqDropdowns = faqContainerRef.current.querySelectorAll('.faq-dropdown');
      faqDropdowns.forEach((dropdown, index) => {
        // Set initial height
        (dropdown as HTMLElement).style.height = '85px';

        // Apply hardware acceleration
        (dropdown as HTMLElement).style.transform = 'translateZ(0)';

        // Ensure dropdown list is properly initialized
        const dropdownList = dropdown.querySelector('.faq-dropdown-list');
        if (dropdownList) {
          (dropdownList as HTMLElement).style.display = 'block';
          (dropdownList as HTMLElement).style.height = '0';
          (dropdownList as HTMLElement).style.opacity = '0';
          (dropdownList as HTMLElement).style.transform = 'translateZ(0)'; // Hardware acceleration
        }
      });

      // Make sure the FAQ container and all items are fully visible immediately
      if (faqContainerRef.current) {
        faqContainerRef.current.style.opacity = '1';
        faqContainerRef.current.style.transform = 'translateZ(0)'; // Hardware acceleration
        faqContainerRef.current.style.visibility = 'visible';

        // Make all FAQ items fully visible with hardware acceleration
        const faqItems = faqContainerRef.current.querySelectorAll('.faq-dropdown');
        faqItems.forEach(item => {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'translateZ(0)'; // Hardware acceleration
          (item as HTMLElement).style.visibility = 'visible';
        });
      }
    }
  }, [isMounted]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Kill any lingering ScrollTriggers for this section
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars && st.vars.trigger === sectionRef.current) {
          st.kill();
        }
      });

      // Clear all GSAP animations related to this component
      gsap.killTweensOf(titleRef.current);
      gsap.killTweensOf(textRef.current);
      if (faqContainerRef.current) {
        const faqItems = faqContainerRef.current.querySelectorAll('.faq-dropdown');
        if (faqItems && faqItems.length) {
          gsap.killTweensOf(faqItems);
        }
      }

      // Remove the footer spacer
      if (footerSpacerRef.current && footerSpacerRef.current.parentNode) {
        footerSpacerRef.current.parentNode.removeChild(footerSpacerRef.current);
      }

      // Clear any pending animation frames
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current);
      }
    };
  }, []);

  // Initialize animations for grid cells
  useEffect(() => {
    if (!isMounted || !sectionRef.current) return;

    // Add fully-visible class to make grid cells visible immediately
    sectionRef.current.classList.add('fully-visible');

    // Set initial states for grid cells with higher opacity
    gsap.set('.faq-grid-cell-colored', { opacity: 1, scale: 1, visibility: 'visible' });
    gsap.set('.faq-grid', { opacity: 0.8, visibility: 'visible' });

    // Create a timeline for grid cell animations
    const gridTimeline = gsap.timeline();

    // Animate grid cells with staggered appearance
    gridTimeline.to('.faq-grid-cell-colored', {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power2.out',
      force3D: true
    });

  }, [isMounted]);

  // Create grid cells - Added function to render grid cells programmatically
  const renderGridCells = () => {
    // Create a 16x16 grid with colored cells in specific positions
    const cells = [];

    // Add all regular cells and colored cells
    for (let row = 1; row <= 16; row++) {
      for (let col = 1; col <= 16; col++) {
        // Check if this position should have a colored cell
        const isColored = 
          // L-pattern bottom left
          (row === 13 && col === 2) || 
          (row === 13 && col === 3) || 
          (row === 14 && col === 2) ||

          // L-pattern bottom right
          (row === 13 && col === 14) || 
          (row === 13 && col === 15) ||
          (row === 14 && col === 15) ||

          // L-pattern middle bottom
          (row === 12 && col === 8) ||
          (row === 13 && col === 8) ||
          (row === 13 && col === 9) ||

          // Additional L-patterns
          (row === 11 && col === 5) ||
          (row === 12 && col === 5) ||
          (row === 12 && col === 6) ||

          (row === 14 && col === 11) ||
          (row === 14 && col === 12) ||
          (row === 13 && col === 11);

        if (isColored) {
          // Add colored cell with appropriate class
          let cellClass = "";

          if (row === 13 && col === 2) cellClass = "faq-grid-cell-1";
          else if (row === 13 && col === 3) cellClass = "faq-grid-cell-2";
          else if (row === 14 && col === 2) cellClass = "faq-grid-cell-3";
          else if (row === 13 && col === 14) cellClass = "faq-grid-cell-4";
          else if (row === 13 && col === 15) cellClass = "faq-grid-cell-5";
          else if (row === 14 && col === 15) cellClass = "faq-grid-cell-6";
          else if (row === 12 && col === 8) cellClass = "faq-grid-cell-7";
          else if (row === 13 && col === 8) cellClass = "faq-grid-cell-8";
          else if (row === 13 && col === 9) cellClass = "faq-grid-cell-9";
          else if (row === 11 && col === 5) cellClass = "faq-grid-cell-10";
          else if (row === 12 && col === 5) cellClass = "faq-grid-cell-11";
          else if (row === 12 && col === 6) cellClass = "faq-grid-cell-12";
          else if (row === 14 && col === 11) cellClass = "faq-grid-cell-13";
          else if (row === 14 && col === 12) cellClass = "faq-grid-cell-14";
          else if (row === 13 && col === 11) cellClass = "faq-grid-cell-15";

          cells.push(
            <div 
              key={`cell-${row}-${col}`} 
              className={`faq-grid-cell faq-grid-cell-colored ${cellClass}`}
              style={{ opacity: 1 }} // Force opacity
            ></div>
          );
        } else {
          // Add regular grid cell but make it invisible (opacity: 0)
          cells.push(
            <div 
              key={`cell-${row}-${col}`} 
              className="faq-grid-cell"
              style={{ opacity: 0, visibility: 'hidden' }} // Hide uncolored cells
            ></div>
          );
        }
      }
    }

    return cells;
  };

  const faqItems: FAQItem[] = [
    {
      question: "Can i use this to create and sell a product?",
      answer: "Absolutely! Our solution is specifically designed for commercial applications. The Standard and Professional licenses include unlimited commercial use rights, allowing you to implement our technology across multiple client projects without additional fees. Many agencies and freelancers use our platform to enhance their service offerings and deliver exceptional results to their clients. We even offer a white-label option that lets you rebrand our solution under your company name. For enterprise-level implementations, our dedicated account managers can help structure custom licensing agreements tailored to your specific business needs."
    },
    {
      question: "How quickly can i expect to see improvement?",
      answer: "Results vary depending on your specific operations, but many of our clients notice measurable improvements within the first 2-4 weeks of implementation. You'll likely see immediate benefits in workflow organization, followed by progressive efficiency gains of 15-30% over the first quarter. Our dedicated implementation team works closely with you throughout the onboarding process, providing weekly progress reports and making real-time adjustments to optimize performance. We also offer a 30-day performance guarantee, ensuring you'll see tangible results within the first month."
    },
    {
      question: "Do i need to know about how to code?",
      answer: "While basic HTML/CSS and JavaScript knowledge is beneficial for advanced customizations, our platform is designed to be accessible to users with varying technical backgrounds. We provide three ways to implement solutions: (1) A no-code visual editor for those with no technical experience, (2) A low-code interface for those comfortable with basic web concepts, and (3) Advanced API access for developers who want complete control. Our comprehensive documentation includes step-by-step tutorials, video guides, and code snippets. Plus, our support team offers free implementation assistance for the first 60 days after purchase."
    },
    {
      question: "Can this solution help us meet sustainability goal",
      answer: "Absolutely! Our AI-driven solutions include comprehensive energy optimization features that typically reduce power consumption by 20-35% and minimize operational waste by up to 40%. We provide detailed sustainability metrics through our dashboard, allowing you to track your carbon footprint reduction in real-time. Many of our clients have used these metrics in their ESG reporting, and several have received industry recognition for their sustainability improvements. Additionally, our platform is carbon-neutral, as we offset all emissions associated with our cloud infrastructure through verified carbon credit programs."
    },
    {
      question: "Can i use this to create and sell a product?",
      answer: "Our licensing terms specifically prohibit reselling our core technology as a standalone product or incorporating it into a product where our technology constitutes the primary value proposition. However, we do offer Partnership Programs for businesses interested in integrating our solutions into their products. These programs include proper revenue-sharing models, technical support, and legal frameworks to ensure compliance. If you're interested in exploring partnership opportunities, please contact our business development team at partnerships@example.com to discuss your specific use case and explore potential collaboration options."
    }
  ];

  return (
    <section className="section overflow-visible faq-section fully-visible" ref={sectionRef}>
      <div className="faq-grid">
        {renderGridCells()}
      </div>

      <div className="w-layout-blockcontainer container w-container">
        <div className="sticky-content-wrap">
          <div className="sticky-content-left">
            <div className="sticky-block">
              <h2 
                className="animation-text" 
                ref={titleRef}
                style={{ transform: 'translateZ(0)' }}
              >FAQS</h2>
              <div 
                ref={textRef}
                className="faq-description"
                style={{ 
                  display: 'block',
                  textAlign: 'left',
                  width: '100%',
                  lineHeight: '1.5'
                }}
              >
                Lorem ipsum is placeholder text<br/>
                commonly used in design.
              </div>
            </div>
          </div>
          <div className="sticky-content-right" ref={faqContainerRef} style={{ transform: 'translateZ(0)' }}>
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="faq-dropdown w-dropdown"
                style={{ 
                  height: '85px',
                  transform: 'translateZ(0)' // Add hardware acceleration
                }}
                ref={el => {
                  // Safely assign refs
                  if (el && faqRefs.current) {
                    faqRefs.current[index] = el;
                  }
                }}
              >
                <div 
                  className="faq-dropdown-toggle w-dropdown-toggle"
                  onClick={() => isMounted && toggleFAQ(index)}
                  style={{ position: 'relative' }}
                >
                  <p className="accordion-p">{item.question}</p>
                  <div className="plus-text" style={{ 
                    position: 'absolute', 
                    right: '20px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    fontSize: '32px',
                    fontWeight: '300'
                  }}>+</div>
                </div>
                <nav className="faq-dropdown-list w-dropdown-list" 
                  style={{ 
                    display: 'block', 
                    height: '0', 
                    opacity: '0',
                    transform: 'translateZ(0)' // Add hardware acceleration
                  }}
                >
                  <p className="accordion-p for--dropdown">{item.answer}</p>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;