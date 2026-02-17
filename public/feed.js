// ------------------------------
// DEMO USERS
// ------------------------------
const currentUser = {
  name: "Abdul-Hafiz Fambali",
  avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // your profile photo
};

const demoUsers = [
  { name: "Amina Yakubu", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { name: "Is-haq Abdulai", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Hawa Bukey", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
];

// ------------------------------
// POSTS DATA
// ------------------------------
let posts = [
  { user: demoUsers[0], content: "Assalamu Alaikum everyone!", likes: 3, date: new Date() },
  { user: demoUsers[1], content: "Learning AI is fun!", likes: 5, date: new Date() },
];

// ------------------------------
// 3-DOT MENU TOGGLE
// ------------------------------
const topNavActions = document.querySelector(".nav-actions");

topNavActions.innerHTML = `
  <div class="three-dots" onclick="toggleUserMenu()">⋮</div>
  <div class="user-menu hidden">
    <div onclick="goToSettings()">Settings</div>
    <div onclick="logout()">Logout</div>
  </div>
`;

function toggleUserMenu() {
  const menu = document.querySelector(".user-menu");
  menu.classList.toggle("hidden");
}

function goToSettings() {
  alert("Settings page coming soon, Insha Allah.");
  toggleUserMenu();
}

function logout() {
  alert("You have logged out.");
  window.location.href = "index.html"; // back to login/signup
}

// ------------------------------
// RENDER POSTS
// ------------------------------
function renderPosts() {
  const postsArea = document.getElementById("postsArea");
  postsArea.innerHTML = "";

  posts.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.className = "card post";

    const day = String(post.date.getDate()).padStart(2, "0");
    const month = String(post.date.getMonth() + 1).padStart(2, "0"); // months start at 0
    const year = post.date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    postDiv.innerHTML = `
  <div class="post-top">
    <div class="post-user">
      <div class="avatar">
        <img src="${post.user.avatar}" alt="${post.user.name}">
      </div>

      <div>
        <div class="name">${post.user.name}</div>
        <div class="meta">${formattedDate}</div>
      </div>
    </div>

    <!-- 3 dots for each post -->
    <div class="post-menu-wrap">
      <button class="post-menu-btn" onclick="togglePostMenu(${index})">⋯</button>

      <div class="post-menu hidden" id="postMenu-${index}">
        <button onclick="messageUser(${index})">Message</button>
      </div>
    </div>
  </div>

  <div class="post-content">${post.content}</div>

  <div class="post-footer">
    <button onclick="likePost(${index})">
      ${post.liked ? "Liked" : "Like"} (${post.likes})
    </button>
  </div>
`;

    postsArea.appendChild(postDiv);
  });
}

// ------------------------------
// LIKE BUTTON
// ------------------------------
function likePost(index) {
  // Add a "liked" property if it doesn't exist
  if (posts[index].liked === undefined) {
    posts[index].liked = false;
  }

  // Toggle like
  if (posts[index].liked === false) {
    posts[index].likes++;
    posts[index].liked = true;
  } else {
    posts[index].likes--;
    posts[index].liked = false;
  }

  renderPosts();
}

// ------------------------------
// CREATE NEW POST
// ------------------------------
function createPost() {
  const text = document.getElementById("postText").value.trim();
  if (!text) return alert("Please write something to post.");

  const newPost = {
    user: currentUser,
    content: text,
    likes: 0,
    date: new Date(),
  };

  posts.unshift(newPost); // add to top
  document.getElementById("postText").value = "";
  renderPosts();
}

// ------------------------------
// NAV TABS (horizontal)
function switchTab(tab) {
  alert(`Switching to ${tab} tab (Insha Allah this will be functional later).`);
}

// ------------------------------
// INITIAL RENDER
renderPosts();

function togglePostMenu(index) {
  // Close all other post menus
  document.querySelectorAll(".post-menu").forEach(menu => {
    menu.classList.add("hidden");
  });

  // Toggle only this one
  const menu = document.getElementById(`postMenu-${index}`);
  if (menu) menu.classList.toggle("hidden");
}

function messageUser(index) {
  const userName = posts[index].user.name;

  // Save the name to open in messages page (later)
  localStorage.setItem("openChatWith", userName);

  // Go to messages
  window.location.href = "messages.html";
}

// CLOSE POST MENU WHEN CLICKING OUTSIDE
document.addEventListener("click", (e) => {
  // If click is NOT on a post menu button
  if (!e.target.classList.contains("post-menu-btn")) {
    document.querySelectorAll(".post-menu").forEach(menu => {
      menu.classList.add("hidden");
    });
  }
});