import { createServer } from "node:http";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express from "express";
import { WebSocketServer } from "ws";
import authRoutes from "./modules/auth/auth.routes.ts";
import userRoutes from "./modules/user/user.routes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, "..", "public", "client.html");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", async (_req, res) => {
  try {
    const index = await fs.readFile(indexPath, "utf-8");
    res.type("html").send(index);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load chat UI");
  }
});

const port = process.env.PORT ?? 7021;
const server = createServer(app);

const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("client connected");
  ws.on("message", (data) => {
    console.log(data.toString());
    wss.clients.forEach((client) => {
      client.send(data.toString());
    });
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});
