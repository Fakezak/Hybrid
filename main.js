// FIRST TIME VISIT
document.getElementById("startBtn").onclick = ()=>{
  document.getElementById("welcomePopup").classList.add("hidden");
  document.getElementById("instructions").classList.remove("hidden");
}

// SWIPE INSTRUCTIONS NEXT
document.getElementById("nextBtn").onclick = ()=>{
  document.getElementById("instructions").classList.add("hidden");
  document.getElementById("authContainer").classList.remove("hidden");
}

// LOGIN / SIGNUP TOGGLE
document.getElementById("gotoSignUp").onclick = ()=>{
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.remove("hidden");
}
document.getElementById("gotoLogin").onclick = ()=>{
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

// LOGIN / SIGNUP LOGIC (localStorage simulation)
if(!localStorage.getItem("users")) localStorage.setItem("users","[]");

document.getElementById("signupBtn").onclick = ()=>{
  const username=document.getElementById("signupUsername").value;
  const password=document.getElementById("signupPassword").value;
  let users=JSON.parse(localStorage.getItem("users"));
  if(users.find(u=>u.username===username)){ alert("User exists!"); return; }
  users.push({username,password,balance:1,displayName:"",profilePic:"default.png"});
  localStorage.setItem("users",JSON.stringify(users));
  alert("Registered! Login now");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

document.getElementById("loginBtn").onclick = ()=>{
  const username=document.getElementById("loginUsername").value;
  const password=document.getElementById("loginPassword").value;
  let users=JSON.parse(localStorage.getItem("users"));
  const user=users.find(u=>u.username===username && u.password===password);
  if(user){
    localStorage.setItem("currentUser",JSON.stringify(user));
    document.getElementById("authContainer").classList.add("hidden");
    document.getElementById("mainSwipe").classList.remove("hidden");
    loadProfile();
  } else alert("Invalid login");
}

// LOAD PROFILE INFO
function loadProfile(){
  const user=JSON.parse(localStorage.getItem("currentUser"));
  if(!user) return;
  document.getElementById("profilePic").src=user.profilePic;
  document.getElementById("displayName").value=user.displayName;
  document.getElementById("balance").innerText=user.balance;
}
