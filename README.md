# AI Task Assistant

A portfolio project demonstrating production-style React + AI integration: streaming
chat, document Q&A with retrieval, and an agent task runner with human-in-the-loop
approval checkpoints.

> Status: architecture scaffolded, features are being built incrementally (one per
> commit). Screenshots/GIF will be added once the chat UI is in place.

## Tech stack

- **Next.js** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Redux Toolkit** + RTK Query for state and data fetching
- **OpenAI SDK**, called only from Next.js Route Handlers — never exposed client-side
- **Zod** for runtime validation of all LLM structured outputs and env vars
- **Vitest** + React Testing Library (unit), **Playwright** (e2e), **Storybook** (components)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then set OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run typecheck      # tsc --noEmit
npm run lint            # eslint
npm run test             # vitest unit project (jsdom + React Testing Library)
npm run test:e2e        # playwright
npm run storybook       # component explorer on :6006
npm run build            # production build
```

## Architecture

```
app/                     Routing only (App Router pages, layouts, route handlers)
components/ui/           shadcn/ui primitives (generated, not hand-edited)
features/
  chat/                  components/ hooks/ api/ types/
  documents/             components/ hooks/ api/ types/
  agent-tasks/           components/ hooks/ api/ types/
lib/
  ai/                    Single service layer wrapping all LLM calls
                          (completion, streaming, embeddings) — no direct SDK
                          calls from components or route handlers
  redux/                 Store assembly (store.ts, hooks.ts, provider.tsx).
                          Feature state lives in each feature's own slice,
                          not in a global god-state.
  env.ts                 Zod-validated environment variables
e2e/                      Playwright specs
```

**Rules that shape this layout:**

- Every LLM call goes through `lib/ai` — components and route handlers never import
  the OpenAI SDK directly.
- Data-fetching and streaming logic lives in custom hooks (`useChatStream`,
  `useAgentTask`, …) inside each feature's `hooks/` folder — components stay
  presentational.
- API contracts are typed end-to-end: a Zod schema is the source of truth, and the
  TypeScript type is inferred from it, shared between client and server.
- State is feature-scoped (Redux slices per feature), assembled by `lib/redux/store.ts`.

## Testing

- Unit tests (`*.test.ts(x)`) live next to the code they test and run under jsdom via
  `npm run test`.
- Component stories live next to their components and double as Storybook's
  browser-mode test project.
- `e2e/` holds the Playwright flow tests, including the end-to-end "ask a question
  about an uploaded document" scenario.
