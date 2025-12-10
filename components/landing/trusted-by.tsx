"use client";

import { motion } from "framer-motion";

export function TrustedBy() {
  const companies = [
    { name: "TCS", logo: "TCS" },
    { name: "Wipro", logo: "Wipro" },
    { name: "Infosys", logo: "Infosys" },
    { name: "Tech Mahindra", logo: "Tech Mahindra" },
    { name: "Cognizant", logo: "Cognizant" },
    { name: "HCL", logo: "HCL" },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
            Our Students Got Placed At
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="px-6 py-3 rounded-lg hover:bg-slate-50 transition-all duration-300">
                <span className="text-2xl font-bold text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
                  {company.logo}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-slate-500">
            + Many more companies across India
          </p>
        </motion.div>
      </div>
    </section>
  );
}
