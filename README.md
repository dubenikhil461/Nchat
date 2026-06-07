# Nchat

A minimal real-time chat app built with Node.js and WebSockets.

## Features

- Simple web UI for sending and receiving messages
- WebSocket server that broadcasts messages to all connected clients
- Auto-reload during development with `node --watch`

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

Open [http://localhost:7021](http://localhost:7021) in your browser. Open multiple tabs or windows to chat between clients.

To use a different port:

```bash
PORT=8080 npm start
```

## Project structure

```
Nchat/
├── public/
│   └── client.html   # Chat UI
├── src/
│   └── sever.js      # HTTP + WebSocket server
└── package.json
```

## Tech stack

- **Node.js** — HTTP server
- **ws** — WebSocket library


src/
│
├── app.js
├── server.js
│
├── config/
│   ├── db.js
│   ├── redis.js
│
├── modules/
│   │
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.repository.js
│   │   ├── auth.routes.js
│   │   └── auth.validation.js
│   │
│   ├── user/
│   │   ├── user.controller.js
│   │   ├── user.service.js
│   │   ├── user.repository.js
│   │   └── user.routes.js
│   │
│   ├── message/
│   │   ├── message.controller.js
│   │   ├── message.service.js
│   │   ├── message.repository.js
│   │   └── message.routes.js
│   │
│   └── websocket/
│       ├── websocket.server.js
│       ├── websocket.handler.js
│       └── online-users.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── logger.middleware.js
│
├── utils/
│   ├── jwt.js
│   ├── password.js
│   └── cookie.js
│
├── schemas/
│   ├── auth.schema.js
│   └── message.schema.js
│
└── constants/
    └── websocket-events.js