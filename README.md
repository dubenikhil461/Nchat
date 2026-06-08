# Nchat

A real-time chat application built with Node.js and TypeScript. It includes a WebSocket server for live messaging and is being extended with user authentication, persistent messages, MySQL, and Redis.

## Features

**Working today**
- WebSocket server that broadcasts messages to all connected clients
- Drizzle ORM schemas for users (`auth`) and direct messages (`message`)
- Auth module with register and login handlers (repository → service → controller)

**In progress**
- Wiring Express auth routes into the HTTP server
- Persisting messages to MySQL
- Redis pub/sub for scaling WebSockets
- Chat UI (`public/client.html`)

## Tech stack

| Layer | Tools |
|-------|-------|
| Runtime | Node.js 18+ |
| Language | TypeScript |
| HTTP / API | Express |
| Real-time | `ws` (WebSockets) |
| Database | MySQL 8, Drizzle ORM |
| Cache / pub-sub | Redis (`ioredis`) |
| Auth | JWT, password hashing (planned) |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [Docker](https://www.docker.com/) (recommended for MySQL and Redis)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start MySQL and Redis

```bash
docker compose up -d
```

This starts:
- **MySQL** on port `3306` (database: `n_chat_app`)
- **Redis** on port `6379`

### 3. Environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=7021

# MySQL (used by the app via db.ts)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=n_chat_app

# Drizzle Kit migrations (connection URL)
DATABASE_URL=mysql://root@127.0.0.1:3306/n_chat_app

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

For remote databases (e.g. AWS RDS), `db.ts` also accepts `RDS_HOSTNAME`, `RDS_PORT`, `RDS_USERNAME`, `RDS_PASSWORD`, and `RDS_DB_NAME`.

### 4. Run database migrations

```bash
npm run db:generate   # after schema changes
npm run db:migrate
```

## Run

```bash
npx tsx --watch src/app.ts
```

Open [http://localhost:7021](http://localhost:7021). Open multiple tabs to test real-time messaging.

Use a different port:

```bash
PORT=8080 npx tsx --watch src/app.ts
```

> **Note:** `npm start` currently points to `src/app.js`, but the source is TypeScript. Use `tsx` until the start script is updated.

## Auth API

Routes are defined in `src/modules/auth/auth.routes.ts` and will be available once mounted on an Express app:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/register` | Create a new user |
| `POST` | `/login` | Log in by email |

## Database schema

**`auth`** — users

| Column | Description |
|--------|-------------|
| `id` | 6-character user ID (primary key) |
| `name` | Display name |
| `email` | Unique email |
| `password` / `salt_string` | Credentials |
| `isBlocked` | Account status |
| `createdAt` / `updated_at` | Timestamps |

**`message`** — direct messages between two users

| Column | Description |
|--------|-------------|
| `id` | Message UUID (primary key) |
| `sender_id` / `receiver_id` | References `auth.id` |
| `text` | Message content |
| `delivered_at` / `read_at` | Delivery and read timestamps |
| `created_at` | Sent at |

## Project structure

```
Nchat/
├── drizzle/                  # Generated SQL migrations
├── public/
│   └── client.html           # Chat UI (planned)
├── src/
│   ├── app.ts                # HTTP + WebSocket entry point
│   ├── config/
│   │   ├── db.ts             # MySQL connection pool (Drizzle)
│   │   └── redis.ts          # Redis publisher / subscriber
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── auth.repository.ts
│   │       └── auth.routes.ts
│   └── schemas/
│       ├── auth.schema.ts
│       └── message.schema.ts
├── docker-compose.yml
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npx tsc` | Type-check the project |

## Development notes

- Source lives in `src/**/*.ts`. Type-check with `npx tsc` (`noEmit: true` in `tsconfig.json`).
- Local imports use `.ts` extensions (`allowImportingTsExtensions` is enabled).
- Auth follows a layered pattern: **routes → controller → service → repository → database**.
