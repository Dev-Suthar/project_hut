import { WHY_CHOOSE_US_DATA } from "../../../const/joinus-data";

const WhyChooseUs = () => {
  return (
    <section className="mx-[10%] md:mx-[22.5%]">
      <h2 className="text-left font-bold">
        <span
          className="text-white block max-w-[531px] font-bold"
          style={{
            fontSize: "clamp(1.5rem, 5vw, 3rem)",
            fontFamily: "New-Order-SemiBold",
          }}
        >
          Why Choose
        </span>
        <span
          className="block max-w-[531px] font-bold"
          style={{
            fontSize: "clamp(1.5rem, 5vw, 3rem)",
            fontFamily: "New-Order-SemiBold",
            color: "#46D5B3",
          }}
        >
          Fractional Work
        </span>
      </h2>
      <div className="bg-black min-h-screen  text-white">
        {/* Container for image + features */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12 max-w-7xl mx-auto">
          {/* Profile Image - Left Side */}
          <div className="w-full lg:w-auto flex justify-center mt-12">
            <div className="md:w-[372px] h-[457px] w-full relative">
              <img
                src="https://s3-alpha-sig.figma.com/img/463b/b538/248241a5fc4e376a2a99eeda94d6574c?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=W648~~jb1guNS0LLYDopmdzRbnyU9h39yJrUjAtdMFM0pmkCQEf0P1~Goj1uk0SYuSybIR4ZkuoqYwTW5vZ2EJjVL67V-s1HUj9LKCqVIaeBaYiQgECIGbaoK4QrZKIVdg1fVjT74d7XAhoLjy9AkPmQo1Ts0z~~XNLq13zeXEx3k2LGRuNhidY~qdvxrdk8DgnjQqHEU8jJYSbrPkCh7Jv-~MMYXOWTbqYYIyUUPDYlbh-7vC~34xRRsiYsN2j9mZNiugA4mYYHatDhZvy0zJdLR7VxBki0npuw42wCEmMSc~IqdfXvCJzYUBhStC0~kysK8Vqivfjl~Yvk2gZyZw__"
                alt="Profile"
                className="w-full h-full object-cover rounded-lg shadow-xl border border-gray-700"
              />
            </div>
          </div>

          {/* Features - Right Side */}
          <div className="flex-1 md:ml-8 w-full mx-auto mt-[25px] md:mt-[102px]">
            {WHY_CHOOSE_US_DATA.map((item: any) => (
              <div className="lg:mb-16 mb-8" key={item.title}>
                <h3 className="lg:mb-4 mb-2 text-xl sm:text-2xl lg:text-[40px] font-clamp text-[#F4F4F4] font-[New-Order-Medium]">
                  {item.title}
                </h3>

                <p
                  className="text-[#F4F4F4] w-full flex items-center 
                      text-lg lg:text-xl font-[New-Order-Medium]"
                >
                  {item.description}
                </p>
                <img
                  src="src/assets/carrerArrow1.png"
                  alt="Arrow indicator"
                  className="w-[125px] sm:w-[99px] h-[22px] sm:h-[27px] lg:mt-8 mt-6"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
