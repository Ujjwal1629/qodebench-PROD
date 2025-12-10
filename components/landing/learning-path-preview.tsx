"use client";

import { motion } from "framer-motion";
import { Code, Layout, Server, FolderCode, Mic, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

interface LearningPathStage {
  id: string;
  title: string;
  duration: string;
  skills: string[];
  icon: LucideIcon;
  status?: "locked" | "current" | "completed";
}

export function LearningPathPreview() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const stages: LearningPathStage[] = [
    {
      id: "learning",
      title: "Learning",
      duration: "4-6 weeks",
      skills: ["HTML/CSS", "JavaScript", "React/Next.js", "Backend/APIs"],
      icon: Code,
      status: "current",
    },
    {
      id: "practical-bugs",
      title: "Practical Coding Bugs",
      duration: "6-8 weeks",
      skills: ["Debug Issues", "Fix Bugs", "Test Code", "PR Review"],
      icon: FolderCode,
      status: "locked",
    },
    {
      id: "software-engineering",
      title: "Software Engineering",
      duration: "4-5 weeks",
      skills: ["Git Workflows", "CI/CD", "Testing", "Deploy"],
      icon: Server,
      status: "locked",
    },
    {
      id: "product-planning",
      title: "Product Planning",
      duration: "3-4 weeks",
      skills: ["Features", "Requirements", "Design", "Strategy"],
      icon: Layout,
      status: "locked",
    },
    {
      id: "advanced",
      title: "Advanced Challenges",
      duration: "4-6 weeks",
      skills: ["Full-Stack", "System Design", "Complex APIs", "Scale"],
      icon: Code,
      status: "locked",
    },
    {
      id: "interviews",
      title: "Mock Interviews",
      duration: "2-3 weeks",
      skills: ["AI Interview", "Live Feedback", "Report", "Practice"],
      icon: Mic,
      status: "locked",
    },
  ];

  return (
    <div className="relative px-4 lg:px-16">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-all duration-300 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6 text-slate-700" />
      </button>

      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-brand-300 scrollbar-track-slate-100"
      >
        <div className="flex gap-0 min-w-max px-4 lg:justify-center">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center">
              <StageCard stage={stage} index={index} />
              {index < stages.length - 1 && (
                <div className="flex items-center">
                  <div className="w-12 lg:w-16 h-0.5 border-t-2 border-dotted border-brand-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-all duration-300 hover:scale-110"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6 text-slate-700" />
      </button>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #7dd3fc;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #38bdf8;
        }
      `}</style>
    </div>
  );
}

interface StageCardProps {
  stage: LearningPathStage;
  index: number;
}

function StageCard({ stage, index }: StageCardProps) {
  const Icon = stage.icon;
  const isCompleted = stage.status === "completed";
  const isCurrent = stage.status === "current";
  const isLocked = stage.status === "locked";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group"
    >
      <div
        className={`
          w-64 min-h-[200px] bg-white border-2 rounded-2xl p-6 shadow-sm
          transition-all duration-300 flex flex-col
          ${
            isCurrent
              ? "border-brand-400 shadow-lg shadow-brand-100"
              : isCompleted
              ? "border-green-400"
              : "border-slate-200 opacity-75"
          }
          ${!isLocked && "hover:shadow-xl hover:-translate-y-1 cursor-pointer"}
        `}
      >
        {/* Icon and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`
              inline-flex items-center justify-center w-12 h-12 rounded-xl
              ${
                isCurrent
                  ? "bg-gradient-to-br from-brand-500 to-purple-600"
                  : isCompleted
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : "bg-slate-200"
              }
              transition-transform duration-300
              ${!isLocked && "group-hover:scale-110"}
            `}
          >
            <Icon className={`w-6 h-6 ${isLocked ? "text-slate-400" : "text-white"}`} />
          </div>

          {isCompleted && (
            <div className="bg-green-500 rounded-full p-1">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          )}

          {isCurrent && (
            <div className="bg-brand-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Current
            </div>
          )}
        </div>

        {/* Title and Duration */}
        <h3
          className={`text-lg font-bold mb-2 ${
            isLocked ? "text-slate-400" : "text-slate-900"
          }`}
        >
          {stage.title}
        </h3>
        <p className={`text-sm mb-3 ${isLocked ? "text-slate-400" : "text-slate-600"}`}>
          {stage.duration}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {stage.skills.map((skill, idx) => (
            <span
              key={idx}
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isLocked
                  ? "bg-slate-100 text-slate-400"
                  : isCurrent
                  ? "bg-brand-50 text-brand-700"
                  : isCompleted
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Hover tooltip */}
        {!isLocked && (
          <div className="absolute inset-x-0 -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 mx-4 text-center shadow-lg">
              {isCurrent ? "You're here!" : "Unlocks after previous stage"}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
