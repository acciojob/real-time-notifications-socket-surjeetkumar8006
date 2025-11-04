const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");
const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/";
let socket;
let reconnectTimer = null;

// Function to display messages in notifications area
const displayNotification = (message) => {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = message;
  notificationsDiv.appendChild(msgDiv);
};

// Function to connect WebSocket
const connectWebSocket = () => {
  socket = new WebSocket(wsUrl);

  socket.addEventListener("open", () => {
    statusDiv.textContent = "Connected";
    messageInput.disabled = false;
    sendButton.disabled = false;
    disconnectButton.disabled = false;
    displayNotification("Connected to WebSocket server");
  });

  socket.addEventListener("message", (event) => {
    displayNotification(`Received: ${event.data}`);
  });

  socket.addEventListener("close", () => {
    statusDiv.textContent = "Disconnected";
    messageInput.disabled = true;
    sendButton.disabled = true;
    disconnectButton.disabled = true;
    displayNotification("Disconnected from server, retrying in 10s...");

    // Reconnect automatically after 10 seconds
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connectWebSocket();
      }, 10000);
    }
  });

  socket.addEventListener("error", () => {
    displayNotification("Error occurred, closing connection...");
    socket.close();
  });
};

// Send message when connected
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    displayNotification(`Sent: ${message}`);
    messageInput.value = "";
  } else {
    displayNotification("Cannot send, not connected to server.");
  }
});

// Manual disconnect
disconnectButton.addEventListener("click", () => {
  if (socket) {
    socket.close();
    displayNotification("Manually disconnected from server.");
  }
});

connectWebSocket();
