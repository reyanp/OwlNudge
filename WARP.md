# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: Vite + React + TypeScript, Tailwind CSS, shadcn/ui (Radix primitives), TanStack Query
- Entry points: index.html → src/main.tsx → src/App.tsx
- Router: react-router-dom with routes for “/” and a catch-all NotFound
- Alias: @ → ./src (vite.config.ts and tsconfig paths)
- Dev server: Vite on port 8080, host "::" (IPv6/all interfaces)

Commands
- Install dependencies (per README):
  - npm install
- Start dev server (Vite):
  - npm run dev
  - Opens on http://localhost:8080 (configured in vite.config.ts)
- Build production bundle:
  - npm run build
  - Development-mode build (useful for debugging prod build issues): npm run build:dev
- Preview built app locally:
  - npm run preview
- Lint TypeScript/React:
  - npm run lint

Notes about package managers
- This repo includes both package-lock.json (npm) and bun.lockb (Bun). The README uses npm, so default to npm for installs and scripts. If the team standardizes on Bun:
  - bun install
  - bun dev
  - bun run build
  - bunx eslint .

Testing
- No test script or framework is configured in package.json. If asked to run tests or a single test, surface that tests are not set up yet.

High-level architecture and structure
- Application shell and providers
  - src/main.tsx mounts <App /> into #root.
  - src/App.tsx wraps the app with:
    - QueryClientProvider (TanStack Query) for future data fetching/caching.
    - TooltipProvider and two toast systems:
      - src/components/ui/toaster (shadcn-style toasts via use-toast hook)
      - src/components/ui/sonner (Sonner Toaster with next-themes integration)
    - BrowserRouter with routes:
      - “/” → src/pages/Index.tsx → Dashboard
      - “*” → src/pages/NotFound.tsx
- Routing
  - Minimal route table in App.tsx. New pages should be added above the catch-all “*” route.
- UI system (design primitives)
  - src/components/ui/* contains the shadcn-generated component wrappers over Radix (e.g., button, card, dialog, sheet, tabs, tooltip, toast, etc.). These are reusable building blocks; application logic should live outside this folder.
- Feature/domain components
  - src/components/Dashboard.tsx: Top-level composed page for the Index route. Orchestrates:
    - Financial metrics (FinancialMetric + MetricValue)
    - Agent list (AgentCard) with mock agent state
    - Notifications affordances (NotificationsButton + NotificationsDrawer)
  - src/components/notifications/NotificationsDrawer.tsx: Right-side drawer using Sheet + Tabs + ScrollArea. Accepts a notifications array and handles:
    - Partitioning into Alerts vs Messages
    - Mark-all-read and per-item read
    - Action-required flow (delegates onTakeAction up to the parent)
    - Uses Sonner toasts for quick feedback (optimistic mark-as-read)
  - src/components/NotificationCenter.tsx: Alternate card-style center listing notifications by agent/type with quick actions.
  - src/components/AgentCard.tsx: Visual card for each agent (Sofia, Marcus, Luna). Click triggers onChat from the parent.
  - src/components/FinancialMetric.tsx + src/components/MetricValue.tsx: Display numeric values compactly with tooltip exposing full precision; handles currency/percent/number formats.
- Hooks and utilities
  - src/hooks/use-toast.ts: Toast state manager used by shadcn Toaster (separate from Sonner). Limits concurrent toasts and manages dismiss/remove.
  - src/hooks/use-mobile.tsx: Simple window.matchMedia hook for responsive checks.
  - src/lib/utils.ts: cn() utility using clsx + tailwind-merge.
  - src/lib/number-format.ts: Locale-aware formatting helpers for compact/full display across currencies, percent, and numbers.
- Styling and theming
  - Tailwind is configured in tailwind.config.ts with content globs and significant theme extensions.
  - src/index.css defines a comprehensive CSS variable-based theme (colors, gradients, shadows, radii) and a set of component/utility classes (e.g., card-* styles, animations). This is the source of the “finance” look and feel.
  - next-themes is present and used by the Sonner Toaster to respect theme; dark mode variables exist in index.css.
- Configuration
  - vite.config.ts:
    - Dev server host "::" and port 8080
    - @ alias → ./src
    - lovable-tagger plugin enabled in development
  - tsconfig.json and tsconfig.app.json set baseUrl and paths for @/*, and use bundler module resolution for Vite.

Conventions Warp should follow here
- Use the @ alias for imports from src (e.g., import { Button } from "@/components/ui/button").
- When adding new UI, prefer composing from components in src/components/ui first; place feature logic/components in src/components (not under ui).
- If asked to add testing, coordinate with the team to choose a runner (Vitest is typical with Vite) and wire scripts into package.json (e.g., test, test:watch). Until then, do not assume tests exist.
- Be aware two toast systems exist (shadcn toast and Sonner). New global, app-level notifications typically go through Sonner; component-scoped toasts may use the shadcn hook.
