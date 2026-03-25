// Detect call type from URL
const params = new URLSearchParams(window.location.search);
const type = params.get("type"); // voice or video

const acceptBtn = document.getElementById("acceptBtn");
const rejectBtn = document.getElementById("rejectBtn");

// ACCEPT CALL
acceptBtn.onclick = () => {

  // ✅ Vibrate (if supported)
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]); // short vibration pattern
  }

  // Small delay to feel the vibration
  setTimeout(() => {
    window.location.href = `call.html?type=${type}&connected=true`;
  }, 300);

};

// REJECT CALL
rejectBtn.onclick = () => {
  alert("Call declined");
  window.close(); // or redirect to messages
};