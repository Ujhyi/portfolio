export const profile = {
  name: "David Ujhelyi",
  role: "devops Engineer", 
  tagline:
    "Engineer working across IT infrastructure and platform operations, focused on keeping systems reliable at scale. I also build AI-powered proof-of-concepts to explore what's next.",
  location: "City, Country",
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
};

export const projects: Project[] = [
  {
    title: "Project One",
    year: "2025",
    blurb:
      "A short, concrete description of what it does and the problem it solves. Mention scale or impact if you can — users, requests, time saved.",
    tech: ["Next.js", "PostgreSQL", "Docker"],
    links: [
      { label: "Live", href: "https://example.com" },
      { label: "Code", href: "https://github.com/yourusername/project-one" },
    ],
    featured: true,
  },
  {
    title: "Project Two",
    year: "2025",
    blurb:
      "A short, concrete description of what it does and the problem it solves. Mention scale or impact if you can — users, requests, time saved.",
    tech: ["Next.js", "PostgreSQL", "Docker"],
    links: [
      { label: "Live", href: "https://example.com" },
      { label: "Code", href: "https://github.com/yourusername/project-one" },
    ],
    featured: true,
  },
  {
    title: "Project Three",
    year: "2024",
    blurb:
      "Replace this with a real project. Recruiters read these first — be specific and lead with the outcome.",
    tech: ["Go", "gRPC", "Kubernetes"],
    links: [
      { label: "Code", href: "https://github.com/yourusername/project-three" },
    ],
  },
];

// Optional: work history. Set to [] to hide the section entirely.
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
    note: "External engineer for Slovak Telecom, focused on developing and automating OTT TV platform services alongside day-to-day operations.",
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
    company: "Deatusche Telekom IT Solution ",
    city: "Kosice",
    period: "2023 — 2024",
    note: "Independently managed change and incident tickets (ITIL-based) to keep services within SLAs across Azure, VMware, and RHEL/CentOS environments.",
  },
];
