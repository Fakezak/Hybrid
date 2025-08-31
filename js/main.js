// Simple local storage simulation for backend
if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify([]));

const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function(e){
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem("users"));
        if (users.find(u => u.username === username)) {
            alert("Username exists!");
            return;
        }
        users.push({username, email, password, balance:1, profilePic:"default.png"});
        localStorage.setItem("users", JSON.stringify(users));
        alert("Account created!");
        window.location.href = "login.html";
    });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        let users = JSON.parse(localStorage.getItem("users"));
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "profile.html";
        } else {
            alert("Invalid login");
        }
    });
}

const saveProfile = document.getElementById("saveProfile");
if (saveProfile) {
    saveProfile.addEventListener("click", function(){
        const displayName = document.getElementById("displayName").value;
        const uploadPic = document.getElementById("uploadPic").files[0];
        let users = JSON.parse(localStorage.getItem("users"));
        let user = JSON.parse(localStorage.getItem("currentUser"));

        if (uploadPic) {
            const reader = new FileReader();
            reader.onload = function(e){
                user.profilePic = e.target.result;
                updateUser(user, users);
            }
            reader.readAsDataURL(uploadPic);
        }
        user.displayName = displayName;
        updateUser(user, users);
    });
}

function updateUser(user, users){
    const index = users.findIndex(u => u.username === user.username);
    users[index] = user;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));
    document.getElementById("balance").innerText = user.balance;
    document.getElementById("profilePic").src = user.profilePic;
    alert("Profile updated!");
}
