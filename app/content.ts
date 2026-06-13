// ============================================================
//  EDIT THIS FILE TO CUSTOMIZE YOUR PORTFOLIO
//  Everything the site displays comes from here.
// ============================================================

export const profile = {
  name: "Your Name",
  role: "Software Engineer", // e.g. "Full-Stack Developer", "DevOps Engineer"
  // One or two sentences. Your pitch — what you do and what you care about.
  tagline:
    "I build reliable web applications and tooling. I care about clean systems, good developer experience, and shipping things that hold up in production.",
  location: "City, Country",
  email: "you@example.com",
  // Set any of these to "" to hide the link.
  socials: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    resume: "/resume.pdf", // put a resume.pdf in the /public folder, or set to ""
  },
};

// A short "about" paragraph. Keep it human.
export const about =
  "I'm a developer with a few years in the IT industry, focused on backend and full-stack work. I enjoy untangling messy problems, automating the boring parts, and learning whatever the job needs. Outside of work I tinker with side projects and contribute to open source.";

// Group your skills however you like. Add or remove groups freely.
export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "Python", "Go", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "REST", "Docker"] },
  { group: "Tools", items: ["Git", "Linux", "CI/CD", "AWS"] },
];

// Your projects. The first one with `featured: true` gets a bigger treatment.
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
    year: "2024",
    blurb:
      "What it is, why you built it, and what was interesting or hard about it. One or two sentences is plenty.",
    tech: ["Python", "FastAPI", "Redis"],
    links: [
      { label: "Code", href: "https://github.com/yourusername/project-two" },
    ],
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
  company: string;
  period: string;
  note: string;
}[] = [
  {
    role: "Software Engineer",
    company: "Company Name",
    period: "2023 — Present",
    note: "One line on what you do or shipped here.",
  },
  {
    role: "Junior Developer",
    company: "Earlier Company",
    period: "2021 — 2023",
    note: "One line on your impact or growth.",
  },
];
