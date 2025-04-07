import React, { useEffect, useRef, useState } from 'react';
import './GetInTouchSection.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactSection from './ContactSection';

gsap.registerPlugin(ScrollTrigger);

const GetInTouchSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const getInRef = useRef<HTMLSpanElement | null>(null);
  const touchRef = useRef<HTMLSpanElement | null>(null);
  const contactBtnRef = useRef<HTMLDivElement | null>(null);
  const imagesContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [imagesLoaded, setImagesLoaded] = useState<number>(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState<boolean>(false);
  const [showContact, setShowContact] = useState<boolean>(false);
  const totalImages = 8;
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const animationsRef = useRef<Array<gsap.core.Animation | ScrollTrigger | null>>([]);

  // Use placeholder images that are guaranteed to exist
  const imageUrls = [
    'https://s3-alpha-sig.figma.com/img/fd0e/9b8a/b0fba156b0882b20af4c7b6258ce77ee?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=P6W8E9eVwPOmcr6P9fGufDcEsgaRAyxo8tpz9owcYPeZXWZPVQ80rtV0N3bxd~1Ykl6O1Rh~bvRrtpH7mF3YqwT7aBNIjo7r~LBduyx8TgaLNn-OznZSMUD~CqziACO2qwDloXNSCk9WETgSJ3LB8WIBBri5Pxdk0pMd0ORMXvUJBpzYOQr~Q2-aV9eMQKRW3NuXN8R-dgDE~Tdig4krQhfTK8tJajOfn33B~VzT7ReMPVgKpJKglgLHbTMiF83IOL8kS6LautziGNyjB03JFabGPvRcTcUEAbUsKTXGr0nw~37HEObrZLg-ZuHmS0uAM6k-cghVA9RmXaeS-6ZbSA__',
    'https://s3-alpha-sig.figma.com/img/b778/eaba/9dcf89ae6f530a5704bd08b107e11bfe?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ALk7DjY-82B6g9thbk80-PBhQxz1NJjMPgtzFsSY2VkxhXtsTIw0hQbATGnSCbyvfttsXUj6bdfBTTRAkVHGzitGACxglh~8m59it~HLEhPlmQP6R5DTH8THY26zql1UoCRrlqUkRoZH3Da5aVThv1igcc0U11w9Fz26YktTntmcZDRnTGGdzDJodeJmEn6frC65YQi4nTUKZo3KFV0oO34EoBxkdcTzQu-l95b9oa7xg-8qgt1D8jL7QqpG8GoPyUWW3WCOzMMndWGbf8lLL8hBZ-TnH2OpI~eDZuxzy5FW4Uyn4BNMuAns8kg8sksyEmBODhzjd-~Jbcorj9iiiQ__',
    'https://s3-alpha-sig.figma.com/img/a702/b896/815025cda44c5b7602e0318439267ea1?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bi~Mc26g-xAq~CSkzL13wxuyys2bCX7jeuMIqOSmEzcletXHEGUZY~afrD2I6UlLqzItoaCBOM3eWiWRBAYxQjmt1J3Sq6HRZtgfN6brFWqk7bhFeRGt~sdbUSoOA6R0Z7FU6zqrzLl~uzpdJ09K7FZVFZ6wWL5Bz05XLG1bA6ZrjZWHjJOxXXvaNOUTO6iACUk7-1zvJy5L6ya8bTy4CQt~HboQDG2vEEiFYRlbHFo5psmBIDI7VBLL0VpJz2xG8d2809rl3aSnPWo41MjfIMVdJKr0xmOwJ3Lps4LhSbM2eM5Wn2stUglGlSss1ci~Tqx5loxFaY04xXE9rseQZw__',
    'https://s3-alpha-sig.figma.com/img/9ee3/934d/68ef39ebc8c8c0feb1bfa9356a189c32?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YbvYkc~1R0SdKXkn3cK8bxUeQjm2cLi0gR2KOyQVX-bZ5OECYkHsmiQdxzKZAxpeFb0~lw8hqCeKdlI6hleKrn1zWcNjqJkGs8MHP~Q8vccHXFFnXkoQBgRSb3gUa7FuG~7mFpt-fHMZjPrDavEiHHZfQeRrOSgnD4oXzgw2HoEIcl0d8a3HYzqegHoE8v~ywpB0kiLKP3Rk8FcjEx2viNeEheP6uHDS1fIxdak6uGvMfMHa-e~MNaaYqJBSujcSk8~JrpcV-IEx8jipSkNOrWaNFPjEbgqRInVCPyJQopv6Y4kJc0tlJLuRS5N4dIZEC~ATPIXOEIoonSfTc4PXrA__',
    'https://s3-alpha-sig.figma.com/img/fd0e/9b8a/b0fba156b0882b20af4c7b6258ce77ee?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=P6W8E9eVwPOmcr6P9fGufDcEsgaRAyxo8tpz9owcYPeZXWZPVQ80rtV0N3bxd~1Ykl6O1Rh~bvRrtpH7mF3YqwT7aBNIjo7r~LBduyx8TgaLNn-OznZSMUD~CqziACO2qwDloXNSCk9WETgSJ3LB8WIBBri5Pxdk0pMd0ORMXvUJBpzYOQr~Q2-aV9eMQKRW3NuXN8R-dgDE~Tdig4krQhfTK8tJajOfn33B~VzT7ReMPVgKpJKglgLHbTMiF83IOL8kS6LautziGNyjB03JFabGPvRcTcUEAbUsKTXGr0nw~37HEObrZLg-ZuHmS0uAM6k-cghVA9RmXaeS-6ZbSA__',
    'https://s3-alpha-sig.figma.com/img/b778/eaba/9dcf89ae6f530a5704bd08b107e11bfe?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ALk7DjY-82B6g9thbk80-PBhQxz1NJjMPgtzFsSY2VkxhXtsTIw0hQbATGnSCbyvfttsXUj6bdfBTTRAkVHGzitGACxglh~8m59it~HLEhPlmQP6R5DTH8THY26zql1UoCRrlqUkRoZH3Da5aVThv1igcc0U11w9Fz26YktTntmcZDRnTGGdzDJodeJmEn6frC65YQi4nTUKZo3KFV0oO34EoBxkdcTzQu-l95b9oa7xg-8qgt1D8jL7QqpG8GoPyUWW3WCOzMMndWGbf8lLL8hBZ-TnH2OpI~eDZuxzy5FW4Uyn4BNMuAns8kg8sksyEmBODhzjd-~Jbcorj9iiiQ__',
    'https://s3-alpha-sig.figma.com/img/a702/b896/815025cda44c5b7602e0318439267ea1?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bi~Mc26g-xAq~CSkzL13wxuyys2bCX7jeuMIqOSmEzcletXHEGUZY~afrD2I6UlLqzItoaCBOM3eWiWRBAYxQjmt1J3Sq6HRZtgfN6brFWqk7bhFeRGt~sdbUSoOA6R0Z7FU6zqrzLl~uzpdJ09K7FZVFZ6wWL5Bz05XLG1bA6ZrjZWHjJOxXXvaNOUTO6iACUk7-1zvJy5L6ya8bTy4CQt~HboQDG2vEEiFYRlbHFo5psmBIDI7VBLL0VpJz2xG8d2809rl3aSnPWo41MjfIMVdJKr0xmOwJ3Lps4LhSbM2eM5Wn2stUglGlSss1ci~Tqx5loxFaY04xXE9rseQZw__',
    'https://s3-alpha-sig.figma.com/img/9ee3/934d/68ef39ebc8c8c0feb1bfa9356a189c32?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=YbvYkc~1R0SdKXkn3cK8bxUeQjm2cLi0gR2KOyQVX-bZ5OECYkHsmiQdxzKZAxpeFb0~lw8hqCeKdlI6hleKrn1zWcNjqJkGs8MHP~Q8vccHXFFnXkoQBgRSb3gUa7FuG~7mFpt-fHMZjPrDavEiHHZfQeRrOSgnD4oXzgw2HoEIcl0d8a3HYzqegHoE8v~ywpB0kiLKP3Rk8FcjEx2viNeEheP6uHDS1fIxdak6uGvMfMHa-e~MNaaYqJBSujcSk8~JrpcV-IEx8jipSkNOrWaNFPjEbgqRInVCPyJQopv6Y4kJc0tlJLuRS5N4dIZEC~ATPIXOEIoonSfTc4PXrA__',
  ];

  // Handle image load events with improved error handling
  const handleImageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event> | null) => {
    // Add loaded class to the image for CSS transition
    if (e && e.target) {
      (e.target as HTMLImageElement).classList.add('loaded');
    }
    
    setImagesLoaded(prev => {
      const newCount = prev + 1;
      if (newCount >= totalImages) {
        setAllImagesLoaded(true);
        // Force a class update to ensure visibility
        if (sectionRef.current) {
          sectionRef.current.classList.add('images-loaded');
        }
      }
      return newCount;
    });
  };

  // Toggle contact section visibility
  const toggleContactSection = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContact(true);
  };

  // Handle close button click in Contact section
  const handleCloseContact = () => {
    setShowContact(false);
    
    // Set a small timeout to ensure DOM is updated before applying these changes
    setTimeout(() => {
      // Force images to be visible when returning to GetInTouchSection
      if (sectionRef.current) {
        sectionRef.current.classList.add('in-view');
        sectionRef.current.classList.add('images-loaded');
      }
      
      // Force visibility of all images
      imageRefs.current.forEach((img, index) => {
        if (img) {
          img.style.visibility = 'visible';
          if (index < 4) {
            // Foreground images
            img.style.opacity = '1';
            img.style.transform = 'translateY(0) scale(1)';
          } else {
            // Background images with blur
            img.style.opacity = '0.7';
            img.style.filter = 'blur(8px)';
            img.style.transform = 'translateY(0) scale(1)';
          }
          
          // Ensure the actual img elements are also marked as loaded
          const imgElement = img.querySelector('img');
          if (imgElement) {
            imgElement.classList.add('loaded');
          }
        }
      });
    }, 50);
  };

  // Preload images with error handling
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];
    
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => handleImageLoaded(null);
      img.onerror = () => handleImageLoaded(null); // Count error as loaded to prevent blocking
      preloadedImages.push(img);
    });
    
    // Set a fallback timer to ensure animations start even if images fail
    const fallbackTimer = setTimeout(() => {
      if (!allImagesLoaded) {
        setAllImagesLoaded(true);
        if (sectionRef.current) {
          sectionRef.current.classList.add('images-loaded');
        }
      }
    }, 3000);
    
    // Cleanup function
    return () => {
      clearTimeout(fallbackTimer);
      preloadedImages.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Cleanup function for animations
  const cleanupAnimations = () => {
    // Kill all animations to prevent memory leaks
    if (animationsRef.current.length) {
      animationsRef.current.forEach(animation => {
        if (animation && 'kill' in animation) {
          animation.kill();
        }
      });
      animationsRef.current = [];
    }
    
    // Kill ScrollTrigger instances
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }
  };

  // Set up animations with improved performance
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Clean up any existing animations first
    cleanupAnimations();

    // Create a timeline for better control and performance
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Add to animations ref for cleanup
        animationsRef.current.push(tl);
      }
    });

    // Create ScrollTrigger with optimized settings
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      markers: false,
      onEnter: () => {
        if (sectionRef.current) {
          // Add a class to optimize rendering
          sectionRef.current.classList.add('in-view');
          tl.play();
        }
      },
      onLeave: () => {
        // Don't remove the class to prevent flickering
      },
      onEnterBack: () => {
        if (sectionRef.current) {
          sectionRef.current.classList.add('in-view');
          tl.play();
        }
      },
      onLeaveBack: () => {
        if (sectionRef.current) {
          sectionRef.current.classList.remove('in-view');
          tl.reverse();
        }
      },
      // Add throttling to improve performance during fast scrolling
      onUpdate: self => {
        // Only update animations if scrolling is slow enough
        const velocity = Math.abs(self.getVelocity());
        if (velocity > 1000) {
          // Pause animations during very fast scrolling
          tl.timeScale(0);
        } else {
          // Resume animations with normal speed during slow or no scrolling
          tl.timeScale(1);
        }
      }
    });

    // Set initial states with hardware acceleration
    if (getInRef.current && touchRef.current) {
      gsap.set([getInRef.current, touchRef.current], {
        opacity: 0,
        y: 50,
        force3D: true
      });
    }

    if (contactBtnRef.current) {
      gsap.set(contactBtnRef.current, {
        opacity: 0,
        y: 30,
        force3D: true
      });
    }

    // Set initial states for all images with hardware acceleration
    imageRefs.current.forEach((img, index) => {
      if (!img) return;
      
      // Apply blur to background images (indices 4-7)
      if (index >= 4) {
        gsap.set(img, {
          opacity: 0,
          scale: 0.8,
          filter: "blur(8px)", // Add blur to background images
          force3D: true,
          willChange: "transform, opacity, filter"
        });
      } else {
        gsap.set(img, {
          opacity: 0,
          scale: 0.8,
          force3D: true,
          willChange: "transform, opacity"
        });
      }
    });

    // Add animations to timeline for better performance
    if (getInRef.current && touchRef.current && contactBtnRef.current) {
      tl.to(getInRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true
      })
      .to(touchRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true
      }, "-=0.6") // Slight overlap for smoother animation
      .to(contactBtnRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true
      }, "-=0.6");
    }

    // Animate images with staggered timing for better performance
    // Primary images first (front images)
    tl.to(imageRefs.current.slice(0, 4), {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      force3D: true
    }, "-=0.4")
    // Then shadow images (background images) with blur
    .to(imageRefs.current.slice(4), {
      opacity: 0.7, // More transparent for better visual effect with blur
      scale: 1,
      filter: "blur(8px)", // Apply blur effect to the background images
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      force3D: true
    }, "-=0.6");

    // Create floating animation for images with optimized performance
    if (allImagesLoaded) {
      // Use a single timeline for all floating animations to improve performance
      const floatTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        onComplete: () => {
          // Add to animations ref for cleanup
          animationsRef.current.push(floatTl);
        }
      });

      // Primary images - subtle floating with optimized transforms
      imageRefs.current.slice(0, 4).forEach((img, index) => {
        if (!img) return;
        
        // Use different values for each image to create natural movement
        const yOffset = -10 - (index % 2) * 2;
        const xOffset = index % 2 === 0 ? 5 : -5;
        const delay = index * 0.2;
        
        floatTl.to(img, {
          y: yOffset,
          x: xOffset,
          rotation: index % 2 === 0 ? 1 : -1, // Subtle rotation instead of 3D transforms
          duration: 3 + index * 0.2,
          ease: "sine.inOut",
          force3D: true
        }, delay);
      });

      // Shadow images - more subtle movement to prevent performance issues
      // and maintain blur effect
      imageRefs.current.slice(4).forEach((img, index) => {
        if (!img) return;
        
        const yOffset = -5 - (index % 2) * 2;
        const xOffset = index % 2 === 0 ? 3 : -3;
        const delay = 0.1 + index * 0.2;
        
        floatTl.to(img, {
          y: yOffset,
          x: xOffset,
          rotation: index % 2 === 0 ? 0.5 : -0.5, // Very subtle rotation
          filter: "blur(8px)", // Maintain blur during animation
          duration: 3.5 + index * 0.2,
          ease: "sine.inOut",
          force3D: true
        }, delay);
      });

      // Create a scroll-based modifier for the floating animation
      const floatScrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Adjust animation speed based on scroll position
          const scrollSpeed = Math.abs(self.getVelocity() / 1000);
          if (scrollSpeed > 0.1) {
            // Pause animations during fast scrolling to improve performance
            floatTl.timeScale(0);
          } else {
            // Resume animations with normal speed during slow or no scrolling
            floatTl.timeScale(1);
          }
        },
        onEnter: () => {
          floatTl.play();
        },
        onLeave: () => {
          floatTl.pause();
        },
        onEnterBack: () => {
          floatTl.play();
        },
        onLeaveBack: () => {
          floatTl.pause();
        }
      });
      
      // Add to animations ref for cleanup
      animationsRef.current.push(floatScrollTrigger);
    }

    // Play the timeline if section is already in view on load
    if (sectionRef.current.getBoundingClientRect().top < window.innerHeight) {
      tl.play();
      sectionRef.current.classList.add('in-view');
    }

    return () => {
      // Clean up all animations and ScrollTrigger instances
      cleanupAnimations();
    };
  }, [allImagesLoaded]);

  // Add intersection observer for better performance on mobile
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add class when section is visible
            if (sectionRef.current) {
              sectionRef.current.classList.add('in-view');
              sectionRef.current.classList.add('images-loaded');
            }
            
            // Force images to be visible when section is in view
            imageRefs.current.forEach((img, index) => {
              if (img) {
                img.style.visibility = 'visible';
                // Ensure image element is loaded
                const imgElement = img.querySelector('img');
                if (imgElement) {
                  imgElement.classList.add('loaded');
                }
                
                if (index < 4) {
                  // Foreground images
                  img.style.opacity = '1';
                  img.style.filter = 'none';
                  img.style.transform = 'translateY(0) scale(1)';
                } else {
                  // Background images with blur
                  img.style.opacity = '0.7';
                  img.style.filter = 'blur(8px)';
                  img.style.transform = 'translateY(0) scale(1)';
                }
              }
            });
          } else {
            // Remove class when section is not visible
            if (sectionRef.current) {
              sectionRef.current.classList.remove('in-view');
              // Don't remove the images-loaded class to prevent flicker
            }
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Ensure images are visible when toggling between sections
  useEffect(() => {
    if (!showContact && allImagesLoaded && sectionRef.current) {
      sectionRef.current.classList.add('in-view');
      sectionRef.current.classList.add('images-loaded');
      
      // Ensure all images are visible
      imageRefs.current.forEach((img, index) => {
        if (img) {
          img.style.visibility = 'visible';
          if (index < 4) {
            img.style.opacity = '1';
            img.style.transform = 'translateY(0) scale(1)';
          } else {
            img.style.opacity = '0.7';
            img.style.filter = 'blur(8px)';
            img.style.transform = 'translateY(0) scale(1)';
          }
        }
      });
    }
  }, [showContact, allImagesLoaded]);

  return (
    <>
      {!showContact ? (
        <div className={`get-in-touch-section ${allImagesLoaded ? 'images-loaded' : ''}`} ref={sectionRef}>
          <div className="get-in-touch-container">
            <div className="lets-talk">LET'S TALK</div>
            <h2 className="get-in-title">
              <span className="get-in" ref={getInRef}>GET IN</span>
              <span className="touch" ref={touchRef}>TOUCH</span>
            </h2>
            <div className="contact-button" ref={contactBtnRef}>
              <a href="#" onClick={toggleContactSection}>CONTACT US <span className="arrow">→</span></a>
            </div>
          </div>
          
          <div className="floating-images" ref={imagesContainerRef}>
            {/* Primary images */}
            <div className="image image-1" ref={el => imageRefs.current[0] = el}>
              <img 
                src={imageUrls[0]} 
                alt="Team collaboration" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
            <div className="image image-2" ref={el => imageRefs.current[1] = el}>
              <img 
                src={imageUrls[1]} 
                alt="Design process" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
            <div className="image image-3" ref={el => imageRefs.current[2] = el}>
              <img 
                src={imageUrls[2]} 
                alt="Development" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
            <div className="image image-4" ref={el => imageRefs.current[3] = el}>
              <img 
                src={imageUrls[3]} 
                alt="Client meeting" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
            
            {/* Shadow/blurred images */}
            <div className="image image-5 blurred-image" ref={el => imageRefs.current[4] = el}>
              <img 
                src={imageUrls[4]} 
                alt="Team collaboration shadow" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                style={{ filter: 'blur(8px)' }}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
            <div className="image image-6 blurred-image" ref={el => imageRefs.current[5] = el}>
              <img 
                src={imageUrls[5]} 
                alt="Design process shadow" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                style={{ filter: 'blur(8px)' }}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
            <div className="image image-7 blurred-image" ref={el => imageRefs.current[6] = el}>
              <img 
                src={imageUrls[6]} 
                alt="Development shadow" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                style={{ filter: 'blur(8px)' }}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
            <div className="image image-8 blurred-image" ref={el => imageRefs.current[7] = el}>
              <img 
                src={imageUrls[7]} 
                alt="Client meeting shadow" 
                loading="lazy"
                onLoad={handleImageLoaded}
                onError={() => handleImageLoaded(null)}
                style={{ filter: 'blur(8px)' }}
                className={allImagesLoaded ? 'loaded' : ''}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="contact-section-wrapper">
          <button className="contact-close-button" onClick={handleCloseContact}>×</button>
          <ContactSection />
        </div>
      )}
    </>
  );
};

export default GetInTouchSection;