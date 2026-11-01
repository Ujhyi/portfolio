export const profile = {
  name: "David Ujhelyi",
  role: "DevOps Engineer",
  tagline:
    "Engineer working across IT infrastructure and platform operations, focused on keeping systems reliable at scale. I also build AI-powered proof-of-concepts to explore what's next.",
  location: "Bratislava, Slovakia",
  email: "david.ujh@gmail.com",
  socials: {
    github: "https://github.com/Ujhyi",
    linkedin: "https://sk.linkedin.com/in/d%C3%A1vid-ujhelyi",
    resume: "/resume.pdf",
  },
};

// A short "about" paragraph. Keep it human.
export const about =
  "I'm an early-career engineer working across infrastructure, operations, and development. I enjoy untangling messy problems, automating the boring parts, and learning whatever the job needs. Outside of work I tinker with side projects and contribute to open source.";

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "C", "TypeScript"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { group: "Backend", items: ["Spring Boot", "REST", "PostgreSQL", "Oracle SQL"] },
  { group: "Infrastructure", items: ["Kubernetes", "Docker", "CI/CD", "GCP", "Linux", "Git"] },
];

export type Project = {
  title: string;
  year: string;
  blurb: string;
  tech: string[];
  links: { label: string; href: string }[];
  featured?: boolean;
  notes?: string;
};

export const projects: Project[] = [
  {
    title: "Spendlio – AI-powered expense tracker",
    year: "2026",
    blurb:
      "Full-stack expense tracker with AI categorization. Log a purchase in your own words, snap a photo of a receipt, or add it manually. A locally hosted Gemma model (via Ollama) parses the input into individual items and sorts them into categories automatically. Includes budgets with progress tracking, multi-currency support with automatic conversion, JWT auth with rotating refresh tokens, email verification, a history page with filters and charts, dark mode and SK/EN localization.",
    tech: [
      "TypeScript",
      "Fastify",
      "PostgreSQL",
      "Drizzle ORM",
      "Zod",
      "Ollama",
      "Gemma",
      "Next.js",
      "Tailwind CSS",
      "Recharts",
      "Docker",
    ],
    links: [
      { label: "Live demo", href: "/demo/spendlio" },
      { label: "Frontend", href: "/not-found" },
      { label: "Backend", href: "/not-found" },
    ],
    featured: true,
    notes: "*the live demo runs in the browser on sample data with simulated AI - production deployment in progress",
  },
  {
    title: "ASP .NET web service providing sorted information about display devices items of an electronic store",
    year: "2024/2025",
    blurb:
      "The goal of this master's thesis was to explore the use of ASP.NET XML Web Services, design and implement a custom solution for a business manager with display technology to easily access organized information. The system provides organized information on display equipment counts, inventory, units sold, enhanced with other possible functionalities.",
    tech: ["ASP .NET", "XML", "React", "TypeScript", "Vite"],
    links: [
      { label: "Live", href: "/not-found" },
      { label: "Frontend", href: "https://github.com/Ujhyi/react-dp-prod" },
      { label: "Backend", href: "https://github.com/Ujhyi/MDeg_Project" },
    ],
    featured: false,
    notes: "*my github repo is currently in private state - just ping me to reveal",
  },
  {
    title: "Solving the real problem of data analytics",
    year: "2022/2023",
    blurb:
      "This bachelor's thesis deals with the prediction of NHL players' salaries based on statistics collected from games.",
    tech: ["Python", "CRISP-DM", "Machine-Learning"],
    links: [
      { label: "Code", href: "https://github.com/Ujhyi/bcProjektGit" },
    ],
    featured: false,
    notes: "*my github repo is currently in private state - just ping me to reveal",
  },
  {
    title: "TBD ...",
    year: "TBD...",
    blurb: "TBD...",
    tech: ["TBD..."],
    links: [
      { label: "Live", href: "/not-found" },
      { label: "Code", href: "/not-found" },
    ],
    featured: false,
    notes: "TBD...",
  },
];

export const experience: {
  role: string;
  type: string;
  company: string;
  city: string;
  period: string;
  note: string;
}[] = [
  {
    role: "Development and Operations",
    type: "full-time",
    company: "Triton Digital",
    city: "Bratislava",
    period: "2025 — Present",
    note: "External engineer for Slovak Telecom, focused on developing and automating OTT TV platform services alongside day-to-day operations & developing AI improvements and PoC.",
  },
  {
    role: "Trainee TV Specialist",
    type: "part-time",
    company: "Slovak Telecom",
    city: "Bratislava",
    period: "2024 — 2025",
    note: "Operating and developing OTT TV services — administration, configuration, monitoring, and troubleshooting of production systems, with security and AI integration as part of daily work.",
  },
  {
    role: "ICT Administrator",
    type: "part-time",
    company: "Deutsche Telekom IT Solutions",
    city: "Košice",
    period: "2023 — 2024",
    note: "Independently managed change and incident tickets (ITIL-based) to keep services within SLAs across Azure, VMware, and RHEL/CentOS environments.",
  },
];

export const education: {
  school: string;
  degree: string;
  period: string;
  note?: string;
}[] = [
  {
    school: "University of Economics in Bratislava",
    degree: "Ing. Information Management",
    period: "2023 — 2025",
    note: "Business Intelligence | Software Engineering | Big Data | UX Design | Simulation Models | Project Management | Linear Programming | Distributed Technologies | Machine Learning | Mobile App Development | Information Systems Management",
  },
  {
    school: "Technical University of Košice",
    degree: "BSc. Business Informatics",
    period: "2020 — 2023",
    note: "Algorithms and Programming | Web Development | Database Systems | Mobile Development | Probability and Mathematical Statistics | Data Analytics | Information System Design",
  },
];