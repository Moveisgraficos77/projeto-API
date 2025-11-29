const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// serve static
app.use(express.static(path.join(__dirname, "public")));

// simple in-memory contacts + messages store (for testing only)
const contacts = [
  { id: "alice", name: "Alice" },
  { id: "bob", name: "Bob" },
  { id: "carol", name: "Carol" },
];

const messages = new Map(); // roomId -> [messages]

app.get("/api/contacts", (req, res) => {
  // attach lastMessage preview
  const list = contacts.map((c) => ({
    ...c,
    lastMessage: (messages.get(c.id) || []).slice(-1)[0]?.text || "",
  }));
  res.json(list);
});

app.get("/api/messages/:room", (req, res) => {
  const room = req.params.room;
  res.json(messages.get(room) || []);
});

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
  });

  socket.on("message", (m) => {
    // m: {room, text, sender, ts}
    const room = m.room;
    if (!messages.has(room)) messages.set(room, []);
    messages.get(room).push(m);
    io.to(room).emit("message", m);
  });
});

server.listen(PORT, () => {
  console.log(`GtubeMenssager server running on http://localhost:${PORT}`);
});
