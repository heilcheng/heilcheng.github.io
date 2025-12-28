import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon, SparklesIcon } from "lucide-react";

export const DATA = {
  name: "Hailey Cheng",
  initials: "HC",
  url: "https://heilcheng.github.io",
  location: "Hong Kong",
  locationLink: "https://www.google.com/maps/place/hongkong",
  description:
    "Math junior with research interests in Mathematical Biology and AI for biomedicine.",
  summary:
    "I'm a Homo sapiens born and raised in Hong Kong. I also spent a year studying in the UK and semesters in the US and France, experiences that opened my mind and shaped how I see the world.\n\nBefore university, I was that kid obsessed with biology and completely hooked on the Olympiad. I loved exploring the mysteries of life. But after countless hours pipetting in the lab, I started to feel burnt out. I realized I loved biology, just not the endless wet lab work.\n\nAt the same time, I discovered the beauty and speed of simulations, where you can explore complex systems without spilling a single drop. One day, I had a lightbulb moment: \"What if I could use math and code to solve big biology questions instead?\" That idea completely changed my path.\n\nAnd so, here I am, merging my love for biology with the power of math and computation.\n\nWhen I'm not coding or solving equations, you'll find me kayaking, playing tennis, or on a mission to hunt down the best ramen and handmade pasta in Hong Kong (I might have tried them all by now). And when it comes to boba, it's always \"No.1\" at Comebuytea.",
  avatarUrl: "/me.jpeg",

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
    { href: "/showcase", icon: SparklesIcon, label: "Showcase" },
  ],
  contact: {
    email: "haileycheng@proton.me",
    tel: "+852-XXX-XXX-XXX",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/heilcheng",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/heilcheng",
        icon: Icons.linkedin,
        navbar: true,
      },

      email: {
        name: "Send Email",
        url: "mailto:haileycheng@proton.me",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  technicalExperience: [
    {
      company: "Cognos Labs",
      href: "https://cognos-lab.com",
      badges: [],
      location: "Hong Kong",
      title: "Member of Technical Staff",
      logoUrl: "/cognoslabs.jpeg",
      start: "January 2026",
      end: "Present",
      bullets: [
        "Builds next-generation neurorehabilitation systems by combining multimodal sensing, adaptive AI, and neuroscience-informed design."
      ],
    },
    {
      company: "Google DeepMind",
      href: "https://deepmind.com",
      badges: [],
      location: "Remote",
      title: "Open Source Software Developer\nGoogle Summer of Code Participant",
      logoUrl: "/deepmind.jpg",
      start: "May 2025",
      end: "Present",
      bullets: [
        "Engineered a scalable model evaluation platform using Python, PyTorch, and Docker, which improved benchmarking efficiency by 15% and supported parallel execution across 5+ academic test suites (e.g., MMLU, HumanEval)",
        "Designed and deployed a fully automated CI/CD pipeline with GitHub Actions to enforce 95% unit test coverage, guaranteeing reproducible, production-ready builds for a system"
      ],
    },
    {
      company: "City University of Hong Kong",
      href: "https://www.cityu.edu.hk",
      badges: [],
      location: "Hong Kong",
      title: "Undergraduate Researcher",
      logoUrl: "/cityuhk.jpg",
      start: "September 2024",
      end: "Present",
      bullets: [
        "Thesis: Hybrid ODE-Neural Network for Personalized Treatment Prediction",
        "Engineered a multi-task deep learning model in Python and PyTorch as a computationally efficient surrogate for a complex 15-state ODE system, reducing prediction latency from hours to milliseconds",
        "Designed the neural network (98% AUC, 91.7% accuracy) and developed an end-to-end MLOps pipeline for data generation (N=1,000), training, and validation, achieving an R² of 0.78 on regression tasks"
      ],
    },
  ],
  education: [
    {
      school: "City University of Hong Kong",
      href: "https://www.cityu.edu.hk",
      degree: "Bachelor of Science in Computing Mathematics (GREAT Stream), Minor in Computer Science",
      logoUrl: "/cityuhk.jpg",
      start: "2023",
      end: "2027",
    },
    {
      school: "University of California, Berkeley",
      href: "https://berkeley.edu",
      degree: "Exchange Student, Mathematics",
      logoUrl: "/Berkeley.png",
      start: "2024",
      end: "2024",
    },
    {
      school: "Pearson Edexcel A-Levels",
      href: "https://qualifications.pearson.com",
      degree: "4A* in Mathematics, Biology, Economics, Chinese\nReceived offers from HKU, CUHK, KCL and Manchester",
      logoUrl: "/pearson.jpeg",
      start: "2022",
      end: "2023",
    },
  ],
  projects: [
    {
      title: "MEQ-Bench",
      href: "https://github.com/heilcheng/MEQ-Bench",
      dates: "2024 - Present",
      active: true,
      description:
        "The first benchmark designed to evaluate an LLM's ability to generate audience-adaptive medical explanations for diverse stakeholders, including physicians, nurses, and patients.",
      technologies: [
        "Python",
        "LLM",
        "Medical AI",
        "Benchmarking",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/heilcheng/MEQ-Bench",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Gemma Benchmark Suite",
      href: "https://github.com/heilcheng/gemma-benchmark",
      dates: "2024 - Present",
      active: true,
      description:
        "An evaluation suite for Google's Gemma models across academic LLM benchmarks, with quantization support and efficiency profiling.",
      technologies: [
        "Python",
        "LLM",
        "Benchmarking",
        "Quantization",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/heilcheng/gemma-benchmark",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Craftscape HK",
      href: "https://i.imgur.com/8z4eENj.gif",
      dates: "2025",
      active: true,
      description:
        "AI-powered platform preserving Hong Kong's disappearing traditional crafts through AR experiences, and AI-assisted custom design creation with real-world artisans to bring ideas to life.",
      technologies: [
        "React",
        "NestJS",
        "Google Gemini",
        "AR",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/gracetyy/CraftscapeHK",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "https://i.imgur.com/8z4eENj.gif",
      video: "",
    },
    {
      title: "Truth or Dare (Cantonese)",
      href: "https://i.imgur.com/GVjLPbi.gif",
      dates: "2024 - Present",
      active: true,
      description:
        "A Truth or Dare question generator web app built in Cantonese, using React for webapp and React Native for Apps.",
      technologies: [
        "React",
        "React Native",
        "JavaScript",
        "Cantonese",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/heilcheng/Truth-or-Dare-Canto",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "https://i.imgur.com/GVjLPbi.gif",
      video: "",
    },
  ],
  books: [
    {
      theme: "Political Philosophy & Social Theory",
      books: [
        {
          title: "The Social Contract",
          author: "Jean-Jacques Rousseau",
          number: 1,
        },
        {
          title: "On Liberty",
          author: "John Stuart Mill",
          number: 2,
        },
        {
          title: "Distinction: A Social Critique of the Judgement of Taste",
          author: "Pierre Bourdieu",
          number: 3,
        },
        {
          title: "The Spirit of the Laws",
          author: "Montesquieu",
          number: 4,
        },
      ],
    },
    {
      theme: "Contemporary Philosophy",
      books: [
        {
          title: "Agonie des Eros",
          author: "Byung-Chul Han",
          number: 5,
        },
        {
          title: "Thus Spoke Zarathustra",
          author: "Friedrich Nietzsche",
          number: 6,
        },
      ],
    },
    {
      theme: "History & Global Affairs",
      books: [
        {
          title: "A Concise History of Hong Kong",
          author: "John M. Carroll",
          number: 7,
        },
        {
          title: "Understanding Global Conflict and Cooperation",
          author: "David A. Welch and Joseph S. Nye, Jr.",
          number: 8,
        },
      ],
    },
    {
      theme: "Digital Life & Privacy",
      books: [
        {
          title: "The Art of Invisibility",
          author: "Kevin Mitnick",
          number: 9,
        },
        {
          title: "Digital Minimalism",
          author: "Cal Newport",
          number: 10,
        },
      ],
    },
    {
      theme: "Memoir & Personal Reflections",
      books: [
        {
          title: "The Watching Brief",
          author: "Margaret Ng Ngoi Yee",
          number: 11,
        },
      ],
    },
  ],
} as const;
