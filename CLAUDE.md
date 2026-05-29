# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # local dev server at localhost:5173/bitacora/
npm run build     # production build → dist/
npm run lint      # ESLint
npm run preview   # preview the production build locally
```

No test suite is configured.

## Deploy

Every push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages automatically.  
Live URL: **https://automatizacion-it.github.io/bitacora/**

To manually re-trigger: `gh workflow run deploy.yml --repo automatizacion-it/bitacora`

## Architecture

**Static data + localStorage hybrid.** There are two sources of projects:

- `src/data/projects.json` — static baseline projects (no repo URLs; edit manually and push to update)
- `localStorage` (`bitacora_projects` key) — projects imported at runtime via the sandbox UI

`src/hooks/useProjects.js` merges both sources: static projects come first; imported projects are deduplicated by `id`. Static projects cannot be removed from the UI (no `_account` field). Imported projects have `_account: username` and can be removed.

**GitHub account sandbox flow:**
1. `AccountsPanel` validates a GitHub username via `GET /users/:username`, saves to `localStorage` (`bitacora_accounts`)
2. Clicking a saved account opens `RepoPickerModal`, which fetches `GET /users/:username/repos?per_page=100&sort=updated`
3. User configures estado/progreso/notas and adds the repo — stored in `localStorage` with `id: "${username}-${repoName}"` and `repo: html_url` (real GitHub URL)

**Project estado values:** `corriendo` | `pausado` | `backlog` | `completado`  
`StatusBadge` uses an animated ping dot for `corriendo`. `ProjectCard` shows the GitHub icon on all cards — active/clickable when `repo` is set, grayed out when empty.

## Key constraint

`vite.config.js` has `base: '/bitacora/'` — required for GitHub Pages. Do not remove it. All asset paths in `index.html` or dynamic imports must be relative or use the Vite `base` correctly.
