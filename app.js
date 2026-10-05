const ADMIN="zarni19720@gmail.com";
const defaults=[
 {name:"Mobile Legends",emoji:"⚔️",packages:["86 Diamonds","172 Diamonds","257 Diamonds"]},
 {name:"Free Fire",emoji:"🔥",packages:["100 Diamonds","310 Diamonds","520 Diamonds"]},
 {name:"PUBG Mobile",emoji:"🎯",packages:["60 UC","325 UC","660 UC"]},
 {name:"Honor of Kings",emoji:"👑",packages:["80 Tokens","240 Tokens","400 Tokens"]}
];

const $=id=>document.getElementById(id);
let games=JSON.parse(localStorage.getItem("xzgames")||"null")||defaults;
let orders=JSON.parse(localStorage.getItem("xzorders")||"[]");
let selected=null;

function save(){localStorage.setItem("xzgames",JSON.stringify(games));render()}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function render(){
  const q=$("search").value.trim().toLowerCase();
  const list=games.filter(g=>g.name.toLowerCase().includes(q));
  $("gameCount").textContent=list.length+" Games";
  $("games").innerHTML=list.length?list.map((g,i)=>`
    <article class="game-card">
      <div class="game-icon">${g.emoji}</div>
      <h3>${g.name}</h3>
      <div class="pkg-list">${g.packages.map((p,pi)=>`<button class="pkg-btn" data-game="${games.indexOf(g)}" data-pkg="${pi}">${p}<b>›</b></button>`).join("")}</div>
    </article>`).join(""):`<div class="empty">Game မတွေ့ပါဘူး 😕</div>`;
  $("adminGames").innerHTML=games.map((g,i)=>`<div class="admin-item"><span>${g.emoji} ${g.name}</span><button class="delete" data-del="${i}">Delete</button></div>`).join("");
  $("cartCount").textContent=orders.length;
}
function openOrder(gameIndex,pkgIndex){
  selected={gameIndex,pkgIndex};
  const g=games[gameIndex];
  $("selectedEmoji").textContent=g.emoji;
  $("selectedGame").textContent=g.name;
  $("selectedPackage").textContent=g.packages[pkgIndex];
  $("orderBox").hidden=false;
  $("orderMsg").hidden=true;
  $("orderBox").scrollIntoView({behavior:"smooth",block:"start"});
}
function renderOrders(){
  $("ordersList").innerHTML=orders.length?orders.slice().reverse().map(o=>`
    <div class="order-item">
      <div><strong>${o.game}</strong><small>${o.package} • UID ${o.uid}</small><small>${o.contact}</small></div>
      <span class="status">${o.status}</span>
    </div>`).join(""):`<div class="empty">Order မရှိသေးပါဘူး 🛒</div>`;
}
document.addEventListener("click",e=>{
  const pkg=e.target.closest(".pkg-btn");
  if(pkg){openOrder(+pkg.dataset.game,+pkg.dataset.pkg);return}
  const del=e.target.closest("[data-del]");
  if(del){games.splice(+del.dataset.del,1);save();toast("Game ဖျက်ပြီးပါပြီ");return}
  const nav=e.target.closest(".nav-item");
  if(nav){
    document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));nav.classList.add("active");
    if(nav.id==="adminNav"){const email=prompt("Admin Gmail ထည့်ပါ");if(email?.trim().toLowerCase()===ADMIN){$("adminPanel").hidden=false;$("adminPanel").scrollIntoView({behavior:"smooth"});toast("Admin mode ဝင်ပြီးပါပြီ")}else if(email)toast("Admin access denied");return}
    if(nav.dataset.target==="orders"){$("ordersBox").hidden=false;renderOrders();$("ordersBox").scrollIntoView({behavior:"smooth"});}
    else window.scrollTo({top:0,behavior:"smooth"});
  }
});
$("browseBtn").onclick=()=>$("gamesSection").scrollIntoView({behavior:"smooth"});
$("search").oninput=render;
$("closeOrder").onclick=()=>$("orderBox").hidden=true;
$("closeOrders").onclick=()=>$("ordersBox").hidden=true;
$("closeAdmin").onclick=()=>$("adminPanel").hidden=true;
$("cartBtn").onclick=()=>{$("ordersBox").hidden=false;renderOrders();$("ordersBox").scrollIntoView({behavior:"smooth"})};
$("menuBtn").onclick=()=>toast("Menu ready");
$("orderForm").onsubmit=e=>{
 e.preventDefault();
 if(!selected)return;
 const g=games[selected.gameIndex];
 orders.push({id:Date.now(),game:g.name,package:g.packages[selected.pkgIndex],uid:$("uid").value.trim(),server:$("server").value.trim(),contact:$("contact").value.trim(),status:"Pending"});
 localStorage.setItem("xzorders",JSON.stringify(orders));
 $("orderMsg").textContent="✅ Order လက်ခံရရှိပါပြီ။ Admin က ဆက်သွယ်ပေးပါမယ်။";
 $("orderMsg").hidden=false;e.target.reset();$("cartCount").textContent=orders.length;toast("Order တင်ပြီးပါပြီ");
};
$("gameForm").onsubmit=e=>{
 e.preventDefault();
 games.push({name:$("gname").value.trim(),emoji:$("gemoji").value.trim()||"🎮",packages:$("gpackages").value.split(",").map(x=>x.trim()).filter(Boolean)});
 e.target.reset();$("gemoji").value="🎮";save();toast("Game ထည့်ပြီးပါပြီ");
};
render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});
