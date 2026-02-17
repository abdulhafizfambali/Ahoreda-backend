const topicsList = document.getElementById("topicsList");
const usersList = document.getElementById("usersList");
const postsGrid = document.getElementById("postsGrid");

const menuBtn = document.getElementById("menuBtn");
const menuDropdown = document.getElementById("menuDropdown");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Demo data
const topics = [
  "#IslamicQuotes",
  "#Ghana",
  "#Technology",
  "#Programming",
  "#Education",
  "#Business",
  "#Motivation",
  "#Health",
  "#Sports",
];

const users = [
  { name: "Amina", handle: "@amina_gh" },
  { name: "Is-haq", handle: "@ishaq_official" },
  { name: "Bashir", handle: "@bashir_dev" },
  { name: "Hawa", handle: "@hawa_daily" },
];

const posts = [
  "Post 1", "Post 2", "Post 3",
  "Post 4", "Post 5", "Post 6",
  "Post 7", "Post 8", "Post 9",
  "Post 10", "Post 11", "Post 12",
];

// Render topics
function renderTopics() {
  topicsList.innerHTML = "";
  topics.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "topic-pill";
    btn.innerText = t;

    btn.onclick = () => {
      searchInput.value = t;
      doSearch();
    };

    topicsList.appendChild(btn);
  });
}

// Render users
function renderUsers() {
  usersList.innerHTML = "";

  users.forEach((u) => {
    const card = document.createElement("div");
    card.className = "user-card";

    const firstLetter = u.name.charAt(0).toUpperCase();

    card.innerHTML = `
      <div class="user-left">
        <div class="avatar">${firstLetter}</div>
        <div>
          <div class="user-name">${u.name}</div>
          <div class="user-handle">${u.handle}</div>
        </div>
      </div>
      <button class="follow-btn">Follow</button>
    `;

    const followBtn = card.querySelector(".follow-btn");
    followBtn.addEventListener("click", () => {
      followBtn.innerText = "Following";
      followBtn.style.background = "#111827";
    });

    usersList.appendChild(card);
  });
}

// Render posts
function renderPosts() {
  postsGrid.innerHTML = "";

  posts.forEach((p, index) => {
    const tile = document.createElement("div");
    tile.className = "post-tile";
    tile.innerText = p;

    tile.onclick = () => {
      alert("Opening " + p + "...");
    };

    postsGrid.appendChild(tile);
  });
}

// Search
function doSearch() {
  const value = searchInput.value.trim();

  if (!value) {
    alert("Type something to search.");
    return;
  }

  alert("Searching for: " + value);
}

// Search button
searchBtn.addEventListener("click", doSearch);

// Enter key search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") doSearch();
});

// Menu dropdown
menuBtn.addEventListener("click", () => {
  menuDropdown.style.display =
    menuDropdown.style.display === "block" ? "none" : "block";
});

// Close menu if click outside
document.addEventListener("click", (e) => {
  if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
    menuDropdown.style.display = "none";
  }
});

// Logout
function logout() {
  alert("Logging out...");
  window.location.href = "index.html";
}

// Initial render
renderTopics();
renderUsers();
renderPosts();