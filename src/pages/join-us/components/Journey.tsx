const Journey = () => (
  <section className="bg-black text-white py-12 px-6 md:px-16 max-w-[90%] md:max-w-[61.5%] mx-auto">
    {/* Title Section */}
    <h1 className="text-3xl md:text-5xl font-bold text-left font-[New-Order-SemiBold]">
      Every masterpiece begins
      <br /> with a single step
    </h1>

    {/* Image Section */}
    <div className="my-8">
      <img
        src="src/assets/joinus-masterpiece.png"
        alt="Creative Artwork"
        className="w-full rounded-xl"
      />
    </div>

    {/* Timeline Row Layout */}
    <div className="flex flex-col md:flex-row gap-12 mt-10">
      {/* Left Side Description */}
      <div className="md:w-1/2">
        <p className="text-lg md:text-xl font-light max-w-2xl font-[New-Order-SemiBold]">
          Every masterpiece begins with a single step. From my early days of
          exploring creativity to mastering the art of design, this timeline
          reflects the evolution of my passion, skills, and vision.
        </p>
      </div>

      {/* Right Side Timeline */}
      <div className="md:w-1/2 border-l-2 border-purple-500 pl-6 space-y-8 relative">
        <div className="relative pl-4">
          <div className="absolute left-[-12px] top-2 w-4 h-4 bg-purple-500 rounded-full"></div>
          <h3 className="text-xl font-[New-Order-SemiBold]">
            Foundation of Creativity
          </h3>
          <p className="text-sm text-gray-400 max-w-lg font-[New-Order-Regular]">
            Started as a curious mind, diving into the world of design.
            Experimented with various styles and techniques to build a solid
            foundation.
          </p>
          <span className="inline-block bg-purple-500 text-white px-3 py-1 mt-2 rounded-full text-xs font-[New-Order-Regular]">
            2020 - 2024
          </span>
        </div>

        <div className="relative pl-4">
          <div className="absolute left-[-12px] top-2 w-4 h-4 bg-purple-500 rounded-full"></div>
          <h3 className="text-xl font-[New-Order-SemiBold]">
            Foundation of Creativity
          </h3>
          <p className="text-sm text-gray-400 max-w-lg font-[New-Order-Regular]">
            Started as a curious mind, diving into the world of design.
            Experimented with various styles and techniques to build a solid
            foundation.
          </p>
          <span className="inline-block bg-purple-500 text-white px-3 py-1 mt-2 rounded-full text-xs font-[New-Order-Regular]">
            2020 - 2024
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default Journey;
