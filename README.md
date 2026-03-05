# GetMyCV

A privacy-first, browser-based CV builder. Users create and edit their CV entirely in the browser — no account, no server storage, no tracking. All data lives in `localStorage` and never leaves the device unless the user explicitly exports it.

**Contact:** [contact@getmycv.ch](mailto:contact@getmycv.ch)

---

## Features

- **Zero server storage** — CV data is saved only in the user's browser (`localStorage`)
- **Auto-save** — changes are debounced and saved to `localStorage` automatically (1 second after last keystroke)
- **Three CV templates** — Classic (serif), Modern (two-column sidebar), Minimal (clean timeline)
- **Live preview** — preview updates in real time as the user types
- **Export options**
  - Download as PDF (client-side via `html2pdf.js`)
  - Download as Word document (client-side via `docx`)
  - Save a JSON backup (also triggered by `Ctrl+S`)
  - Import a previously saved JSON backup
- **Print support** — `@media print` hides all editor UI; browser print dialog shows the CV only
- **Storage warnings** — first-visit banner and a persistent header indicator remind users that data is browser-local

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Plain CSS (no framework) |
| PDF export | `html2pdf.js` (client-side) |
| DOCX export | `docx` npm package (client-side) |
| Storage | `localStorage` (browser) |
| Dev container | Docker + Node 22 Alpine |
| Prod container | Docker multi-stage → nginx Alpine |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Development (hot reload)

```bash
docker compose up
```

The app is available at **http://localhost:5173**. Source files are mounted as a volume so any change you save is reflected instantly.

### Production build (local test)

```bash
docker compose --profile prod up app-prod
```

The production build is served at **http://localhost:8080** via nginx.

### Without Docker

```bash
npm install
npm run dev       # development server
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## Deployment

### Deploy script

```bash
./deploy.sh
```

This script:
1. Builds the production bundle inside the Docker dev container (`npm run build`) — the output lands in `dist/` on your host via the mounted volume
2. Creates `~/www/getmycv.ch` on the remote server if it does not exist
3. Uploads the contents of `dist/` via SCP to `alefunok@sl55.web.hostpoint.ch`

**SSH key required:** `~/.ssh/id_hostpoint_rsa`

### Manual deploy

```bash
npm run build                          # or: docker compose run --rm --no-deps app npm run build
scp -i ~/.ssh/id_hostpoint_rsa -r dist/. alefunok@sl55.web.hostpoint.ch:~/www/getmycv.ch/
```

### Infrastructure notes

The production `Dockerfile` builds a static `dist/` folder and serves it with nginx. Drop the built image behind your existing nginx reverse proxy and Apache setup.

```
Internet → Nginx (reverse proxy) → Apache / nginx container (static files)
```

The `nginx.conf` in this repo is used inside the production Docker container. It handles:
- SPA fallback (all routes → `index.html`)
- Long-term caching for static assets (`js`, `css`, `svg`, etc.)
- Gzip compression

There is no backend required to run the CV builder. If you later add the Raspberry Pi import service, point `/api/` at it from your outer nginx reverse proxy.

---

## Project Structure

```
getmycv_ch/
│
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite config (host: 0.0.0.0 for Docker)
├── tsconfig.json                   # TypeScript config
├── tsconfig.node.json              # TypeScript config for vite.config.ts
├── package.json
│
├── Dockerfile.dev                  # Dev image (Vite dev server, hot reload)
├── Dockerfile                      # Production image (build → nginx)
├── docker-compose.yml              # Dev service + optional prod service
├── nginx.conf                      # nginx config used inside prod container
├── .dockerignore
│
└── src/
    ├── main.tsx                    # React root
    ├── App.tsx                     # Root component, global keyboard shortcuts
    ├── index.css                   # All styles: layout, editor, templates, print
    │
    ├── types/
    │   └── cv.ts                   # All TypeScript types and the EMPTY_CV default
    │
    ├── store/
    │   └── cvStore.ts              # useCVStore hook — state + debounced auto-save
    │
    ├── utils/
    │   ├── storage.ts              # localStorage helpers (save, load, banner state)
    │   ├── export.ts               # exportJSON, exportPDF, exportDOCX, importJSON
    │   ├── formatDate.ts           # Formats YYYY-MM → "Jan 2024"
    │   └── nanoid.ts               # Tiny unique ID generator (no dependency)
    │
    └── components/
        │
        ├── Editor/                 # Tabbed form: Personal / Experience / Education / Skills
        │   ├── index.tsx           # Tab shell, routes to each section
        │   ├── PersonalSection.tsx # Name, email, phone, location, links, summary
        │   ├── ExperienceSection.tsx # Job entries with bullet points
        │   ├── EducationSection.tsx  # Degree entries
        │   └── SkillsSection.tsx   # Skill groups (comma-separated) + languages
        │
        ├── Preview/                # Live CV preview
        │   ├── index.tsx           # Renders the selected template
        │   └── templates/
        │       ├── Classic.tsx     # Traditional serif, centered header
        │       ├── Modern.tsx      # Two-column, dark sidebar
        │       └── Minimal.tsx     # Sans-serif, timeline layout
        │
        ├── StorageBanner.tsx       # Dismissable first-visit warning about localStorage
        ├── StorageIndicator.tsx    # Header chip: "Saved locally · 2m ago"
        ├── TemplatePicker.tsx      # Pill buttons to switch between templates
        └── ExportBar.tsx           # Print / PDF / Word / Backup / Import buttons
```

---

## CV Data Model

All CV data is stored as a single JSON object. The schema is defined in [src/types/cv.ts](src/types/cv.ts).

```ts
{
  personal: {
    name, email, phone, location, website, linkedin, summary
  },
  experience: [
    { id, company, role, location, startDate, endDate, current, bullets[] }
  ],
  education: [
    { id, institution, degree, field, startDate, endDate, grade }
  ],
  skills: [
    { id, category, items[] }
  ],
  languages: [
    { id, language, level }   // level: Native | C2 | C1 | B2 | B1 | A2 | A1
  ],
  projects: []                // reserved for future use
}
```

Dates are stored as `YYYY-MM` strings (from `<input type="month">`).

---

## Adding a Template

1. Create `src/components/Preview/templates/YourTemplate.tsx` — accepts `{ cv: CV }` as props
2. Export a named component, e.g. `export function YourTemplate({ cv }: Props) { ... }`
3. Add it to `src/components/Preview/index.tsx`
4. Add an entry to the `TEMPLATES` array in `src/components/TemplatePicker.tsx`
5. Add the new `TemplateId` value to the `TemplateId` union type in `src/types/cv.ts`

---

## Planned: Raspberry Pi Import Service

For parsing uploaded PDF or DOCX CVs into the JSON data model, a separate FastAPI service is planned to run on a Raspberry Pi 5. It will:

- Accept a `POST /api/parse-cv` multipart upload
- Process the file **in memory only** (nothing written to disk)
- Return structured JSON matching the CV data model above
- Be proxied via the outer nginx reverse proxy at `/api/`

The frontend will send the file, receive the JSON, and load it directly into the editor — no data persisted server-side.

---

## Storage & Privacy Notes

- CV data is stored exclusively in the user's browser via `localStorage` under the key `getmycv_state`
- A `getmycv_banner_dismissed` key tracks whether the user has seen the storage warning
- Clearing browser data, switching browsers, or using private/incognito mode will result in data loss
- Users are warned about this on first visit and via a persistent indicator in the header
- Exporting a JSON backup (`Ctrl+S` or "Save Backup" button) is the recommended way to persist data long-term
