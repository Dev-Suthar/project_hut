import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CTA from "./components/cta-section";
import { PROJECTS } from "const/projects";
import ProjectItem from "./components/ProjectItem";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Portfolio: React.FC = () => {
  const navigate = useNavigate();

  // Refs for heading animation
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);
  const workTogetherSectionRef = useRef<HTMLDivElement | null>(null);

  // Set up the escape key handler to return to main page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  // Animation for heading on page load
  useEffect(() => {
    const selectedHeading = selectedRef.current;
    const projectsHeading = projectsRef.current;

    if (!selectedHeading || !projectsHeading) return;

    gsap.set([selectedHeading, projectsHeading], { autoAlpha: 0 });
    gsap.set(selectedHeading, { y: 50 });
    gsap.set(projectsHeading, { y: -50 });

    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(selectedHeading, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }).to(
      projectsHeading,
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      "+=0"
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Animation for "Let's Work Together" section
  useEffect(() => {
    const workTogetherSection = workTogetherSectionRef.current;

    if (!workTogetherSection) return;

    gsap.set(workTogetherSection, { autoAlpha: 0, y: 50 });

    const scrollTrigger = ScrollTrigger.create({
      trigger: workTogetherSection,
      start: "top bottom-=100",
      end: "top center",
      scrub: 0.5,
      onEnter: () => {
        gsap.to(workTogetherSection, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      <main className="pt-40">
        <div className="mb-20 flex justify-center w-full">
          <h1 className="flex flex-col items-center text-center relative w-full max-w-[1200px] mx-auto">
            <div
              ref={selectedRef}
              className="font-normal tracking-tight leading-[0.9] mb-2 text-center w-full font-serif text-black"
              style={{
                fontFamily: "NyghtSerif-Regular",
                fontSize: "clamp(3rem, 10vw, 10rem)",
              }}
            >
              SELECTED
            </div>

            <div
              ref={projectsRef}
              className="font-black tracking-tight leading-[0.9] mt-2 text-center w-full font-sans text-black"
              style={{
                fontFamily: "Aspekta-1000",
                fontSize: "clamp(3rem, 10vw, 10rem)",
              }}
            >
              PROJECTS
            </div>
          </h1>
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          {PROJECTS.map((book, index) => (
            <React.Fragment key={index}>
              <div className="h-[15vh]"></div>
              <ProjectItem
                imageUrl={book.imageUrl}
                title={book.title}
                index={index}
              />
              <div className="h-[15vh]"></div>
            </React.Fragment>
          ))}
          <CTA />
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
