"use client";

import { MagicCard } from "@/components/ui/magic-card";
import {
  BookOpen,
  Briefcase,
  Code,
  Compass,
  Heart,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "motion/react";

export default function AboutMeContent() {
  const skillCategories = [
    {
      title: "Frontend Stack",
      skills: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "TanStack Query",
        "Redux",
      ],
    },
    {
      title: "Backend & Database",
      skills: [
        "Node.js",
        "Express",
        "Prisma ORM",
        "PostgreSQL",
        "MongoDB",
        "JWT",
      ],
    },
    {
      title: "Tools & Workflow",
      skills: ["Bun", "Git", "GitHub", "Vercel", "Postman"],
    },
  ];

  const cards = [
    {
      id: "journey",
      title: "My Programming Journey",
      icon: Compass,
      glowFrom: "#dc2626",
      glowTo: "#ea580c",
      span: "md:col-span-2 lg:col-span-8",
      content: (
        <p className="text-gray-300 text-sm leading-relaxed">
          My programming journey started with a simple curiosity about how code
          editors render different colors for code themes. That visual spark led
          me to watch HTML & CSS tutorials on YouTube, and I quickly progressed
          to JavaScript. From then on, I fell in love with logic and building
          applications, transforming that initial curiosity into a deep passion
          for web engineering.
        </p>
      ),
    },
    {
      id: "learning",
      title: "How I Learned",
      icon: BookOpen,
      glowFrom: "#ea580c",
      glowTo: "#eab308",
      span: "md:col-span-1 lg:col-span-4",
      content: (
        <p className="text-gray-300 text-sm leading-relaxed">
          I started by self-teaching through YouTube playlists. However, when I
          hit roadblocks and struggled to find structured answers, I realized
          the value of structured education. I decided to enroll in professional
          web development courses to strengthen my foundational concepts and
          adopt industry-standard architectural patterns.
        </p>
      ),
    },
    {
      id: "skills",
      title: "Skills & Tools",
      icon: Code,
      glowFrom: "#ef4444",
      glowTo: "#3b82f6",
      span: "md:col-span-1 lg:col-span-4",
      content: (
        <div className="space-y-4">
          {skillCategories.map((category) => (
            <div key={category.title} className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                {category.title}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:border-red-500/30 transition-all font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-1.5 pt-1 border-t border-white/5">
            <h4 className="text-xs uppercase tracking-wider text-orange-500 font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Currently Learning
            </h4>
            <div className="flex flex-wrap">
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold shadow-[0_0_8px_rgba(234,88,12,0.15)]">
                Golang (Go)
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "work-preference",
      title: "The Kind of Work I Like",
      icon: Sparkles,
      glowFrom: "#3b82f6",
      glowTo: "#a855f7",
      span: "md:col-span-2 lg:col-span-8",
      content: (
        <p className="text-gray-300 text-sm leading-relaxed">
          I thrive on projects where UI/UX excellence is a core requirement. I
          enjoy crafting minimalist, clean, and responsive user interfaces that
          feel premium. Additionally, I love backend engineering, specifically
          designing clean API integrations, middleware structures, and secure
          authentication flows. I'm highly motivated by challenging, complex
          logic rather than simple, repetitive tasks.
        </p>
      ),
    },
    {
      id: "projects",
      title: "Projects Portfolio",
      icon: Briefcase,
      glowFrom: "#ec4899",
      glowTo: "#dc2626",
      span: "md:col-span-1 lg:col-span-4",
      content: (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm leading-relaxed">
            I have built and delivered multiple full-stack applications where I
            independently handled both frontend interfaces and backend APIs.
            Highlight projects include:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "AI Generate Studio (ongoing)",
              "CineTube",
              "MediMurt Hub",
              "Car Rental App",
              "Recipe Book App",
            ].map((proj) => (
              <span
                key={proj}
                className="text-xs px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:scale-105 transition-transform"
              >
                {proj}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "solving",
      title: "Problem Solving Approach",
      icon: Lightbulb,
      glowFrom: "#10b981",
      glowTo: "#06b6d4",
      span: "md:col-span-1 lg:col-span-4",
      content: (
        <p className="text-gray-300 text-sm leading-relaxed">
          When I encounter an engineering roadblock, I break it down
          systematically. I analyze the error outputs and trace request paths to
          identify root causes. If needed, I research documentation, leverage
          tools like ChatGPT and online search, consult Stack Overflow threads,
          and check tutorials to find a robust, optimized fix rather than a
          quick patch.
        </p>
      ),
    },
    {
      id: "goals",
      title: "Future Goals",
      icon: Target,
      glowFrom: "#a855f7",
      glowTo: "#ec4899",
      span: "md:col-span-1 lg:col-span-4",
      content: (
        <p className="text-gray-300 text-sm leading-relaxed">
          My main career milestone is to design and ship high-scale SaaS
          products as a Full Stack Software Engineer. Although software
          development presents ongoing challenges, I enjoy the constant
          evolution. I aim to grow my backend expertise, eventually master
          Golang, and build highly optimized, distributed web applications.
        </p>
      ),
    },
    {
      id: "hobbies",
      title: "Outside of Coding",
      icon: Heart,
      glowFrom: "#f43f5e",
      glowTo: "#10b981",
      span: "md:col-span-3 lg:col-span-12",
      content: (
        <p className="text-gray-300 text-sm leading-relaxed">
          When I am not in front of my code editor, you can usually find me
          playing football, which is one of my favorite activities. Whether I'm
          visiting my home village or spending time in the city, sports keep me
          active. In the city, when taking a break from coding, I focus on
          exploring technical articles and video logs to expand my industry
          knowledge.
        </p>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-2 auto-rows-auto w-full items-stretch">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={`${card.span} flex`}
          >
            <MagicCard
              mode="orb"
              glowFrom={card.glowFrom}
              glowTo={card.glowTo}
              className="w-full p-5 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md flex flex-col gap-3 justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg text-white border"
                    style={{
                      backgroundColor: `${card.glowFrom}15`,
                      borderColor: `${card.glowFrom}30`,
                      color: card.glowFrom,
                    }}
                  >
                    <IconComponent className="size-4" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {card.title}
                  </h3>
                </div>
                {card.content}
              </div>
            </MagicCard>
          </motion.div>
        );
      })}
    </div>
  );
}
