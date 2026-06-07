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
