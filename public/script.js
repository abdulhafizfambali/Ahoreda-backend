let cropper = null; // Global variable for Cropper instance
let canResend = true;     // flag to control if user can resend
let resendTimer = null;   // reference to countdown timer
function sendConfirmationCode() {
  generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  alert('Confirmation code sent: ' + generatedCode); // demo only
}

function resendCode() {
  if (!canResend) return; // prevent spamming

  sendConfirmationCode(); // generate & send new code

  const resendText = document.querySelector('#step-5 .resend-code-text');
  let countdown = 30; // 30 seconds countdown
  canResend = false;

  // update text to show countdown
  resendText.textContent = `Resend available in ${countdown}s`;

  resendTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      resendText.textContent = `Resend available in ${countdown}s`;
    } else {
      clearInterval(resendTimer);
      resendText.textContent = 'Resend Code';
      canResend = true;
    }
  }, 1000);
}

function verifyConfirmationCode() {
  const inputCode = document.getElementById('confirmationCode').value.trim();
  if (inputCode === generatedCode && inputCode !== '') {
    alert('Code verified! Signup complete.'); // you can replace this with finishSignup()
    finishSignup(); // move to feed
  } else {
    document.getElementById('error-confirmationCode').style.display = 'block';
  }
}
// // ================================
// STEP NAVIGATION
// ================================
let currentStep = 1;
const totalSteps = 6;

function showStep(step) {
  for (let i = 1; i <= totalSteps; i++) {
    document.getElementById('step-' + i).classList.remove('active');
  }
  document.getElementById('step-' + step).classList.add('active');

  // Show login prompt only on step 1
  if (step === 1) {
    document.getElementById('login-prompt').style.display = 'block';
  } else {
    document.getElementById('login-prompt').style.display = 'none';
  }
}

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }
}
// ================================
// CONFIRMATION CODE LOGIC
// ================================
let generatedCode = '';

function sendConfirmationCode() {
  // Generate a 6-digit code
  generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  alert('Confirmation code sent: ' + generatedCode); // For demo purposes
}

// Call sendConfirmationCode() when moving from step 4 to step 5
function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep === 4) {
      // Step 4 passed, generate code
      sendConfirmationCode();
    }

    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

// Verify the code entered by user
function verifyConfirmationCode() {
  const userCode = document.getElementById('confirmationCode').value.trim();
  if (userCode === generatedCode && userCode !== '') {
    document.getElementById('error-confirmationCode').style.display = 'none';
    nextStep(); // go to profile photo step (step-6)
  } else {
    document.getElementById('error-confirmationCode').style.display = 'block';
    document.getElementById('error-confirmationCode').textContent = 'Incorrect code. Try again.';
  }
}

// Resend the code
function resendCode() {
  sendConfirmationCode();
  alert('A new confirmation code has been sent.');
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// Initial display
showStep(currentStep);

// ================================
// COUNTRIES LIST (Step 3)
// ================================
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
  "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
  "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
  "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// ================================
// FILL COUNTRY DROPDOWN
// ================================
function loadCountries() {
  const countrySelect = document.getElementById("country");
  if (!countrySelect) return;

  countrySelect.innerHTML = `<option value="">Select your country</option>`;
  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

// Run once
loadCountries();

// ================================
// SIGN UP / LOGIN TOGGLE
// ================================
document.getElementById('signup-title').style.display = 'block';
document.getElementById('login-prompt').onclick = function () {
  for (let i = 1; i <= totalSteps; i++) {
    document.getElementById('step-' + i).classList.remove('active');
  }

  document.getElementById('signup-title').style.display = 'none';
  document.getElementById('login-step').classList.add('active');
};

// Return from login to signup
function backToSignup() {
  document.getElementById('signup-title').style.display = 'block';
  document.getElementById('login-step').classList.remove('active');
  currentStep = 1;
  showStep(currentStep);
}

// ================================
// VALIDATE STEPS
// ================================
function validateStep(step) {
  let valid = true;

  // STEP 1: First & Last Name
  if (step === 1) {
    const fn = document.getElementById('firstName').value.trim();
    const ln = document.getElementById('lastName').value.trim();

    if (fn === '') {
      document.getElementById('error-firstName').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-firstName').style.display = 'none';
    }

    if (ln === '') {
      document.getElementById('error-lastName').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-lastName').style.display = 'none';
    }
  }

  // STEP 2: DOB & Gender
  else if (step === 2) {
    const dd = parseInt(document.getElementById('dob-day').value);
    const mm = parseInt(document.getElementById('dob-month').value);
    const yy = parseInt(document.getElementById('dob-year').value);

    if (!isValidDate(dd, mm, yy)) {
      document.getElementById('error-dob').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-dob').style.display = 'none';
    }

    if (document.getElementById('gender').value === '') {
      document.getElementById('error-gender').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-gender').style.display = 'none';
    }
  }

  // STEP 3: Country
  else if (step === 3) {
    if (document.getElementById('country').value === '') {
      document.getElementById('error-country').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-country').style.display = 'none';
    }
  }

  // STEP 4: Email/Phone & Password & Confirm Password
  else if (step === 4) {
    const val = document.getElementById('emailPhone').value.trim();
    const pwd = document.getElementById('password').value.trim();
    const confirmPwd = document.getElementById('confirmPassword').value.trim();

    if (val === '') {
      document.getElementById('error-emailPhone').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-emailPhone').style.display = 'none';
    }

    if (pwd === '') {
      document.getElementById('error-password').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-password').style.display = 'none';
    }

    if (confirmPwd === '') {
      document.getElementById('error-confirmPassword').textContent = "Confirm your password";
      document.getElementById('error-confirmPassword').style.display = 'block';
      valid = false;
    } else if (pwd !== confirmPwd) {
      document.getElementById('error-confirmPassword').textContent = "Passwords do not match";
      document.getElementById('error-confirmPassword').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('error-confirmPassword').style.display = 'none';
    }
  }

  return valid;
}

// ================================
// FINISH SIGNUP & SHOW FEED
// ================================
function finishSignup() {
  // Later we will save user to Firebase
  window.location.href = "feed.html";
}

// ================================
// SWITCH TABS
// ================================
function switchTab(tab) {
  document.getElementById('feed-container').style.display = 'none';
  document.getElementById('fyp-container').style.display = 'none';
  document.getElementById('messages-container').style.display = 'none';
  document.getElementById('tab-home').classList.remove('active');
  document.getElementById('tab-fyp').classList.remove('active');
  document.getElementById('tab-messages').classList.remove('active');

  if (tab === 'home') {
    document.getElementById('feed-container').style.display = 'block';
    document.getElementById('tab-home').classList.add('active');
  } else if (tab === 'fyp') {
    document.getElementById('fyp-container').style.display = 'block';
    document.getElementById('tab-fyp').classList.add('active');
  } else if (tab === 'messages') {
    document.getElementById('messages-container').style.display = 'block';
    document.getElementById('tab-messages').classList.add('active');
  }
}

// ================================
// UPDATE TIME DISPLAY
// ================================
function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let is24Hour = false;

  let suffix = 'AM';
  if (!is24Hour) {
    suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  document.getElementById('time-display').textContent =
    hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') +
    (is24Hour ? '' : ' ' + suffix);
}

setInterval(updateTime, 1000);
updateTime();

// ================================
// AVATAR UPLOAD & CROP
// ================================
function uploadAvatar() { document.getElementById('profilePhoto').click(); }

function openCropModal(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.getElementById('crop-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        document.getElementById('crop-modal').style.display = 'flex';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function closeCropModal() { document.getElementById('crop-modal').style.display = 'none'; }

function applyCrop() {
  const canvas = document.getElementById('crop-canvas');
  const dataUrl = canvas.toDataURL('image/png');
  document.getElementById('avatar').src = dataUrl;
  closeCropModal();
}

// ================================
// HELPER FUNCTIONS
// ================================
function isValidDate(dd, mm, yy) {
  if (!dd || !mm || !yy) return false;
  const monthDays = [
    31, (yy % 4 === 0 && (yy % 100 !== 0 || yy % 400 === 0) ? 29 : 28),
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > monthDays[mm - 1]) return false;
  return true;
}

function formatDOB() {
  const day = document.getElementById('dob-day');
  const month = document.getElementById('dob-month');
  const year = document.getElementById('dob-year');
  if (day.value.length === 2 && month.value.length < 2) month.focus();
  if (month.value.length === 2 && year.value.length < 4) year.focus();
}

// ================================
// FACEBOOK-LIKE FEED
// ================================
function loadFacebookTemplate() {
  const feed = document.getElementById('feed-container');
  feed.innerHTML = `
    <div style="padding:10px;display:flex;justify-content:space-between;align-items:center;background:#1877f2;color:#fff;border-radius:8px;">
      <div style="font-weight:bold;font-size:20px;">AHOREDA</div>
      <div>
        <button style="padding:6px 12px;border:none;border-radius:8px;background:#fff;color:#1877f2;font-weight:bold;margin-right:10px;">Notifications</button>
        <button style="padding:6px 12px;border:none;border-radius:8px;background:#fff;color:#1877f2;font-weight:bold;">Profile</button>
      </div>
    </div>
    <div style="margin-top:15px;">Welcome to AHOREDA! Scroll posts below.</div>
  `;
}

// ================================
// LOGIN BUTTON LOGIC
// ================================
function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  let valid = true;

  if (email === '') {
    document.getElementById('error-loginEmail').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('error-loginEmail').style.display = 'none';
  }

  if (password === '') {
    document.getElementById('error-loginPassword').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('error-loginPassword').style.display = 'none';
  }

  if (valid) finishSignup();
}

// ================================
// TOGGLE PASSWORD VISIBILITY
// ================================
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = (input.type === "password") ? "text" : "password";
}