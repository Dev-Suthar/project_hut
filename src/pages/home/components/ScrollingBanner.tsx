import React, { useEffect, useRef } from 'react';
import './ScrollingBanner.css';
import gsap from 'gsap';

// Import logo URLs
const logo1Url = "https://s3-alpha-sig.figma.com/img/71ef/961e/9886958804a6172e47e54655e85ea467?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=E6sV9yqjXkV~s1wSi~wVVGOpy2lmaAgf2fRzdNU9gvXVHnffpc7WWvr2EOpdbKNdz8bfvNiPfC2g4yWGsekASF~-ddRBLDL1VGQM2bS86xhg-l6t8U2MXlwsrLQ5I-vtWKlPGZhBWloMVGytE0D1AmY9SQZ7wN66zIX~-ePZ7iKNTQvEMIqxipUTdudD3LQEot4wgz3Y1rqWEjqih6ZsmNM2eW0~JUFAzJ2Ss5SLht6NYhyUjW~LQhRYFmRKBoDsORzyhl2YdYik5i5SStDvg3mB3xESfLlNyR4YxibgXIzpiTSCDiD0Q02yn0ivE4QpMr4IGWfOFS2kJJ4SBYrSQQ__";
const logo2Url = "https://s3-alpha-sig.figma.com/img/c132/4f18/4032eb953c69f3e07d5006a641c31982?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NeLa24NtuTO-47ewsu3oLRgnYCF7Gk2Q0iZBastrvqPN-DVjHoihkYcSqcNGR5efeiPYZyipetE-mCmIATMWHFg6kBuV6BR0Ofvx4g7gP7oTT2zXbPxvfXNPbvxQgy2jk5rsI5VT1p-9r5DReHgDSEBfFXGsHRF7p8MvxtSo6pejoiiQ8Zojjke5~PJAg-Y3BM6Fk5LdmMddq4zdP7i0SAk4oo2fNij2SDo7yv-duUEKrzCkQKekG~UoPoh6bk30CshPrL9Teo9wa~jrVud5kBrverK5Sewl~ueyzdGNZPM-3FQQfAioWIBPie8KeknYdYGZmV59cFKOzeZEOM5iwA__";
const logo3Url = "https://s3-alpha-sig.figma.com/img/b85c/a01e/805e524b25eb775dc95e52313727be44?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=NKLaRWwr40LaY4QgVLiBeVOgBK3~ApHfoeg0EV5tr3VhQRwqgMUVVugD9RlXz5KuDtrKri21z2Wn~0v2DLHyF-dj5yomRqcHtGL4AWqF16GCOkPm37UobcyRNaB0uBwNoP345Nxe7MfW4ujdR4Kj2jMnudjCfD8zWflmswxWSXmIEikzl5cLcGEkR37Qx5nfJsfX2G2SmfoNt6xlWxTeIf8ztHqMgieaWPKn3va9rGk5hghOhDTkGzhvVkqa6jTLiJEkJB0pWPzdwoVZeFpTQp~9zblf-5w31gVFePrALmSfr2FqnahhMN1dtpg~VRbg48orkJKAS2uy4og5v88V6w__";
const logo4Url = "https://s3-alpha-sig.figma.com/img/ac55/a725/ec1db7e1f3209a1b459d7df999f8619a?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WQ2Li2R-URHzjbk-AEqkS36OwGOGdoY-1vOUTW7PRE5cKC3OIKgZ18ooLlDzSmpHNa-fhlJEArJs-hpOS8i6JYLiDwJh-lL4oYdmqzP0Tt5ZqZfBq0leb4BJJJKlVvneKBwN9ybWaJyBkWEyBf4dojwp7WSaa3Y8Av-urAMVHl3AnpbkpOyuqVgfNm0dSLNd7W5tJonRMWHE8LgJNOx9Zrqya6aZMmgPke4REN9iIyE3TKrOQCeGAEiSyhVxp~FZzObHyCIsavK4ZR7Hi0AHBj2v3pBgLH4DsIlPRZ3f0DE3kBsKfdaz83XODWn-ujkg8Ml041gv4Eyieb-y74YelQ__";

// Define logo data with proper sizing information
const logoData = [
  { url: logo1Url, alt: "Company Logo 1", className: "company-logo white-logo logo-size-1" },
  { url: logo2Url, alt: "Company Logo 2", className: "company-logo white-logo logo-size-2" },
  { url: logo3Url, alt: "Company Logo 3", className: "company-logo white-logo logo-size-3" },
  { url: logo4Url, alt: "Company Logo 4", className: "company-logo white-logo logo-size-4" }
];

const ScrollingBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const logoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bannerRef.current || !logoContainerRef.current) return;

    const logoContainer = logoContainerRef.current;

    // Wait for images to load before calculating container width
    const allImagesLoaded = () => {
      if (!logoContainer) return;

      const containerWidth = logoContainer.offsetWidth;

      // Clone the logo container for seamless scrolling
      const clonedContainer = logoContainer.cloneNode(true) as HTMLDivElement;

      // Add the clone to the banner
      if (bannerRef.current) {
        bannerRef.current.appendChild(clonedContainer);
      }

      // Set up the animation with optimized settings for smooth scrolling
      gsap.to([logoContainer, clonedContainer], {
        x: `-=${containerWidth}`,
        repeat: -1,
        duration: 30, // Adjust duration for desired speed
        ease: 'none', // Linear movement for seamless scrolling
        modifiers: {
          x: gsap.utils.unitize((x: number) => {
            // Reset position when a container has moved completely off-screen to the left
            const val = parseFloat(String(x)) % (containerWidth * 2);
            // If the container has moved off-screen to the left, move it to the right
            return val < -containerWidth ? val + (containerWidth * 2) : val;
          })
        }
      });
    };

    // Check if all images are loaded, otherwise wait for them
    const images = logoContainer.querySelectorAll('img');
    let loadedCount = 0;

    const checkAllImagesLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        allImagesLoaded();
      }
    };

    // Add load event listeners to all images
    images.forEach(img => {
      if (img.complete) {
        checkAllImagesLoaded();
      } else {
        img.addEventListener('load', checkAllImagesLoaded);
        // Also handle any error cases
        img.addEventListener('error', checkAllImagesLoaded);
      }
    });

    // If no images found or all already loaded, initialize animation
    if (images.length === 0 || loadedCount === images.length) {
      allImagesLoaded();
    }

    return () => {
      // Clean up animation and event listeners when component unmounts
      gsap.killTweensOf([logoContainer]);
      images.forEach(img => {
        img.removeEventListener('load', checkAllImagesLoaded);
        img.removeEventListener('error', checkAllImagesLoaded);
      });
    };
  }, []);

  return (
    <div className="scrolling-banner" ref={bannerRef}>
      <div className="scrolling-logos" ref={logoContainerRef}>
        {logoData.map((logo, index) => (
          <div
            key={index}
            className={`logo-wrapper ${logo.className.includes('logo-size-4') ? 'logo4-wrapper' : ''}`}
          >
            <img
              src={logo.url}
              alt={logo.alt}
              className={logo.className}
              loading="eager" // Ensure quick loading
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanner;