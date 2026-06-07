import { createServer } from "node:http";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, "..", "public", "client.html");

const port = process.env.PORT ?? 7021;
const server = createServer(async (req, res) => {
  try {
    const index = await fs.readFile(indexPath, "utf-8");
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    res.end(index);
  } catch (err) {
    console.error(err);
  }
});

const wss = new WebSocketServer({ server: server });
wss.on("connection", (ws) => {
  console.log("client connected");
  ws.on("message", (data) => {
    console.log(data.toString());
    wss.clients.forEach((client)=>{
        client.send(data.toString())
    })
  }),
    ws.on("close", () => {
      console.log("Client disconnected");
    });
});

server.listen(port, () => {
  console.log(`server is runinng http://localhost:${port}`);
});
