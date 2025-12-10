"use client";

import { motion } from "framer-motion";

export function PlacementBanner() {
  return (
    <section className="py-8 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Our Students Got Placed At
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {["TCS", "Wipro", "Infosys", "Cognizant", "Tech Mahindra", "HCL"].map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-xl md:text-2xl font-bold text-slate-400 hover:text-brand-600 transition-colors cursor-default"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
