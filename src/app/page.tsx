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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  const toggleBookCategory = (theme: string) => {
    setExpandedBooks(prev => ({ ...prev, [theme]: !prev[theme] }));
  };

  // Reorder projects: Craftscape HK (2) and Truth or Dare (3) first, then MEQ-Bench (0) and Gemma (1)
  const featuredProjects = [DATA.projects[2], DATA.projects[3]];
  const moreProjects = [DATA.projects[0], DATA.projects[1]];

  return (
    <main className="flex flex-col min-h-[100dvh] py-section-md">
      <section id="hero" className="mb-section-lg">
        <div className="w-full space-y-content-lg">
          <div className="flex flex-col-reverse md:flex-row gap-8 justify-between items-center md:items-start text-center md:text-left">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY * 2}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}.`}
              />
              <BlurFade delay={BLUR_FADE_DELAY * 3}>
                <p className="text-sm text-muted-foreground md:text-base">
                  I&apos;m Hongkongese. In Cantonese, I&apos;m Cheng Hei Lam (鄭曦琳).
                  <br />
                  IPA: /tsʰɛŋ hei lɐm/
                </p>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 4}>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  {DATA.description}
                </p>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 5}>
                <p className="text-muted-foreground md:text-xl">
                  Currently building @{" "}
                  <a 
                    href="https://cognos-lab.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-primary/80 underline decoration-primary/40 underline-offset-2 hover:decoration-primary/60 transition-all duration-200"
                  >
                    Cognos Labs
                  </a>
                </p>
              </BlurFade>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY * 6}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      <BlurFade delay={BLUR_FADE_DELAY * 7}>
        <HomeGraph />
      </BlurFade>

      <section id="about" className="mb-section-lg">
        <div className="space-y-content-md">
          <BlurFade delay={BLUR_FADE_DELAY * 10}>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">About</h2>
              <button
                onClick={() => setAboutExpanded(!aboutExpanded)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-full transition-all duration-200"
              >
                {aboutExpanded ? "Hide" : "Read more"}
                <ChevronDown 
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </BlurFade>
          
          <AnimatePresence>
            {aboutExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-content-sm">
                  <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                    I&apos;m a Homo sapiens born and raised in Hong Kong. I also spent a year studying in the UK and semesters in the US and France, experiences that opened my mind and shaped how I see the world.
                  </p>
                  <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                    Before university, I was that kid obsessed with biology and completely hooked on the Olympiad. I loved exploring the mysteries of life. But after countless hours pipetting in the lab, I started to feel burnt out. I realized I loved biology, just not the endless wet lab work.
                  </p>
                  <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                    At the same time, I discovered the beauty and speed of simulations, where you can explore complex systems without spilling a single drop. One day, I had a lightbulb moment: &ldquo;What if I could use math and code to solve big biology questions instead?&rdquo; That idea completely changed my path.
                  </p>
                  <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                    And so, here I am, merging my love for biology with the power of math and computation.
                  </p>
                  <p className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                    When I&apos;m not coding or solving equations, you&apos;ll find me kayaking, playing tennis, or on a mission to hunt down the best ramen and handmade pasta in Hong Kong (I might have tried them all by now). And when it comes to boba, it&apos;s always &ldquo;No.1&rdquo; at Comebuytea.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section id="ethics" className="mb-section-lg">
        <div className="space-y-content-md">
          <EthicsQuote delay={BLUR_FADE_DELAY * 15.5} />
        </div>
      </section>

      <section id="work" className="mb-section-lg">
        <div className="space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 17}>
            <h2 className="text-xl font-bold lowercase">cool places i worked at</h2>
          </BlurFade>
          <div className="divide-y divide-border/30">
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
      </section>

      <section id="education" className="mb-section-lg">
        <div className="space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 19}>
            <h2 className="text-xl font-bold lowercase">education</h2>
          </BlurFade>
          <div className="divide-y divide-border/30">
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
      </section>

      <section id="tech-stack" className="mb-section-lg">
        <TechStack delay={BLUR_FADE_DELAY * 21} />
      </section>

      <section id="projects" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 22}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Check out my latest work.
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  I&apos;ve worked on a variety of projects, from simple
                  websites to complex web applications. Here are a few of my
                  favorites.
                </p>
              </div>
            </div>
          </BlurFade>
          
          {/* Featured Projects (Craftscape HK & Truth or Dare) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
            {featuredProjects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 23 + id * 0.05}
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

          {/* Expand button */}
          <BlurFade delay={BLUR_FADE_DELAY * 24}>
            <div className="flex justify-center">
              <button
                onClick={() => setProjectsExpanded(!projectsExpanded)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-full transition-all duration-200"
              >
                {projectsExpanded ? "Show less" : "Show more projects"}
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${projectsExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </BlurFade>

          {/* More Projects (MEQ-Bench & Gemma) */}
          <AnimatePresence>
            {projectsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                  {moreProjects.map((project, id) => (
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
      </section>

      <section id="github" className="mb-section-lg">
        <GitHubContributions username="heilcheng" delay={BLUR_FADE_DELAY * 24} />
      </section>

      <section id="books" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 25}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Commonplace Book.
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A personal collection of readings and ideas that shape my worldview.
                </p>
              </div>
            </div>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 26}>
            <div className="space-y-4">
              {DATA.books.map((themeGroup, themeId) => (
                <div key={themeGroup.theme}>
                  <BlurFade delay={BLUR_FADE_DELAY * 27 + themeId * 0.1}>
                    <button
                      onClick={() => toggleBookCategory(themeGroup.theme)}
                      className="flex items-center gap-2 w-full text-left group"
                    >
                      <h3 className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                        {themeGroup.theme}
                      </h3>
                      <span className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground group-hover:text-foreground bg-muted/50 group-hover:bg-muted rounded-full transition-all duration-200">
                        {expandedBooks[themeGroup.theme] ? "Hide" : `${themeGroup.books.length} ${themeGroup.books.length === 1 ? "book" : "books"}`}
                        <ChevronDown 
                          className={`w-3 h-3 transition-transform duration-200 ${expandedBooks[themeGroup.theme] ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                  </BlurFade>
                  <AnimatePresence>
                    {expandedBooks[themeGroup.theme] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-3 mb-4 ml-4 divide-y divide-dashed border-l">
                          {themeGroup.books.map((book) => (
                            <BookCard
                              key={book.title + book.author}
                              title={book.title}
                              author={book.author}
                              number={book.number}
                            />
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="hong-kong" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 29}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Best parts of Hong Kong.
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A collection of my favorite spots and activities in the city I call home.
              </p>
            </div>
          </div>
        </BlurFade>
          <HongKongMap delay={BLUR_FADE_DELAY * 30} />
        </div>
      </section>

      <section id="world" className="mb-section-lg">
        <div className="space-y-content-lg">
          <BlurFade delay={BLUR_FADE_DELAY * 31}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                World Map.
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Countries I&apos;ve visited and want to visit.
              </p>
            </div>
          </div>
        </BlurFade>
          <WorldMap delay={BLUR_FADE_DELAY * 32} />
        </div>
      </section>

      {/* Duolingo section at the end */}
      <section id="duolingo" className="min-h-screen flex flex-col items-center justify-center mb-section-lg bg-white dark:bg-background">
        <BlurFade delay={BLUR_FADE_DELAY * 34}>
          <h2 className="text-4xl md:text-6xl font-bold text-[#58cc02] mb-8 text-center animate-pulse">
            Spanish or vanish?
          </h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 35}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://i.pinimg.com/originals/98/59/12/98591272861e66a02eecf5dae0450c73.gif" 
            alt="Duolingo" 
            className="max-w-[300px] md:max-w-[500px] w-full"
          />
        </BlurFade>
      </section>

      <ContactOrbiting delay={BLUR_FADE_DELAY * 36} />
    </main>
  );
}
