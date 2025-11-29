(() => {
  const socket = io();
  let currentRoom = null;

  const contactsEl = document.getElementById("contacts");
  const messagesEl = document.getElementById("messages");
  const chatTitleEl = document.getElementById("chat-title");
  const form = document.getElementById("message-form");
  const input = document.getElementById("message-input");

  const renderContacts = (contacts) => {
    contactsEl.innerHTML = "";
    contacts.forEach((c) => {
      const el = document.createElement("div");
      el.className = "contact";
      el.innerHTML = `
        <div class="avatar">${c.name[0].toUpperCase()}</div>
        <div class="meta">
          <div class="name">${c.name}</div>
          <div class="last">${c.lastMessage || ""}</div>
        </div>`;
      el.addEventListener("click", () => selectContact(c));
      contactsEl.appendChild(el);
    });
  };

  const renderMessages = (messages) => {
    messagesEl.innerHTML = "";
    messages.forEach((m) => appendMessage(m));
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const appendMessage = (m) => {
    const el = document.createElement("div");
    el.className = "msg " + (m.out ? "out" : "in");
    el.innerHTML = `<div class="body">${escapeHtml(
      m.text
    )}</div><span class="meta-time">${new Date(
      m.ts
    ).toLocaleTimeString()}</span>`;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/\'/g, "&#039;");
  }

  async function loadContacts() {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    renderContacts(data);
  }

  async function selectContact(contact) {
    currentRoom = contact.id;
    chatTitleEl.textContent = contact.name;
    // join room
    socket.emit("join", currentRoom);
    const res = await fetch(`/api/messages/${currentRoom}`);
    const data = await res.json();
    renderMessages(data);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || !currentRoom) return;
    const msg = { room: currentRoom, text, sender: "me", ts: Date.now() };
    // append locally
    appendMessage({ ...msg, out: true });
    input.value = "";
    socket.emit("message", msg);
  });

  socket.on("message", (m) => {
    // if message belongs to current room
    if (m.room === currentRoom) appendMessage({ ...m, out: m.sender === "me" });
  });

  // initial load
  loadContacts();

  // basic presence notification
  socket.on("connect", () => console.log("Conectado ao servidor"));
})();
