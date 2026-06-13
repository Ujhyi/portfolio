# Portfolio

A minimal, fast personal portfolio built with Next.js (App Router), TypeScript, and Tailwind CSS v4.

## Edit your content

**You only need to edit one file:** `app/content.ts`

It holds your name, role, tagline, links, about text, skills, projects, and experience. Change the values there and the whole site updates. Comments in the file explain each field.

- Hide a section: set `experience` to `[]`, or set a social link to `""`.
- Featured project: the first project with `featured: true` gets the big card.
- Resume: drop a `resume.pdf` into the `public/` folder (or set `socials.resume` to `""`).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Deploy (free)

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com, "Add New → Project", import the repo.
3. Vercel auto-detects Next.js — just click Deploy.
4. Every push to `main` redeploys automatically. Add a custom domain in project settings.

## Customize the look

- **Colors / fonts:** the design tokens live at the top of `app/globals.css` (`--bg`, `--ink`, `--accent`, etc.). Change `--accent` to recolor the whole site.
- **Layout / structure:** `app/page.tsx`.

## Tech

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
