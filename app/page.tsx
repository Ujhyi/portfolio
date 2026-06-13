import {
  profile,
  about,
  skills,
  projects,
  experience,
} from "./content";

export default function Home() {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      {/* ---------- HERO ---------- */}
      <header className="mb-24">
        <p className="font-mono text-sm text-[var(--accent)] mb-4">
          ~/{profile.role.toLowerCase().replace(/\s+/g, "-")}
        </p>
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          {profile.name}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-xl">
          {profile.tagline}
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-4 hover:decoration-[var(--accent)] transition-colors"
          >
            email
          </a>
          {profile.socials.github && (
            <a href={profile.socials.github} className="text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-4 hover:decoration-[var(--accent)] transition-colors">
              github
            </a>
          )}
          {profile.socials.linkedin && (
            <a href={profile.socials.linkedin} className="text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-4 hover:decoration-[var(--accent)] transition-colors">
              linkedin
            </a>
          )}
          {profile.socials.resume && (
            <a href={profile.socials.resume} className="text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-4 hover:decoration-[var(--accent)] transition-colors">
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
        {featured && (
          <article className="mb-10 rounded-lg border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 mb-3 rounded-full border border-[var(--featured)] px-2.5 py-0.5 font-mono text-xs font-medium tracking-wider text-[var(--featured)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--featured)]" />
                  featured
                </span>
                <h3 className="text-2xl font-semibold tracking-tight">
                  {featured.title}
                </h3>
              </div>
              <span className="font-mono text-sm text-[var(--muted)] shrink-0">
                {featured.year}
              </span>
            </div>
            <p className="mt-3 text-[var(--muted)] leading-relaxed">
              {featured.blurb}
            </p>
            <TechRow tech={featured.tech} />
            <LinkRow links={featured.links} />
          </article>
        )}

        <ul className="divide-y divide-[var(--line)]">
          {rest.map((p) => (
            <li key={p.title} className="py-6 first:pt-0">
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
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------- EXPERIENCE ---------- */}
      {experience.length > 0 && (
        <Section label="experience">
          <ul className="space-y-6">
            {experience.map((e) => (
              <li key={e.company} className="flex flex-col sm:flex-row sm:gap-8">
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
                      · {e.company} · {e.city}
                    </span>
                  </p>
                  <p className="text-[var(--muted)] mt-1">{e.note}</p>
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

function LinkRow({ links }: { links: { label: string; href: string }[] }) {
  if (!links.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-4 font-mono text-sm">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-4 hover:decoration-[var(--accent)] transition-colors"
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
