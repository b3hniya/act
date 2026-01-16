# Dashboard

React frontend application built with Vite.

## Running Locally

```bash
# From monorepo root
pnpm dev:dashboard

# Or directly
cd apps/dashboard
pnpm dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Script           | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start dev server         |
| `pnpm build`     | Build for production     |
| `pnpm preview`   | Preview production build |
| `pnpm lint`      | Lint code                |
| `pnpm format`    | Format code              |
| `pnpm typecheck` | Type check               |

## Environment Variables

Create a `.env` file for local development:

| Variable       | Description    | Default                 |
| -------------- | -------------- | ----------------------- |
| `VITE_API_URL` | API server URL | `http://localhost:3000` |

## Project Structure

```
src/
├── assets/        # Static assets (images, fonts)
├── App.tsx        # Root component
├── App.css        # App styles
├── main.tsx       # Entry point
└── index.css      # Global styles
```

## Building for Production

```bash
pnpm build
```

Output is generated in `dist/` directory.

## Preview Production Build

```bash
pnpm build
pnpm preview
```
