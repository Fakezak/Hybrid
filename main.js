// LocalStorage setup
if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify([]));
if (!localStorage.getItem("posts")) localStorage.setItem("posts", JSON.stringify([]));
if (!localStorage.getItem("chats")) localStorage.setItem("chats", JSON.stringify([]));
if (!localStorage.getItem("stories")) localStorage.setItem("stories", JSON.stringify([]));
if (!localStorage.getItem("store")) {
    localStorage.setItem("store", JSON.stringify([
        {id:1,name:"Red Theme",type:"theme",price:5},
        {id:2,name:"Cool Sticker",type:"sticker",price:2}
    ]));
}

// SIGNUP / LOGIN (same as before)
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
        users.push({username,email,password,balance:1,profilePic:"default.png",displayName:""});
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

// PROFILE UPDATE (same as before)
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
    const balanceEl = document.getElementById("balance") || document.getElementById("balanceStore");
    if(balanceEl) balanceEl.innerText = user.balance;
    const profilePicEl = document.getElementById("profilePic");
    if(profilePicEl) profilePicEl.src = user.profilePic;
    alert("Profile updated!");
}

// POSTS + STORIES
const postBtn = document.getElementById("postBtn");
if(postBtn){
    postBtn.addEventListener("click", function(){
        const text = document.getElementById("postText").value;
        const media = document.getElementById("postMedia").files[0];
        let posts = JSON.parse(localStorage.getItem("posts"));
        const user = JSON.parse(localStorage.getItem("currentUser"));
        let mediaURL = "";
        if(media){
            const reader = new FileReader();
            reader.onload = function(e){
                mediaURL = e.target.result;
                posts.push({user:user.username,text,media:mediaURL,likes:0,comments:[]});
                localStorage.setItem("posts", JSON.stringify(posts));
                alert("Post created!");
                location.reload();
            }
            reader.readAsDataURL(media);
        } else {
            posts.push({user:user.username,text,media:mediaURL,likes:0,comments:[]});
            localStorage.setItem("posts", JSON.stringify(posts));
            alert("Post created!");
            location.reload();
        }
    });
}

// RENDER POSTS
const feedContainer = document.getElementById("feedContainer");
if(feedContainer){
    const posts = JSON.parse(localStorage.getItem("posts"));
    posts.forEach(p=>{
        const div = document.createElement("div");
        div.className="post";
        div.innerHTML=`<p><b>${p.user}</b></p><p>${p.text}</p>${p.media?`<img src="${p.media}" width="200">`:''}<p>Likes: ${p.likes}</p>`;
        feedContainer.appendChild(div);
    });
}

// STORE
const storeItemsContainer = document.getElementById("storeItems");
if(storeItemsContainer){
    const store = JSON.parse(localStorage.getItem("store"));
    const user = JSON.parse(localStorage.getItem("currentUser"));
    store.forEach(item=>{
        const div = document.createElement("div");
        div.innerHTML=`<p>${item.name} - $${item.price}</p><button onclick="buyItem(${item.id})">Buy</button>`;
        storeItemsContainer.appendChild(div);
    });
    document.getElementById("balanceStore").innerText=user.balance;
}

function buyItem(id){
    let store = JSON.parse(localStorage.getItem("store"));
    let user = JSON.parse(localStorage.getItem("currentUser"));
    const item = store.find(i=>i.id===id);
    if(user.balance>=item.price){
        user.balance -= item.price;
        localStorage.setItem("currentUser",JSON.stringify(user));
        let users = JSON.parse(localStorage.getItem("users"));
        const index = users.findIndex(u=>u.username===user.username);
        users[index]=user;
        localStorage.setItem("users",JSON.stringify(users));
        alert("Item purchased!");
        location.reload();
    } else {
        alert("Not enough balance!");
    }
}

// DAILY BALANCE ADD
const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
if(user){
    const today = new Date().toDateString();
    if(localStorage.getItem(`lastReward_${user.username}`)!==today){
        user.balance +=1;
        localStorage.setItem(`lastReward_${user.username}`,today);
        localStorage.setItem("currentUser",JSON.stringify(user));
        let users = JSON.parse(localStorage.getItem("users"));
        const index = users.findIndex(u=>u.username===user.username);
        users[index]=user;
        localStorage.setItem("users",JSON.stringify(users));
    }
}
