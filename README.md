# TheBotCompany

Human-free software development with self-organizing AI agent teams.

## Features

- **Human-free execution** — Agents plan, discuss, research, and implement autonomously across full development cycles
- **Self-organizing teams** — AI managers (Athena, Ares, Apollo) plan, implement, and verify milestones without human intervention
- **Multi-project** — Manage multiple repos from one central orchestrator with independent cycles
- **Full observability** — Watch agents work through GitHub PRs and issues; every decision, discussion, and code change is visible
- **Budget controls** — 24-hour rolling budget limiter with per-agent cost tracking
- **Unified dashboard** — Monitor all projects, agents, issues, and PRs in one place (mobile-friendly, dark mode, push notifications)

![TheBotCompany Dashboard](screenshot.png)
*Monitor agents, costs, issues, and reports across all your projects from a single dashboard.*

## Prerequisites

- **Node.js** ≥ 20
- **[Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)** (`claude`) — installed and authenticated
- **[GitHub CLI](https://cli.github.com/)** (`gh`) — installed and authenticated

## Quick Start

```bash
# Install globally
npm install -g thebotcompany

# Start the orchestrator + dashboard (first run will prompt for password and port)
tbc start
```

Add projects through the dashboard UI, then start the orchestrator.

## Technical Architecture

```mermaid
graph TD
  U[User / Operator] --> CLI[tbc CLI]
  CLI --> S[Orchestrator Server<br/>src/server.js]
  S --> PR[ProjectRunner x N]
  PR --> AR[Agent Runner<br/>src/agent-runner.js]
  AR --> AI[LLM Providers<br/>Anthropic/OpenAI/Google/MiniMax]
  PR --> DB[(SQLite<br/>project.db)]
  PR --> GH[GitHub APIs / gh CLI]
  S --> API[REST + SSE APIs]
  API --> UI[Monitor Frontend<br/>React + Vite]
  UI --> U
```

- **CLI (`tbc`)** starts/stops/dev-runs the system.
- **Orchestrator (`src/server.js`)** hosts APIs, manages projects, and drives cycle execution.
- **ProjectRunner** executes milestone phases and coordinates managers/workers.
- **Agent Runner (`src/agent-runner.js`)** handles tool-use loops and model calls.
- **SQLite (`project.db`)** stores issues, comments, reports, and runtime metadata.
- **Monitor (`monitor/`)** visualizes status, reports, issues, costs, and controls in real time.

## Runtime Process Flow

```mermaid
flowchart TD
  A[Start: tbc start / tbc dev] --> B[Load projects & config]
  B --> C[Initialize ProjectRunner for each project]
  C --> D[Cycle loop begins]
  D --> E[Athena: strategy / milestone planning]
  E --> F[Ares: implementation orchestration]
  F --> G[Workers execute tasks<br/>code/tools/PR updates]
  G --> H[Persist reports/issues/comments]
  H --> I[Apollo: verification]
  I --> J{Milestone passed?}
  J -- Yes --> K[Advance epoch / next milestone]
  J -- No --> L[Back to implementation with fixes]
  K --> M[Broadcast status via SSE]
  L --> M
  M --> D
```

### Flow Explanation

1. **Startup**: CLI boots server and loads projects.
2. **Initialization**: Each project gets an isolated runner and state context.
3. **Planning (Athena)**: Define or refine milestone goals.
4. **Execution (Ares + Workers)**: Decompose work and run implementation cycles.
5. **Persistence**: Save outputs (reports/issues/comments/cost metadata) to project DB.
6. **Verification (Apollo)**: Validate milestone completion and quality.
7. **Transition**: Pass → next milestone; Fail → return to implementation loop.
8. **Observability**: APIs + SSE stream live state to the Monitor dashboard.

## CLI Reference

```bash
tbc start                   # Start orchestrator + dashboard (background)
tbc stop                    # Stop orchestrator
tbc dev                     # Start in dev mode (foreground + Vite HMR)
tbc status                  # Show running status
tbc logs [n]                # Show last n lines of logs (default 50)
```

## Dashboard

The dashboard provides:

- **Project overview** — Status, phase, milestone progress, cycle count
- **Agent reports** — Full history of agent outputs with markdown rendering
- **Issue tracker** — SQLite-backed issues (agents communicate via issues, not GitHub issues for internal coordination)
- **PR monitoring** — Live GitHub PR status
- **Cost tracking** — Per-agent and per-project cost breakdown (last call, average, 24h, total)
- **Controls** — Pause/resume, skip agent, bootstrap, configure settings
- **Notifications** — Browser push notifications for milestones, verifications, and errors
- **Settings** — Theme (light/dark/system), auth token management, notification preferences

### Authentication

The dashboard has read-only mode by default. Enter the password (set during first-run setup) via the login button to enable write operations (pause, resume, config changes, etc.).

## Development

```bash
# Clone the repo
git clone https://github.com/syifan/thebotcompany.git
cd thebotcompany

# Install dependencies
npm install
cd monitor && npm install && cd ..

# Run in dev mode (server + Vite HMR)
tbc dev

# Or run components separately
node src/server.js                # Server only
cd monitor && npm run dev         # Dashboard only (proxies API to :3100)

# Build dashboard for production
cd monitor && npm run build
```

## License

[MIT](LICENSE)
