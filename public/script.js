// =====================================
// GLOBAL VARIABLES
// =====================================
let cropper = null;
let generatedCode = "";
let currentStep = 1;
const totalSteps = 6;


// =====================================
// STEP NAVIGATION
// =====================================
function showStep(step){

  for(let i=1;i<=totalSteps;i++){
    const el = document.getElementById("step-"+i);
    if(el) el.classList.remove("active");
  }

  const current = document.getElementById("step-"+step);
  if(current) current.classList.add("active");

  const loginPrompt = document.getElementById("login-prompt");
  if(loginPrompt){
    loginPrompt.style.display = step === 1 ? "block" : "none";
  }
}

function nextStep(){

  if(validateStep(currentStep)){

    if(currentStep === 4){
      sendConfirmationCode();
    }

    if(currentStep < totalSteps){
      currentStep++;
      showStep(currentStep);
    }
  }
}

function prevStep(){
  if(currentStep > 1){
    currentStep--;
    showStep(currentStep);
  }
}

showStep(currentStep);


// =====================================
// STEP VALIDATION
// =====================================
function validateStep(step){

  let valid = true;

  // STEP 1 NAME
  if(step === 1){

    const first = document.getElementById("firstName").value.trim();
    const last = document.getElementById("lastName").value.trim();

    if(!first){
      document.getElementById("error-firstName").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-firstName").style.display="none";
    }

    if(!last){
      document.getElementById("error-lastName").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-lastName").style.display="none";
    }

  }


  // STEP 2 DOB
  if(step === 2){

    const dd = parseInt(document.getElementById("dob-day").value);
    const mm = parseInt(document.getElementById("dob-month").value);
    const yy = parseInt(document.getElementById("dob-year").value);

    if(!isValidDate(dd,mm,yy)){
      document.getElementById("error-dob").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-dob").style.display="none";
    }

    const gender = document.getElementById("gender").value;

    if(!gender){
      document.getElementById("error-gender").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-gender").style.display="none";
    }

  }


  // STEP 3 COUNTRY
  if(step === 3){

    const country = document.getElementById("country").value;

    if(!country){
      document.getElementById("error-country").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-country").style.display="none";
    }

  }


  // STEP 4 EMAIL + PASSWORD
  if(step === 4){

    const emailPhone = document.getElementById("emailPhone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if(!emailPhone){
      document.getElementById("error-emailPhone").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-emailPhone").style.display="none";
    }

    if(!password){
      document.getElementById("error-password").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-password").style.display="none";
    }

    if(!confirm){
      document.getElementById("error-confirmPassword").textContent="Confirm password";
      document.getElementById("error-confirmPassword").style.display="block";
      valid=false;
    }
    else if(password !== confirm){
      document.getElementById("error-confirmPassword").textContent="Passwords do not match";
      document.getElementById("error-confirmPassword").style.display="block";
      valid=false;
    }
    else{
      document.getElementById("error-confirmPassword").style.display="none";
    }

  }


  // STEP 5 CONFIRM CODE
  if(step === 5){

    const code = document.getElementById("confirmationCode").value.trim();

    if(code !== generatedCode){
      document.getElementById("error-confirmationCode").style.display="block";
      valid=false;
    }else{
      document.getElementById("error-confirmationCode").style.display="none";
    }

  }

  return valid;

}


// =====================================
// CONFIRMATION CODE
// =====================================
function sendConfirmationCode(){

  generatedCode = Math.floor(100000 + Math.random()*900000).toString();

  console.log("Verification Code:",generatedCode);

}

function resendCode(){
  sendConfirmationCode();
  alert("New code sent");
}


// =====================================
// DATE VALIDATION
// =====================================
function isValidDate(dd,mm,yy){

  if(!dd || !mm || !yy) return false;

  const days = [
    31,
    (yy%4===0 && (yy%100!==0 || yy%400===0))?29:28,
    31,30,31,30,31,31,30,31,30,31
  ];

  if(mm<1 || mm>12) return false;

  if(dd<1 || dd>days[mm-1]) return false;

  return true;

}

function formatDOB(){

  const day=document.getElementById("dob-day");
  const month=document.getElementById("dob-month");
  const year=document.getElementById("dob-year");

  if(day.value.length===2) month.focus();
  if(month.value.length===2) year.focus();

}


// =====================================
// COUNTRY LOADER
// =====================================
const countries=["Ghana","Nigeria","United States","United Kingdom","Canada","India","France","Germany"];

function loadCountries(){

  const select=document.getElementById("country");

  countries.forEach(c=>{

    const option=document.createElement("option");

    option.value=c;
    option.textContent=c;

    select.appendChild(option);

  });

}

loadCountries();


// =====================================
// PROFILE PHOTO
// =====================================
function uploadAvatar(){

  const input=document.getElementById("profilePhoto");

  if(input) input.click();

}

document.addEventListener("DOMContentLoaded",()=>{

  const photoInput=document.getElementById("profilePhoto");

  if(photoInput){

    photoInput.addEventListener("change",function(e){

      const file=e.target.files[0];
      if(!file) return;

      const reader=new FileReader();

      reader.onload=function(event){

        const img=new Image();

        img.onload=function(){

          const canvas=document.getElementById("crop-canvas");

          const ctx=canvas.getContext("2d");

          ctx.clearRect(0,0,canvas.width,canvas.height);

          ctx.drawImage(img,0,0,canvas.width,canvas.height);

          document.getElementById("crop-modal").style.display="flex";

        };

        img.src=event.target.result;

      };

      reader.readAsDataURL(file);

    });

  }

});


function closeCropModal(){

  document.getElementById("crop-modal").style.display="none";

}

function applyCrop(){

  const canvas=document.getElementById("crop-canvas");

  const avatar=document.getElementById("avatar");

  avatar.src=canvas.toDataURL("image/png");

  closeCropModal();

}


// =====================================
// PASSWORD VISIBILITY
// =====================================
function togglePassword(id){

  const input=document.getElementById(id);

  if(input.type==="password"){
    input.type="text";
  }else{
    input.type="password";
  }

}


// =====================================
// CLOCK
// =====================================
function updateTime(){

  const display=document.getElementById("time-display");

  if(!display) return;

  const now=new Date();

  let h=now.getHours();
  let m=now.getMinutes();

  const suffix=h>=12?"PM":"AM";

  h=h%12 || 12;

  display.textContent=
    h.toString().padStart(2,"0")+":"+
    m.toString().padStart(2,"0")+" "+suffix;

}

setInterval(updateTime,1000);
updateTime();


// =====================================
// SIGNUP
// =====================================
async function finishSignup(){

  try{

    const first=document.getElementById("firstName").value.trim();
    const last=document.getElementById("lastName").value.trim();
    const email=document.getElementById("emailPhone").value.trim();
    const pass=document.getElementById("password").value.trim();

    const formData=new FormData();

    formData.append("firstName",first);
    formData.append("lastName",last);
    formData.append("emailPhone",email);
    formData.append("password",pass);

    const photo=document.getElementById("profilePhoto");

    if(photo && photo.files[0]){
      formData.append("avatar",photo.files[0]);
    }

    const res=await fetch("/api/users/signup",{
      method:"POST",
      body:formData
    });

    const data=await res.json();

    if(data.success){
      alert("Account created successfully");
      window.location.href="feed.html";
    }else{
      alert(data.message || "Signup failed");
    }

  }catch(err){

    console.error(err);

    alert("Server error");

  }

}