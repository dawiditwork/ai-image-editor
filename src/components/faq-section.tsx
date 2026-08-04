"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  items: FaqItem[];
};

export default function FaqSection({ items }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-5">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
              isOpen
                ? "border-blue-300 bg-blue-50/40 shadow-lg shadow-blue-500/10"
                : "border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span
                className={`text-lg font-semibold transition-colors duration-300 ${
                  isOpen ? "text-blue-600" : "text-slate-900"
                }`}
              >
                {item.question}
              </span>

              <ChevronDown
                className={`h-6 w-6 shrink-0 transition-all duration-300 ${
                  isOpen
                    ? "rotate-180 text-blue-600"
                    : "text-slate-400"
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-7 text-slate-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}