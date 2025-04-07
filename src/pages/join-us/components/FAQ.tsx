import { useState } from "react";
import { FAQs } from "../../../const/joinus-data";

const faqBoxClass =
  "cursor-pointer rounded-2xl bg-[#e1eae9] border border-gray-200 px-6 py-5 mb-5 shadow-sm hover:shadow-md transition-all duration-100";
const questionWrapperClass =
  "w-full flex items-center justify-between text-left text-[clamp(1rem,2vw,1.125rem)] font-medium text-gray-800";
const iconClass =
  "flex-shrink-0 ml-4 flex items-center justify-center w-9 h-9 rounded-full bg-[#d6dddd] text-lg font-bold";

const answerWrapper = (isOpen: boolean) =>
  `transition-all duration-300 ease-in-out overflow-hidden text-gray-600 text-base font-[New-Order-Medium] ${
    isOpen ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
  }`;

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="w-full px-6 md:px-12 lg:px-[10%] py-12 bg-[#eef4f4]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left Side */}
        <div className="flex flex-col lg:mt-[20%]">
          <h2 className="font-[AlbertSans-SemiBold] text-[#434548] lg:text-[120px] text-[80px]">
            FAQS
          </h2>
          <p className="mt-4 text-[clamp(1rem,2vw,1.25rem)] text-gray-600 max-w-md font-[New-Order-SemiBold]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
            rerum deleniti amet.
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full">
          {FAQs?.map((item: any, index: number) => (
            <div
              className={faqBoxClass}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <button className={questionWrapperClass}>
                <span className="font-[New-Order-Medium]">{item.question}</span>
                <span className={iconClass}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div className={answerWrapper(openIndex === index)}>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
