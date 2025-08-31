// LOCAL STORAGE
if (!localStorage.getItem("users")) localStorage.setItem("users", "[]");
if (!localStorage.getItem("chats")) localStorage.setItem("chats", "[]");

// MODAL LOGIC
document.getElementById("startBtn").onclick = () => {
  document.getElementById("welcomeStep").classList.add("hidden");
  document.getElementById("instructionsStep").classList.remove("hidden");
};
document.getElementById("nextInstrBtn").onclick = () => {
  document.getElementById("instructionsStep").classList.add("hidden");
  document.getElementById("authStep").classList.remove("hidden");
};

// LOGIN / SIGNUP TOGGLE
document.getElementById("gotoSignUp").onclick = () => {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
};
document.getElementById("gotoLogin").onclick = () => {
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
};

// SIGNUP
document.getElementById("signupBtn").onclick = () => {
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  let users = JSON.parse(localStorage.getItem("users"));
  if (users.find(u => u.username === username)) { alert("User exists!"); return; }
  users.push({ username, password, balance: 1, displayName: "", profilePic: "default.png" });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered! Login now");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
};

// LOGIN
document.getElementById("loginBtn").onclick = () => {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  let users = JSON.parse(localStorage.getItem("users"));
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("mainSwipe").classList.remove("hidden");
    loadProfile();
    loadStore();
    loadChats();
  } else alert("Invalid login");
};

// PROFILE
function loadProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  document.getElementById("profilePic").src = user.profilePic;
  document.getElementById("displayName").value = user.displayName;
}

document.getElementById("saveProfileBtn").onclick = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  user.displayName = document.getElementById("displayName").value;
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert("Profile Saved!");
};

// STORE
function loadStore() {
  const store = [{ id: 1, name: "Red Theme", price: 5 }, { id: 2, name: "Cool Sticker", price: 2 }];
  const container = document.getElementById("storeItems");
  container.innerHTML = "";
  store.forEach(item => {
    const div = document.createElement("div");
    div.className = "store-item";
    div.innerHTML = `<span>${item.name} - $${item.price}</span><button onclick="buyItem(${item.id})">Buy</button>`;
    container.appendChild(div);
  });
}

function buyItem(id) {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  const item = id === 1 ? { price: 5 } : { price: 2 };
  if (user.balance >= item.price) { user.balance -= item.price; localStorage.setItem("currentUser", JSON.stringify(user)); alert("Item bought!"); }
  else alert("Not enough balance!");
}

// CHATS
function loadChats() {
  const chatList = document.getElementById("chatList");
  chatList.innerHTML = "";
  const users = JSON.parse(localStorage.getItem("users"));
  users.forEach(u => {
    const div = document.createElement("div");
    div.textContent = u.username;
    div.onclick = () => openChat(u.username);
    chatList.appendChild(div);
  });
}

function openChat(username) {
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";
  const chats = JSON.parse(localStorage.getItem("chats"));
  chats.filter(c => c.to === username || c.from === username).forEach(m => {
    const div = document.createElement("div");
    div.className = "message " + (m.from === JSON.parse(localStorage.getItem("currentUser")).username ? "self" : "other");
    div.textContent = m.text;
    chatBox.appendChild(div);
  });
  document.getElementById("sendBtn").onclick = () => {
    const input = document.getElementById("chatInput");
    const text = input.value;
    if (!text) return;
    chats.push({ from: JSON.parse(localStorage.getItem("currentUser")).username, to: username, text });
    localStorage.setItem("chats", JSON.stringify(chats));
    input.value = "";
    loadChats();
    openChat(username);
  };
}

// POST FEATURE
document.getElementById("postBtn").onclick = () => {
  const content = document.getElementById("postContent").value;
  const tags = document.getElementById("postHashtags").value;
  if (!content) return;
  const posts = document.getElementById("posts");
  const div = document.createElement("div");
  div.className = "post";
  div.innerHTML = `<p>${content}</p><p style="color:#ff0">${tags}</p><p>Views:1.1B Likes:1.1B</p>`;
  posts.prepend(div);
  document.getElementById("postContent").value = "";
  document.getElementById("postHashtags").value = "";
}

// GO LIVE SIMULATION
document.getElementById("goLive").onclick = () => {
  alert("You are now live! 🎥");
}
