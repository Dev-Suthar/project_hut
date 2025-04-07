const WhatAreWeLooking = () => (
  <section className="relative text-center py-12 px-4 overflow-hidden">
    {/* Background Video */}
    <div className="absolute inset-0 z-0 w-full h-[785px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-25"
      >
        <source
          src="https://s3-figma-videos-production-sig.figma.com/video/TEAM/1419960018577407510/c75e549cdd04b849ccbca112d2768d05cfa23d8f?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=F-~W50II96tVEye2xTEsdYpV9iOVDZhxbAUwnWBd3dHoWOxdTIQzdudnuPfa2NFphFNyOCmcyesKvOC2tFAo-F7NrFUNRVoWb9u5RtQ-XCYvqNag1cuZXbcxypRrbAftcg-qixHNBiCSSWYpKQykYdt0Cb~wY-ok3u~uU1auoRQiyXiFMBHRkFOkCLQ2ZBxA8wo0dNGkT6Drfm07nOlhJiz~rR9jZ3Ih73HLVhi-LJTP2oWRfbtXRGjBsM4cTvlT6ElvCXmxNv5SUh3V3s8vPdWAzhC1dbuQvIRHc6zkUMRvEUFPU7f4qXuEt3xd01aFB7edZzztSgulJiMANSQ0zA__"
          type="video/mp4"
        />
      </video>
    </div>

    {/* Content */}
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h2
        className="font-bold max-w-[942px] mx-auto text-[clamp(2.5rem,5vw,4.5rem)] leading-[100%] tracking-normal text-center text-[#F4F4F4] mb-6 md:mb-8"
        style={{
          fontFamily: "New-Order-SemiBold",
        }}
      >
        What are we looking for?
      </h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-8 w-full">
        {/* First Box */}
        <div className="aspect-square cursor-pointer lg:w-[484px] lg:h-[535px] w-56 bg-blue-500/90 rounded-xl md:rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] shadow-lg" />

        {/* Second Box */}
        <div className="aspect-square cursor-pointer lg:w-[484px] lg:h-[535px] w-56 bg-blue-500/90 rounded-xl md:rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] shadow-lg" />
      </div>
    </div>
  </section>
);
export default WhatAreWeLooking;
