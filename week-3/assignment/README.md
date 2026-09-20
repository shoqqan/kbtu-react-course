# Week 3 — Personal SPA (About Me)

A single-page self-promotional site built with **React 19 + TypeScript + Vite**.

**Live:** https://shoqqan.github.io/kbtu-react-course/

## What's inside

- **Hero** — name, photo, role and call-to-action buttons.
- **AboutMe** — bio + tech stack rendered from an array.
- **Contact** — safe contacts only (GitHub, `Almaty, Planet Earth`, status). No phone, no address.
- **ThemeToggle** — light/dark theme via `useTheme()` (`useState` + `useEffect` + `localStorage`),
  the initial value follows the system `prefers-color-scheme`.

## Structure

```
src/
  app/ui/        entry point, global styles, page shell
  shared/
    lib/         useTheme hook
    ui/          Icon, ThemeToggle
  widgets/
    hero/        Hero
    about-me/    AboutMe
    contact/     Contact
```

Each widget exposes its component through an `index.ts` public API; styles are CSS Modules.

## Scripts

```bash
pnpm install
pnpm dev       # http://localhost:5173/kbtu-react-course/
pnpm build     # type-check + production build into dist/
pnpm preview   # serve the production build locally
pnpm lint      # oxlint
pnpm deploy    # build + publish dist/ to the gh-pages branch
```

## Deployment

`pnpm deploy` builds the app and pushes `dist/` to the `gh-pages` branch of this repository.
The Vite `base` is set to `/kbtu-react-course/` to match the GitHub Pages path.

One-time setup in the repository: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `root`**.

## Replacing the photo

The hero currently uses a generated placeholder at `src/widgets/hero/assets/avatar.svg`.
Drop your own image next to it and change the single import in `src/widgets/hero/ui/hero.tsx`.
