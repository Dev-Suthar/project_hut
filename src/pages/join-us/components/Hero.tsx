const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center py-20 relative">
      <h1
        className="font-[600] leading-[100%] tracking-[-8%] text-center inline-block relative text-[#F4F4F4] mt-[81px]"
        style={{
          fontFamily: "New-Order-SemiBold",
          fontSize: "clamp(4rem, 15vw, 15rem)",
        }}
      >
        JOIN US
        <div className="flex flex-col items-center md:block">
          <span
            className="md:absolute md:left-[-1%] md:mt-2 bg-[#4977FE] px-4 py-1 rounded-full text-[#F4F4F4] md:-rotate-[-6.3deg] md:top-[-50px] font-normal text-[clamp(0.875rem,2vw,1.5rem)] leading-[100%] tracking-[0%] mt-2 rotate-0"
            style={{
              fontFamily: "AlbertSans-Regular",
            }}
          >
            AI-Native Talent
          </span>
          <span
            className="md:absolute md:left-[32.1%] md:mt-2 bg-[#46D5B3] px-4 py-1 rounded-full text-[#F4F4F4] md:-rotate-[3.8deg] md:top-[-50px] font-normal text-[clamp(0.875rem,2vw,1.5rem)] leading-[100%] tracking-[0%] mt-2 rotate-0"
            style={{
              fontFamily: "AlbertSans-Regular",
            }}
          >
            High-Impact Work
          </span>
          <span
            className="md:absolute md:left-[67%] md:mt-2 bg-[#E84D48] px-4 py-1 rounded-full text-[#F4F4F4] md:-rotate-[-7.34deg] md:top-[-50px] font-normal text-[clamp(0.875rem,2vw,1.5rem)] leading-[100%] tracking-[0%] mt-2 rotate-0"
            style={{
              fontFamily: "AlbertSans-Regular",
            }}
          >
            Flexible Opportunities
          </span>
        </div>
      </h1>
      <p
        className="mt-20 font-bold leading-[100%] tracking-[-2%] text-left mx-[10%] md:mx-[22.5%]"
        style={{
          fontFamily: "New-Order-SemiBold",
          fontSize: "clamp(2rem, 5vw, 4rem)",
        }}
      >
        The best teams don't just work{"\n"}harder—they work smarter with AI.
        {"\n"}
        Join Product Highway's fractional{"\n"}talent network and collaborate on
        {"\n"}cutting-edge projects where AI{"\n"}accelerates development,
        design,{"\n"}and product strategy.
      </p>
    </section>
  );
};

export default Hero;
