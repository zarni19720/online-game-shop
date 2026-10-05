const ADMIN="zarni19720@gmail.com";
const defaults=[{name:"Mobile Legends",emoji:"⚔️",packages:["86 Diamonds","172 Diamonds","257 Diamonds"]},{name:"Free Fire",emoji:"🔥",packages:["100 Diamonds","310 Diamonds","520 Diamonds"]},{name:"PUBG Mobile",emoji:"🔫",packages:["60 UC","325 UC","660 UC"]}];
let games=JSON.parse(localStorage.getItem("games")||"null")||defaults;const $=id=>document.getElementById(id);
function save(){localStorage.setItem("games",JSON.stringify(games));render()}
function render(){$("games").innerHTML=games.map((g,i)=>`<article class="card"><div class="emoji">${g.emoji}</div><h3>${g.name}</h3><div class="packages">${g.packages.map(p=>`<button class="pkg" onclick="choose(${i},${JSON.stringify(p)})">${p}</button>`).join("")}</div></article>`).join("");
$("adminGames").innerHTML=games.map((g,i)=>`<div class="admin-item"><span>${g.emoji} ${g.name}</span><button onclick="delGame(${i})">Delete</button></div>`).join("")}
window.choose=(i,p)=>{$("orderBox").hidden=false;$("game").value=games[i].name;$("package").value=p;scrollTo({top:$("orderBox").offsetTop-60,behavior:"smooth"})};
window.delGame=i=>{games.splice(i,1);save()};
$("orderForm").onsubmit=e=>{e.preventDefault();$("orderMsg").textContent="Order လက်ခံရရှိပါပြီ။ Admin က ဆက်သွယ်ပေးပါမယ်။";e.target.reset()};
$("adminBtn").onclick=()=>{const email=prompt("Admin Gmail ထည့်ပါ");if(email?.trim().toLowerCase()===ADMIN)$("adminPanel").hidden=false;else if(email)alert("Admin access denied")};
$("logoutBtn").onclick=()=>{$("adminPanel").hidden=true};
$("gameForm").onsubmit=e=>{e.preventDefault();games.push({name:$("gname").value,emoji:$("gemoji").value||"🎮",packages:["New Package"]});e.target.reset();save()};
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");render();