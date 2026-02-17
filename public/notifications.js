const notificationsList = document.getElementById("notificationsList");
const menuBtn = document.getElementById("menuBtn");
const menuDropdown = document.getElementById("menuDropdown");

let currentFilter = "all";

// Demo notifications
let notifications = [
  {
    type: "likes",
    icon: "❤️",
    title: "New Like",
    text: "Amina liked your post.",
    time: "2m ago",
    action: "View",
  },
  {
    type: "follows",
    icon: "➕",
    title: "New Follower",
    text: "Bashir started following you.",
    time: "18m ago",
    action: "View",
  },
  {
    type: "mentions",
    icon: "💬",
    title: "Mention",
    text: "You were mentioned in a comment.",
    time: "1h ago",
    action: "Open",
  },
  {
    type: "likes",
    icon: "🔥",
    title: "Post Trending",
    text: "Your post is getting attention today!",
    time: "Yesterday",
    action: "View",
  },
];

// RENDER NOTIFICATIONS
function renderNotifications() {
  notificationsList.innerHTML = "";

  const filtered =
    currentFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === currentFilter);

  if (filtered.length === 0) {
    notificationsList.innerHTML = `
      <div class="notif-card">
        <div class="notif-icon">🔔</div>
        <div class="notif-body">
          <div class="notif-title">No notifications</div>
          <div class="notif-text">You're all caught up for now.</div>
        </div>
      </div>
    `;
    return;
  }

  filtered.forEach((n) => {
    const card = document.createElement("div");
    card.className = "notif-card";

    card.innerHTML = `
      <div class="notif-icon">${n.icon}</div>

      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>

      <div class="notif-action">
        <button class="view-btn">${n.action}</button>
      </div>
    `;

    notificationsList.appendChild(card);
  });
}

// FILTER TABS
function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  document.getElementById("tab-" + filter).classList.add("active");

  renderNotifications();
}

// CLEAR ALL
function clearNotifications() {
  notifications = [];
  renderNotifications();
}

// MENU DROPDOWN
menuBtn.addEventListener("click", () => {
  menuDropdown.style.display =
    menuDropdown.style.display === "block" ? "none" : "block";
});

// CLOSE MENU IF CLICK OUTSIDE
document.addEventListener("click", (e) => {
  if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
    menuDropdown.style.display = "none";
  }
});

// LOGOUT (DEMO)
function logout() {
  alert("Logging out...");
  window.location.href = "index.html";
}

function openSettings() {
  alert("Settings coming soon...");
}

// Make functions global
window.setFilter = setFilter;
window.clearNotifications = clearNotifications;
window.logout = logout;
window.openSettings = openSettings;

// Initial render
renderNotifications();