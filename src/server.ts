import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Armazena os clientes conectados
const clients = new Set<WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  clients.add(ws);
  console.log("Client connected.");

  ws.on("message", (message: string) => {
    console.log(`Received: ${message}`);

    // Envia a mensagem para todos os clientes conectados
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("Client disconnected.");
  });
});

app.use(express.static("public"));

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
