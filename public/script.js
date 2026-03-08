let cropper = null;
let generatedCode = "";
let currentStep = 1;
const totalSteps = 5;

// ================================
// STEP NAVIGATION
// ================================
function showStep(step) {
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById("step-" + i);
    if (el) el.classList.remove("active");
  }
  const current = document.getElementById("step-" + step);
  if (current) current.classList.add("active");

  const loginPrompt = document.getElementById("login-prompt");
  if (loginPrompt) {
    loginPrompt.style.display = step === 1 ? "block" : "none";
  }
}

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep === 4) sendConfirmationCode();
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

showStep(currentStep);

// ================================
// STEP VALIDATION
// ================================
function validateStep(step) {
  let valid = true;

  if (step === 1) {
    const fn = document.getElementById("firstName").value.trim();
    const ln = document.getElementById("lastName").value.trim();

    if (!fn) {
      document.getElementById("error-firstName").style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-firstName").style.display = "none";
    }

    if (!ln) {
      document.getElementById("error-lastName").style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-lastName").style.display = "none";
    }
  } else if (step === 2) {
    const dd = parseInt(document.getElementById("dob-day").value);
    const mm = parseInt(document.getElementById("dob-month").value);
    const yy = parseInt(document.getElementById("dob-year").value);

    if (!isValidDate(dd, mm, yy)) {
      document.getElementById("error-dob").style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-dob").style.display = "none";
    }

    if (!document.getElementById("gender").value) {
      document.getElementById("error-gender").style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-gender").style.display = "none";
    }
  } else if (step === 3) {
    if (!document.getElementById("country").value) {
      document.getElementById("error-country").style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-country").style.display = "none";
    }
  } else if (step === 4) {
    const emailPhone = document.getElementById("emailPhone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!emailPhone) {
      document.getElementById("error-emailPhone").style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-emailPhone").style.display = "none";
    }

    if (!password) {
      document.getElementById("error-password").style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-password").style.display = "none";
    }

    if (!confirmPassword) {
      document.getElementById("error-confirmPassword").style.display = "block";
      valid = false;
    } else if (password !== confirmPassword) {
      const el = document.getElementById("error-confirmPassword");
      el.textContent = "Passwords do not match";
      el.style.display = "block";
      valid = false;
    } else {
      document.getElementById("error-confirmPassword").style.display = "none";
    }
  }

  return valid;
}

// ================================
// LOGIN NAVIGATION
// ================================
function backToSignup() {
  document.getElementById("signup-title").style.display = "block";
  document.getElementById("login-step").classList.remove("active");
  currentStep = 1;
  showStep(currentStep);
}

document.getElementById("login-prompt").onclick = function () {
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById("step-" + i);
    if (el) el.classList.remove("active");
  }
  document.getElementById("signup-title").style.display = "none";
  document.getElementById("login-step").classList.add("active");
};

// ================================
// AVATAR CROPPING
// ================================
function closeCropModal() {
  document.getElementById("crop-modal").style.display = "none";
}

function applyCrop() {
  const canvas = document.getElementById("crop-canvas");
  const dataUrl = canvas.toDataURL("image/png");
  document.getElementById("avatar").src = dataUrl;
  closeCropModal();
}

// ================================
// DATE UTILS
// ================================
function isValidDate(dd, mm, yy) {
  if (!dd || !mm || !yy) return false;
  const days = [
    31,
    (yy % 4 === 0 && (yy % 100 !== 0 || yy % 400 === 0)) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > days[mm - 1]) return false;
  return true;
}

function formatDOB() {
  const day = document.getElementById("dob-day");
  const month = document.getElementById("dob-month");
  const year = document.getElementById("dob-year");

  if (day.value.length === 2) month.focus();
  if (month.value.length === 2) year.focus();
}

// ================================
// COUNTRY LOADER
// ================================
const countries = [
"Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
"Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia",
"Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada",
"Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia",
"Cuba","Cyprus","Czech Republic","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic",
"Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland",
"France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
"Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
"Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon",
"Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives",
"Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia",
"Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua",
"Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea",
"Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis",
"Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia",
"Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
"South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland",
"Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia",
"Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
"Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

function loadCountries() {
  const select = document.getElementById("country");
  if (!select) return;
  countries.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  });
}

loadCountries();

// ================================
// SIGNUP
// ================================
async function finishSignup() {
  try {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const emailPhone = document.getElementById("emailPhone").value.trim();
    const password = document.getElementById("password").value.trim();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("emailPhone", emailPhone);
    formData.append("password", password);

    const photoInput = document.getElementById("profilePhoto");
    if (photoInput && photoInput.files[0]) {
      formData.append("avatar", photoInput.files[0]);
    }

    const res = await fetch("/api/users/signup", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      alert("Account created successfully ✅");
      window.location.href = "feed.html";
    } else {
      alert(data.message || "Signup failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ================================
// TIME DISPLAY
// ================================
function updateTime(){
  const timeDisplay = document.getElementById("time-display");
  if(!timeDisplay) return;

  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  let suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  timeDisplay.textContent =
    hours.toString().padStart(2,"0") + ":" +
    minutes.toString().padStart(2,"0") + " " + suffix;
}

setInterval(updateTime,1000);
updateTime();
// ================================
// PROFILE PHOTO UPLOAD FIX
// ================================

function uploadAvatar(){
    const photoInput = document.getElementById("profilePhoto");
    if(photoInput){
        photoInput.click();
    }
}

// When user selects photo → show crop modal
const photoInput = document.getElementById("profilePhoto");

if(photoInput){
    photoInput.addEventListener("change", function(e){

        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();

        reader.onload = function(event){

            const img = new Image();

            img.onload = function(){

                const canvas = document.getElementById("crop-canvas");
                if(!canvas) return;

                const ctx = canvas.getContext("2d");

                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.drawImage(img,0,0,canvas.width,canvas.height);

                const modal = document.getElementById("crop-modal");
                if(modal) modal.style.display="flex";
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
}

// Close crop modal
function closeCropModal(){
    const modal=document.getElementById("crop-modal");
    if(modal) modal.style.display="none";
}

// Apply crop preview
function applyCrop(){
    const canvas=document.getElementById("crop-canvas");
    if(!canvas) return;

    const avatar=document.getElementById("avatar");
    if(avatar){
        avatar.src=canvas.toDataURL("image/png");
    }

    closeCropModal();
}

// ================================
// PASSWORD VISIBILITY TOGGLE FIX
// ================================

function togglePassword(id){
    const input = document.getElementById(id);
    if(!input) return;

    if(input.type === "password"){
        input.type = "text";
    }else{
        input.type = "password";
    }
}