# Fusion Starter

A production-ready full-stack React application template with integrated Express server.

## Tech Stack

- **Frontend**: React 18, React Router 6, TypeScript, Vite, TailwindCSS 3, Radix UI
- **Backend**: Express
- **Testing**: Vitest
- **Tooling**: PNPM

## Quick Start

```bash
pnpm install
pnpm dev        # Start dev server (client + server) on port 8080
```

## Project Structure

- `client/`: React SPA frontend
- `server/`: Express API backend
- `shared/`: Shared types

## Features

- **SPA Routing**: React Router 6 setup in `client/App.tsx`.
- **API**: Express backend with routes in `server/routes/`.
- **Styling**: TailwindCSS + Radix UI components.
- **Type Safety**: Shared types between client and server.

## Development Commands

- **Build**: `pnpm build`
- **Test**: `pnpm test`
- **Typecheck**: `pnpm typecheck`

## Production Deployment

Standard build via `pnpm build`. Compatible with Netlify, Vercel, or containerized environments.
