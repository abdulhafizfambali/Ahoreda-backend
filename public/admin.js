// ------------------------------
// DEMO DATA (temporary)
// Later Firebase will replace this
// ------------------------------
const demoStats = {
  totalUsers: 1284,
  onlineNow: 76,
  newUsersToday: 19,
  postsToday: 143,
  flaggedPosts: 12,
  blockedPosts: 5,
  blockedWordsTriggered: 27,
  adsRunning: 8,
  impressionsToday: 12940,
  clicksToday: 332
};

const demoUsers = [
  { name: "Amina Yakubu", gender: "Female", age: 20, nationality: "Ghana", status: "Online" },
  { name: "Is-haq Abdulai", gender: "Male", age: 26, nationality: "Ghana", status: "Offline" },
  { name: "Hawa Bukey", gender: "Female", age: 18, nationality: "Ghana", status: "Online" },
  { name: "Mohammed Umar", gender: "Male", age: 23, nationality: "Nigeria", status: "Offline" },
  { name: "Nasibatu Abdulai", gender: "Female", age: 16, nationality: "Ghana", status: "Online" }
];

let blockedWords = ["music", "song", "gambling", "alcohol"];

// ------------------------------
// LOAD DASHBOARD
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
  loadOverviewStats();
  loadUsersTable(demoUsers);
  populateNationalityFilter();

  loadDemographics();
  loadModeration();
  loadAds();

  // Live filtering
  document.getElementById("userSearchInput").addEventListener("input", applyUserFilters);
  document.getElementById("genderFilter").addEventListener("change", applyUserFilters);
  document.getElementById("statusFilter").addEventListener("change", applyUserFilters);
  document.getElementById("nationalityFilter").addEventListener("change", applyUserFilters);
});

// ------------------------------
// TAB SWITCHING
// ------------------------------
function showAdminTab(tabName) {
  document.querySelectorAll(".admin-tab").forEach(tab => tab.classList.add("hidden"));
  document.getElementById(`tab-${tabName}`).classList.remove("hidden");

  document.querySelectorAll(".admin-nav-item").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
}

// ------------------------------
// OVERVIEW
// ------------------------------
function loadOverviewStats() {
  document.getElementById("totalUsers").textContent = demoStats.totalUsers;
  document.getElementById("onlineNow").textContent = demoStats.onlineNow;
  document.getElementById("newUsersToday").textContent = demoStats.newUsersToday;
  document.getElementById("postsToday").textContent = demoStats.postsToday;
}

// ------------------------------
// USERS TABLE
// ------------------------------
function loadUsersTable(filteredUsers = demoUsers) {
  const container = document.getElementById("usersTable");
  container.innerHTML = "";

  document.getElementById("usersCount").textContent = filteredUsers.length;

  if (filteredUsers.length === 0) {
    const empty = document.createElement("div");
    empty.className = "admin-empty";
    empty.textContent = "No users found with these filters.";
    container.appendChild(empty);
    return;
  }

  filteredUsers.forEach(user => {
    const row = document.createElement("div");
    row.className = "admin-table-row";

    row.innerHTML = `
      <div>${user.name}</div>
      <div>${user.gender}</div>
      <div>${user.age}</div>
      <div>${user.nationality}</div>
      <div class="${user.status === "Online" ? "status-online" : "status-offline"}">${user.status}</div>
    `;

    container.appendChild(row);
  });
}

function populateNationalityFilter() {
  const nationalitySelect = document.getElementById("nationalityFilter");
  if (!nationalitySelect) return;

  const countries = [...new Set(demoUsers.map(u => u.nationality))].sort();

  countries.forEach(country => {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    nationalitySelect.appendChild(opt);
  });
}

function applyUserFilters() {
  const searchText = document.getElementById("userSearchInput").value.trim().toLowerCase();
  const gender = document.getElementById("genderFilter").value;
  const status = document.getElementById("statusFilter").value;
  const nationality = document.getElementById("nationalityFilter").value;

  let filtered = demoUsers;

  // search by name
  if (searchText !== "") {
    filtered = filtered.filter(u => u.name.toLowerCase().includes(searchText));
  }

  // gender filter
  if (gender !== "All") {
    filtered = filtered.filter(u => u.gender === gender);
  }

  // status filter
  if (status !== "All") {
    filtered = filtered.filter(u => u.status === status);
  }

  // nationality filter
  if (nationality !== "All") {
    filtered = filtered.filter(u => u.nationality === nationality);
  }

  loadUsersTable(filtered);
}

function resetUserFilters() {
  document.getElementById("userSearchInput").value = "";
  document.getElementById("genderFilter").value = "All";
  document.getElementById("statusFilter").value = "All";
  document.getElementById("nationalityFilter").value = "All";

  loadUsersTable(demoUsers);
}
// ------------------------------
// DEMOGRAPHICS
// ------------------------------
function loadDemographics() {
  const total = demoUsers.length;
  const maleCount = demoUsers.filter(u => u.gender === "Male").length;
  const femaleCount = demoUsers.filter(u => u.gender === "Female").length;

  const malePercent = Math.round((maleCount / total) * 100);
  const femalePercent = Math.round((femaleCount / total) * 100);

  document.getElementById("malePercent").textContent = `${malePercent}%`;
  document.getElementById("femalePercent").textContent = `${femalePercent}%`;

  document.getElementById("maleBar").style.width = `${malePercent}%`;
  document.getElementById("femaleBar").style.width = `${femalePercent}%`;

  // nationality breakdown
  const nationalityCounts = {};
  demoUsers.forEach(u => {
    nationalityCounts[u.nationality] = (nationalityCounts[u.nationality] || 0) + 1;
  });

  const list = document.getElementById("nationalityList");
  list.innerHTML = "";

  Object.keys(nationalityCounts).forEach(country => {
    const item = document.createElement("div");
    item.className = "admin-list-item";
    item.textContent = `${country} — ${nationalityCounts[country]} users`;
    list.appendChild(item);
  });
}

// ------------------------------
// MODERATION
// ------------------------------
function loadModeration() {
  document.getElementById("flaggedPosts").textContent = demoStats.flaggedPosts;
  document.getElementById("blockedPosts").textContent = demoStats.blockedPosts;
  document.getElementById("blockedWordsTriggered").textContent = demoStats.blockedWordsTriggered;

  renderBlockedWords();
}

function addBlockedWord() {
  const input = document.getElementById("newBlockedWord");
  const word = input.value.trim().toLowerCase();

  if (word === "") return;

  if (blockedWords.includes(word)) {
    alert("This word is already blocked.");
    return;
  }

  blockedWords.push(word);
  input.value = "";
  renderBlockedWords();
}

function removeBlockedWord(word) {
  blockedWords = blockedWords.filter(w => w !== word);
  renderBlockedWords();
}

function renderBlockedWords() {
  const container = document.getElementById("blockedWordsList");
  container.innerHTML = "";

  blockedWords.forEach(word => {
    const tag = document.createElement("div");
    tag.className = "admin-tag";
    tag.innerHTML = `
      <span>${word}</span>
      <button onclick="removeBlockedWord('${word}')">✖</button>
    `;
    container.appendChild(tag);
  });
}

// ------------------------------
// ADS
// ------------------------------
function loadAds() {
  document.getElementById("adsRunning").textContent = demoStats.adsRunning;
  document.getElementById("impressionsToday").textContent = demoStats.impressionsToday;
  document.getElementById("clicksToday").textContent = demoStats.clicksToday;
}

// ------------------------------
// NAVIGATION (temporary)
// ------------------------------
function goBackToFeed() {
  alert("Later this will go to feed.html");
}

function adminLogout() {
  alert("Later this will log out admin and return to login page.");
}