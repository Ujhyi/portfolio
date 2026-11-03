import ThemeToggle from "./theme-toggle";

import { profile, about, skills, projects, experience, education } from "./content";

// Must match `basePath` in next.config
const BASE_PATH = "/portfolio";

const linkClass =
  "text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-4 hover:decoration-[var(--accent)] transition-colors";

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      {/* ---------- HERO ---------- */}
      <header className="mb-24">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-sm text-[var(--accent)]">
            ~/{profile.role.toLowerCase().replace(/\s+/g, "-")}
          </p>
          <ThemeToggle />
        </div>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          {profile.name}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-xl">
          {profile.tagline}
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
          <a href={`mailto:${profile.email}`} className={linkClass}>
            email
          </a>
          {profile.socials.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              github
            </a>
          )}
          {profile.socials.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              linkedin
            </a>
          )}
          {profile.socials.resume && (
            <a
              href={withBase(profile.socials.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              resume
            </a>
          )}
        </nav>
      </header>

      {/* ---------- ABOUT ---------- */}
      <Section label="about">
        <p className="text-lg leading-relaxed text-[var(--ink)] max-w-2xl">
          {about}
        </p>
      </Section>

      {/* ---------- SKILLS ---------- */}
      <Section label="skills">
        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
          {skills.map((s) => (
            <div key={s.group}>
              <dt className="font-mono text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
                {s.group}
              </dt>
              <dd className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-sm"
                  >
                    {it}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ---------- PROJECTS ---------- */}
      <Section label="projects">
        {featured.map((f) => (
          <article
            key={f.title}
            className="mb-10 rounded-lg border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 mb-3 rounded-full border border-[var(--featured)] px-2.5 py-0.5 font-mono text-xs font-medium tracking-wider text-[var(--featured)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--featured)]" />
                  featured
                </span>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {f.title}
                </h3>
              </div>
              <span className="font-mono text-sm text-[var(--muted)] shrink-0">
                {f.year}
              </span>
            </div>
            <p className="mt-3 text-[var(--muted)] leading-relaxed">
              {f.blurb}
            </p>
            <TechRow tech={f.tech} />
            <LinkRow links={f.links} />
            {f.notes && (
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                {f.notes}
              </p>
            )}
          </article>
        ))}

        <ul className="space-y-6">
          {rest.map((p) => (
            <li
              key={p.title}
              className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-semibold tracking-tight">
                  {p.title}
                </h3>
                <span className="font-mono text-sm text-[var(--muted)] shrink-0">
                  {p.year}
                </span>
              </div>
              <p className="mt-2 text-[var(--muted)] leading-relaxed">
                {p.blurb}
              </p>
              <TechRow tech={p.tech} />
              <LinkRow links={p.links} />
              {p.notes && (
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
                  {p.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- EXPERIENCE ---------- */}
      {experience.length > 0 && (
        <Section label="experience">
          <ul className="space-y-6">
            {experience.map((e) => (
              <li
                key={`${e.company}-${e.period}`}
                className="flex flex-col sm:flex-row sm:gap-8"
              >
                <span className="font-mono text-sm text-[var(--muted)] sm:w-36 shrink-0 mb-1 sm:mb-0">
                  {e.period}
                  <span className="block text-xs opacity-70 mt-0.5">
                    {e.type}
                  </span>
                </span>
                <div>
                  <p className="font-medium">
                    {e.role}{" "}
                    <span className="text-[var(--muted)]">
                      · {e.company} · {e.country} · {e.city}
                    </span>
                  </p>
                  <p className="text-[var(--muted)] mt-1">{e.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ---------- EDUCATION ---------- */}
      {education.length > 0 && (
        <Section label="education">
          <ul className="space-y-6">
            {education.map((ed) => (
              <li
                key={`${ed.school}-${ed.period}`}
                className="flex flex-col sm:flex-row sm:gap-8"
              >
                <span className="font-mono text-sm text-[var(--muted)] sm:w-36 shrink-0 mb-1 sm:mb-0">
                  {ed.period}
                </span>
                <div>
                  <p className="font-medium">
                    {ed.degree}{" "}
                    <span className="text-[var(--muted)]">· {ed.school}</span>
                  </p>
                  {ed.note && (
                    <p className="text-[var(--muted)] mt-1">{ed.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ---------- FOOTER ---------- */}
      <footer className="mt-24 border-t border-[var(--line)] pt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[var(--muted)]">
          Let&apos;s talk —{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-[var(--accent)] underline underline-offset-4"
          >
            {profile.email}
          </a>
        </p>
        <p className="font-mono text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </footer>
    </main>
  );
}

/* ---------- helpers ---------- */

// Adds the GitHub Pages prefix to links that start with "/".
// External links (https://..., mailto:...) are returned unchanged.
function withBase(href: string) {
  return href.startsWith("/") ? `${BASE_PATH}${href}` : href;
}

/* ---------- small reusable pieces ---------- */

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-24">
      <h2 className="font-mono text-xs tracking-[0.2em] text-[var(--accent)] mb-6 flex items-center gap-3">
        ~/{label}
        <span className="h-px flex-1 bg-[var(--line)]" />
      </h2>
      {children}
    </section>
  );
}

function TechRow({ tech }: { tech: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-[var(--muted)]">
      {tech.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  );
}

function LinkRow({ links }: { links?: { label: string; href: string }[] }) {
  if (!links?.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-4 font-mono text-sm">
      {links.map((l) => {
        const external = /^https?:\/\//.test(l.href);
        return (
          <a
            key={l.label}
            href={withBase(l.href)}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className={linkClass}
          >
            {l.label} ↗
          </a>
        );
      })}
    </div>
  );
}