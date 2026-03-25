// DOM ELEMENTS
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const fileInput = document.getElementById("fileInput");
const attachBtn = document.getElementById("attachBtn");
const menuBtn = document.getElementById("menuBtn");
const voiceCallBtn = document.getElementById("voiceCallBtn");
const videoCallBtn = document.getElementById("videoCallBtn");

// ✅ FIXED: Correct ID
const dropdownContent = document.getElementById("menuDropdown");

// EMPTY CHAT TEXT
const emptyChatText = document.querySelector(".empty-chat");

// SHOW/HIDE MENU DROPDOWN
if(menuBtn && dropdownContent){
  menuBtn.addEventListener("click", () => {
    dropdownContent.style.display =
      dropdownContent.style.display === "flex" ? "none" : "flex";
  });
}

// HIDE DROPDOWN WHEN CLICKING OUTSIDE
document.addEventListener("click", (e) => {
  if(menuBtn && dropdownContent){
    if (!menuBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
      dropdownContent.style.display = "none";
    }
  }
});
// HIDE "Start a conversation" WHEN USER TYPES
chatInput.addEventListener("input", () => {
  if (chatInput.value.trim().length > 0) {
    if (emptyChatText) emptyChatText.style.display = "none";
  } else {
    // only show again if no messages exist
    if (emptyChatText && chatMessages.children.length === 1) {
      emptyChatText.style.display = "block";
    }
  }
});

// SEND TEXT MESSAGE
sendBtn.addEventListener("click", async () => {

  const message = chatInput.value.trim();
  if (!message) return;

  try {

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: message
      })
    });

    const data = await res.json();

    if(data.success){
      addMessage(message, "user");
      chatInput.value = "";
      scrollToBottom();
    }

  } catch(err){
    console.error(err);
    alert("Failed to send message. Please try again.");
  }

});

// ENTER KEY SEND
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});

// ADD MESSAGE FUNCTION
function addMessage(text, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble', sender);
  bubble.textContent = text;
  chatMessages.appendChild(bubble);

  // Scroll down automatically
  scrollToBottom();
}

// SCROLL TO BOTTOM
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// FILE ATTACHMENT
attachBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  if (!files.length) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', 'user'); // right-hand side

    // IMAGE
    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '250px';
      img.style.borderRadius = '12px';
      bubble.appendChild(img);

    // AUDIO
    } else if (file.type.startsWith('audio/')) {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      audio.controls = true;
      bubble.appendChild(audio);

    // VIDEO
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.controls = true;
      video.style.maxWidth = '250px';
      video.style.borderRadius = '12px';
      bubble.appendChild(video);

    // PDF
    } else if (file.type === 'application/pdf') {
      const label = document.createElement('div');
      label.textContent = '📄 PDF: ' + file.name;
      bubble.appendChild(label);

    // OTHER FILES
    } else {
      const label = document.createElement('div');
      label.textContent = '📁 File: ' + file.name;
      bubble.appendChild(label);
    }

    chatMessages.appendChild(bubble);
    scrollToBottom();
  }

  // Reset file input to allow selecting same file again if needed
  fileInput.value = '';
});

// MICROPHONE (VOICE RECORDING DEMO)
let mediaRecorder;
let audioChunks = [];

micBtn.addEventListener('click', async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    // Start recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create a chat bubble for the audio message
      const bubble = document.createElement('div');
      bubble.classList.add('chat-bubble', 'user'); // right-hand side
      bubble.style.display = 'flex';
      bubble.style.flexDirection = 'column';
      bubble.style.gap = '4px';

      const label = document.createElement('div');
      label.textContent = '🎤 Voice message';
      label.style.fontWeight = 'bold';

      const audioElem = document.createElement('audio');
      audioElem.src = audioUrl;
      audioElem.controls = true;

      bubble.appendChild(label);
      bubble.appendChild(audioElem);

      chatMessages.appendChild(bubble);
      scrollToBottom();
    });

    mediaRecorder.start();
    micBtn.textContent = '⏹'; // change icon to stop
  } else if (mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    micBtn.textContent = '🎤'; // revert icon
  }
});

// LOAD MESSAGES FROM BACKEND
async function loadMessages(){

  try{

    const res = await fetch("/api/messages");
    const messages = await res.json();

    messages.forEach(msg=>{
      addMessage(msg.text,"friend");
    });

  }catch(err){
    console.error(err);
  }

}

videoCallBtn.onclick = () => {
  window.open("call.html?type=video", "_blank");
};

voiceCallBtn.onclick = () => {
  window.open("call.html?type=voice", "_blank");
};