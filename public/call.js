const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const endCallBtn = document.getElementById("endCallBtn");
const voiceUI = document.getElementById("voiceUI");
const callTime = document.getElementById("callTime");

let stream;
let callTimer;
let seconds = 0;
function startTimer() {
  callTimer = setInterval(() => {
    seconds++;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    callTime.textContent =
      String(hours).padStart(2, "0") + ":" +
      String(minutes).padStart(2, "0") + ":" +
      String(secs).padStart(2, "0");

  }, 1000);
}

function stopTimer() {
  clearInterval(callTimer);
  seconds = 0;
}

// Detect type from URL
const params = new URLSearchParams(window.location.search);
const type = params.get("type"); // video or voice

startCall();

async function startCall() {
  try {

    if (type === "video") {

      voiceUI.style.display = "none";

      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localVideo.srcObject = stream;
      startTimer();

    } else {

      // VOICE MODE
      document.querySelector(".video-area").style.display = "none";
      voiceUI.style.display = "block";

      stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      startTimer();

    }

  } catch (err) {
    alert("Permission denied or microphone/camera not working");
    console.error(err);
  }
}

// END CALL
endCallBtn.onclick = () => {

  stopTimer(); // ✅ ADD THIS

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  window.close();
};