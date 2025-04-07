const WhyJoinUs = () => (
  <section className="bg-black text-white py-12 px-6 md:px-16 max-w-[90%] md:max-w-[61.5%] mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Side (Title + 2 Items) */}
      <div className="flex flex-col gap-6">
        {/* Title */}
        <h2
          className="font-neworder font-bold text-[clamp(1.8rem,2.5vw,2.5rem)] leading-[100%] tracking-[0%] text-[#F4F4F4] mb-4 md:mb-8 text-center md:text-left"
          style={{ fontFamily: "New-Order-SemiBold" }}
        >
          Why join us?
        </h2>

        {/* Reusable Box Component */}
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="self-center bg-gray-900 border-2 border-gray-700 p-5 md:p-10 rounded-[50px] shadow-lg max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-center gap-2"
          >
            <div className="mb-3">
              <img
                src="src/assets/why_choice_us_icon.png"
                alt="Icon"
                className="w-[83px] h-[83px] object-contain"
              />
            </div>

            <h3 className="font-[New-Order-SemiBold] lg:text-[32px] text-3xl text-[#F4F4F4]">
              AI-Native Approach
            </h3>

            <p className="font-[New-Order-Regular] lg:text-2xl text-lg text-[#F4F4F4]">
              We work exclusively with professionals who leverage AI in their
              workflows—ensuring efficiency, innovation, and top-tier quality in
              every project.
            </p>
          </div>
        ))}
      </div>

      {/* Right Side (3 Items) */}
      <div className="flex flex-col gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 border-2 border-gray-700 p-5 md:p-10 rounded-[50px] shadow-lg max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-center gap-2"
          >
            <div className="mb-3">
              <img
                src="src/assets/why_choice_us_icon.png"
                alt="Icon"
                className="w-[83px] h-[83px] object-contain"
              />
            </div>

            <h3
              className="font-neworder font-bold text-[clamp(1.5rem,2vw,2rem)] leading-[100%] tracking-[0%] text-[#F4F4F4]"
              style={{ fontFamily: "New-Order-SemiBold" }}
            >
              AI-Native Approach
            </h3>

            <p
              className="font-neworder font-medium text-[clamp(1.2rem,1.8vw,1.5rem)] leading-[120%] tracking-[0%] text-[#F4F4F4]"
              style={{ fontFamily: "New-Order-Regular" }}
            >
              We work exclusively with professionals who leverage AI in their
              workflows—ensuring efficiency, innovation, and top-tier quality in
              every project.
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyJoinUs;
