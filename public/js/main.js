const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// Get user and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// join chatRoom
socket.emit("joinRoom", { username, room });

// Get users and room
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message From Server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emits message to the server
  socket.emit("chatMessage", msg);

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.value.focus();
});

// Output Message To DOM
function outputMessage(message) {
  const div = document.createElement("div"); // create a div to put the message in it.
  div.classList.add("message"); // add the class 'message' to the div.
  // Put some html elements to the div.
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div); // put the entire div on the 'chat-message' container.
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add Users to DOM
function outputUsers(users) {
  usersList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
