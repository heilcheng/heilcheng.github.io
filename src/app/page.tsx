"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GitHubContributions = dynamic(() => import("@/components/github-contributions").then(mod => mod.GitHubContributions), { ssr: false });
const EthicsQuote = dynamic(() => import("@/components/ethics-quote").then(mod => mod.EthicsQuote), { ssr: false });
const TechStack = dynamic(() => import("@/components/tech-stack").then(mod => mod.TechStack), { ssr: false });
const TimelineItem = dynamic(() => import("@/components/resume-card").then(mod => mod.TimelineItem), { ssr: false });
const ContactOrbiting = dynamic(() => import("@/components/contact-orbiting").then(mod => mod.ContactOrbiting), { ssr: false });


const HongKongMap = dynamic(() => import("@/components/hong-kong-map").then(mod => mod.HongKongMap), { ssr: false });
const WorldMap = dynamic(() => import("@/components/world-map").then(mod => mod.WorldMap), { ssr: false });
const BlurFade = dynamic(() => import("@/components/magicui/blur-fade").then(mod => mod.default), { ssr: false });
const BlurFadeText = dynamic(() => import("@/components/magicui/blur-fade-text").then(mod => mod.default), { ssr: false });
const ProjectCard = dynamic(() => import("@/components/project-card").then(mod => mod.ProjectCard), { ssr: false });
const ResumeCard = dynamic(() => import("@/components/resume-card").then(mod => mod.ResumeCard), { ssr: false });
const BookCard = dynamic(() => import("@/components/book-card").then(mod => mod.BookCard), { ssr: false });
const HomeGraph = dynamic(() => import("@/components/home-graph").then(mod => mod.HomeGraph), { ssr: false });
const UnifiedGraph = dynamic(() => import("@/components/unified-graph").then(mod => mod.UnifiedGraph), { ssr: false });
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

// Glassmorphism Bento Card Component
function GlassCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <BlurFade delay={delay}>
      <div className={`glass-card p-6 md:p-8 ${className}`}>
        {children}
      </div>
    </BlurFade>
  );
}

export default function Page() {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [showUnifiedGraph, setShowUnifiedGraph] = useState(false);

  const toggleBookCategory = (theme: string) => {
    setExpandedBooks(prev => ({ ...prev, [theme]: !prev[theme] }));
  };

  // Reorder projects: Craftscape HK (2) and Truth or Dare (3) first, then MEQ-Bench (0) and Gemma (1)
  const featuredProjects = [DATA.projects[2], DATA.projects[3]];
  const moreProjects = [DATA.projects[0], DATA.projects[1]];

  return (
    <main className="flex flex-col min-h-[100dvh] py-section-lg space-y-6">
      {/* Hero Section - Apple-style elegant design */}
      <section id="hero">
        <GlassCard delay={BLUR_FADE_DELAY} className="hero-glass overflow-hidden">
          <div className="w-full py-8 md:py-12">
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Avatar with elegant ring */}
              <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full blur-md"></div>
                  <Avatar className="relative size-28 md:size-32 border-2 border-white/60 shadow-2xl">
                    <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                    <AvatarFallback>{DATA.initials}</AvatarFallback>
                  </Avatar>
                </div>
              </BlurFade>

              {/* Main heading - Apple style large title */}
              <div className="space-y-4 max-w-3xl">
                <BlurFadeText
                  delay={BLUR_FADE_DELAY * 3}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text"
                  yOffset={8}
                  text={`Hi, I'm ${DATA.name.split(" ")[0]}.`}
                />

                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                  <p className="text-sm md:text-base text-muted-foreground/70 font-light tracking-wide">
                    鄭曦琳 · Cheng Hei Lam · /tsʰɛŋ hei lɐm/
                  </p>
                </BlurFade>
              </div>

              {/* Description - clean and elegant */}
              <BlurFade delay={BLUR_FADE_DELAY * 5}>
                <p className="max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                  {DATA.description}
                </p>
              </BlurFade>

              {/* CTA - minimal and elegant */}
              <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Currently building at{" "}
                  <a
                    href="https://coglixlabs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 hover:decoration-primary/60 transition-all duration-300"
                  >
                    Coglix Labs
                  </a>
                </p>
              </BlurFade>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Navigation Graph Section */}
      <section id="graph">
        <GlassCard delay={BLUR_FADE_DELAY * 7} className="p-4 md:p-6">
          <div className="relative">
            {showUnifiedGraph ? (
              <UnifiedGraph showBlogPosts={true} />
            ) : (
              <HomeGraph />
            )}
            <button
              onClick={() => setShowUnifiedGraph(!showUnifiedGraph)}
              className="absolute bottom-4 right-4 z-30 flex items-center gap-2 px-3 py-2 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg hover:scale-105 transition-all duration-200 backdrop-blur-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="whitespace-nowrap">
                {showUnifiedGraph ? "Sections Only" : "With Blog Posts"}
              </span>
            </button>
          </div>
        </GlassCard>
      </section>

      {/* About Section */}
      <section id="about">
        <GlassCard delay={BLUR_FADE_DELAY * 10}>
          <div className="space-y-content-md">
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-2xl font-bold text-center">About.</h2>
              <button
                onClick={() => setAboutExpanded(!aboutExpanded)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                {aboutExpanded ? "Hide" : "Read more"}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <AnimatePresence>
              {aboutExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-content-sm pt-2">
                    <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert leading-relaxed">
                      I&apos;m a Homo sapiens born and raised in Hong Kong. I also spent a year studying in the UK and semesters in the US and France, experiences that opened my mind and shaped how I see the world.
                    </p>
                    <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert leading-relaxed">
                      Before university, I was that kid obsessed with biology and completely hooked on the Olympiad. I loved exploring the mysteries of life. But after countless hours pipetting in the lab, I started to feel burnt out. I realized I loved biology, just not the endless wet lab work.
                    </p>
                    <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert leading-relaxed">
                      At the same time, I discovered the beauty and speed of simulations, where you can explore complex systems without spilling a single drop. One day, I had a lightbulb moment: &ldquo;What if I could use math and code to solve big biology questions instead?&rdquo; That idea completely changed my path.
                    </p>
                    <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert leading-relaxed">
                      And so, here I am, merging my love for biology with the power of math and computation.
                    </p>
                    <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert leading-relaxed">
                      When I&apos;m not coding or solving equations, you&apos;ll find me kayaking, playing tennis, or on a mission to hunt down the best ramen and handmade pasta in Hong Kong (I might have tried them all by now). And when it comes to boba, it&apos;s always &ldquo;No.1&rdquo; at Comebuytea.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </section>

      {/* Ethics Quote Section */}
      <section id="ethics">
        <GlassCard delay={BLUR_FADE_DELAY * 15.5} className="p-4 md:p-6">
          <EthicsQuote delay={0} />
        </GlassCard>
      </section>

      {/* Work Experience Section */}
      <section id="work">
        <GlassCard delay={BLUR_FADE_DELAY * 17}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Cool Places I Worked At.</h2>
            <div className="divide-y divide-border/20">
              {DATA.technicalExperience.map((work, id) => (
                <BlurFade key={work.company} delay={BLUR_FADE_DELAY * 18 + id * 0.02}>
                  <TimelineItem
                    logoUrl={work.logoUrl}
                    altText={work.company}
                    title={work.company}
                    subtitle={work.title}
                    href={work.href}
                    badges={work.badges}
                    period={`${work.start} - ${work.end ?? "Present"}`}
                    bullets={work.bullets}
                    isLast={id === DATA.technicalExperience.length - 1}
                  />
                </BlurFade>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Education Section */}
      <section id="education">
        <GlassCard delay={BLUR_FADE_DELAY * 19}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Education.</h2>
            <div className="divide-y divide-border/20">
              {DATA.education.map((education, id) => (
                <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 20 + id * 0.02}>
                  <TimelineItem
                    logoUrl={education.logoUrl}
                    altText={education.school}
                    title={education.school}
                    subtitle={education.degree}
                    href={education.href}
                    period={`${education.start} - ${education.end}`}
                    isLast={id === DATA.education.length - 1}
                  />
                </BlurFade>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack">
        <GlassCard delay={BLUR_FADE_DELAY * 21} className="p-4 md:p-6">
          <TechStack delay={0} />
        </GlassCard>
      </section>

      {/* Projects Section */}
      <section id="projects">
        <GlassCard delay={BLUR_FADE_DELAY * 22}>
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-center">
                  Check out my latest work.
                </h2>
                <p className="text-muted-foreground md:text-lg/relaxed max-w-lg mx-auto">
                  I&apos;ve worked on a variety of projects, from simple
                  websites to complex web applications.
                </p>
              </div>
            </div>

            {/* Expand button */}
            <div className="flex justify-center">
              <button
                onClick={() => setProjectsExpanded(!projectsExpanded)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full transition-all duration-200 backdrop-blur-sm"
              >
                {projectsExpanded ? "Hide projects" : "View projects"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${projectsExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* All Projects - Hidden by default */}
            <AnimatePresence>
              {projectsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[...featuredProjects, ...moreProjects].map((project, id) => (
                      <BlurFade
                        key={project.title}
                        delay={0.05 + id * 0.05}
                      >
                        <ProjectCard
                          href={project.href}
                          title={project.title}
                          description={project.description}
                          dates={project.dates}
                          tags={project.technologies}
                          image={project.image}
                          video={project.video}
                          links={project.links}
                        />
                      </BlurFade>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </section>

      {/* GitHub Contributions Section */}
      <section id="github">
        <GlassCard delay={BLUR_FADE_DELAY * 24} className="p-4 md:p-6">
          <GitHubContributions username="heilcheng" delay={0} />
        </GlassCard>
      </section>

      {/* Books Section - Compact horizontal layout */}
      <section id="books">
        <GlassCard delay={BLUR_FADE_DELAY * 25}>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Commonplace Book.</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Readings that shape my worldview
              </p>
            </div>

            {/* Compact horizontal scroll of book categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {DATA.books.map((themeGroup, themeId) => (
                <BlurFade key={themeGroup.theme} delay={BLUR_FADE_DELAY * 27 + themeId * 0.05}>
                  <button
                    onClick={() => toggleBookCategory(themeGroup.theme)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${expandedBooks[themeGroup.theme]
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-white/50 dark:bg-white/10 text-muted-foreground hover:text-foreground hover:bg-white/70 dark:hover:bg-white/20 border border-transparent"
                      }`}
                  >
                    {themeGroup.theme}
                    <span className="text-xs opacity-70">({themeGroup.books.length})</span>
                  </button>
                </BlurFade>
              ))}
            </div>

            {/* Expanded books list - compact grid */}
            <AnimatePresence>
              {Object.entries(expandedBooks).some(([, isExpanded]) => isExpanded) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {DATA.books
                      .filter((themeGroup) => expandedBooks[themeGroup.theme])
                      .flatMap((themeGroup) => themeGroup.books)
                      .map((book, index) => (
                        <motion.div
                          key={book.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                        >
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {book.number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{book.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </section>

      {/* Hong Kong Map Section */}
      <section id="hong-kong">
        <GlassCard delay={BLUR_FADE_DELAY * 29}>
          <div className="space-y-content-lg">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-center">
                  Best parts of Hong Kong.
                </h2>
                <p className="text-muted-foreground md:text-lg/relaxed max-w-md mx-auto">
                  A collection of my favorite spots and activities in the city I call home.
                </p>
              </div>
            </div>
            <HongKongMap delay={0} />
          </div>
        </GlassCard>
      </section>

      {/* World Map Section */}
      <section id="world">
        <GlassCard delay={BLUR_FADE_DELAY * 31}>
          <div className="space-y-content-lg">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-center">
                  World Map.
                </h2>
                <p className="text-muted-foreground md:text-lg/relaxed max-w-md mx-auto">
                  Countries I&apos;ve visited and want to visit.
                </p>
              </div>
            </div>
            <WorldMap delay={0} />
          </div>
        </GlassCard>
      </section>

      {/* Duolingo section */}
      <section id="duolingo">
        <GlassCard delay={BLUR_FADE_DELAY * 34} className="min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-bold text-[#58cc02] mb-8 text-center animate-pulse">
            Spanish or vanish?
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://i.pinimg.com/originals/98/59/12/98591272861e66a02eecf5dae0450c73.gif"
            alt="Duolingo"
            className="max-w-[300px] md:max-w-[400px] w-full"
          />
        </GlassCard>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <GlassCard delay={BLUR_FADE_DELAY * 36} className="p-4 md:p-6">
          <ContactOrbiting delay={0} />
        </GlassCard>
      </section>
    </main>
  );
}
