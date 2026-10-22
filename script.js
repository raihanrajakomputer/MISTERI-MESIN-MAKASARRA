const loginPage=document.getElementById("login-page");
const gamePage=document.getElementById("game-page");
const nameInput=document.getElementById("name-input");
const loginBtn=document.getElementById("login-btn");
const spinBtn=document.getElementById("spin-btn");
const pointsEl=document.getElementById("points");
const playerNameEl=document.getElementById("player-name");
const resultTitle=document.getElementById("result-title");
const resultMessage=document.getElementById("result-message");
const resultIcon=document.getElementById("result-icon");
const collectionList=document.getElementById("collection-list");
const collectionCount=document.getElementById("collection-count");
const machine=document.querySelector(".machine");
const dispense=document.getElementById("dispense");
const toast=document.getElementById("toast");

const rewardOverlay=document.getElementById("reward-overlay");
const closeReward=document.getElementById("close-reward");
const tiktokBtn=document.getElementById("tiktok-btn");
const claimBtn=document.getElementById("claim-btn");

const COST=150;
const START_POINTS=1000;
const TIKTOK_REWARD=500;
const TIKTOK_URL="https://www.tiktok.com/@ryoiko_?is_from_webapp=1&sender_device=pc";

const balls=[
  {id:"orange-1",rarity:"BIASA",color:"orange",title:"TENA NANIKI.",message:"Tena ji waktunna. Maliangko putar.",weight:35},
  {id:"orange-2",rarity:"BIASA",color:"orange",title:"LAMPA MAE.",message:"Mesingna mappasulu' ball, janganki kuttu.",weight:25},
  {id:"yellow-1",rarity:"TENA BIASA",color:"yellow",title:"PLOT TWIST.",message:"Erokmi begini, mingka lainji antu.",weight:18},
  {id:"yellow-2",rarity:"TENA BIASA",color:"yellow",title:"KAMASEANG.",message:"Dalle'na baguski sedikit hari anne.",weight:12},
  {id:"orange-3",rarity:"JAI NILAINA",color:"orange",title:"PAKARENA.",message:"Anne waktunnu. Cini'ko pole balla pa.",weight:6},
  {id:"yellow-3",rarity:"JAI NILAINA",color:"yellow",title:"RAHASIANA.",message:"Niak balla na tena kusare kabaranna.",weight:3},
  {id:"orange-4",rarity:"RARA",color:"orange",title:"???",message:"Mesing anne tong tena naisseng.",weight:.8},
  {id:"yellow-4",rarity:"LEGENDARI",color:"yellow",title:"ANJO MI.",message:"Nialle'ji balla paling jarang. Tarima kasih!",weight:.2}
];

function getData(){
  return JSON.parse(localStorage.getItem("mysteryBallData"))||null;
}

function saveData(data){
  localStorage.setItem("mysteryBallData",JSON.stringify(data));
}

function normalizeData(data){
  if(!data.collection) data.collection=[];
  if(typeof data.tiktokRewardClaimed!=="boolean") data.tiktokRewardClaimed=false;
  if(typeof data.points!=="number") data.points=START_POINTS;
  return data;
}

function showToast(text){
  toast.textContent=text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200);
}

function openRewardModal(){
  rewardOverlay.classList.add("show");
  rewardOverlay.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");

  const data=getData();
  const claimed=data && data.tiktokRewardClaimed;

  if(claimed){
    claimBtn.disabled=true;
    claimBtn.textContent="LE'BA' NAALLEMI BONUS";
  }else{
    claimBtn.disabled=false;
    claimBtn.textContent=`LE'BA' FOLLOW • ALLE +${TIKTOK_REWARD}`;
  }
}

function closeRewardModal(){
  rewardOverlay.classList.remove("show");
  rewardOverlay.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

function enterGame(data){
  data=normalizeData(data);
  saveData(data);
  playerNameEl.textContent=data.name.toUpperCase();
  pointsEl.textContent=data.points;
  loginPage.classList.remove("active");
  gamePage.classList.add("active");
  renderCollection(data.collection);
}

loginBtn.addEventListener("click",()=>{
  const name=nameInput.value.trim();

  if(!name){
    showToast("Tulis arengta dulu.");
    nameInput.focus();
    return;
  }

  let data=getData();

  if(!data){
    data={name,points:START_POINTS,collection:[],tiktokRewardClaimed:false};
    saveData(data);
    showToast("Salamakki! +1000 poin.");
  }else{
    data=normalizeData(data);
    data.name=name;
    saveData(data);
    showToast("Salamakki battu mae.");
  }

  enterGame(data);
});

nameInput.addEventListener("keydown",e=>{
  if(e.key==="Enter") loginBtn.click();
});

function weightedPick(){
  const total=balls.reduce((sum,b)=>sum+b.weight,0);
  let random=Math.random()*total;
  for(const ball of balls){
    random-=ball.weight;
    if(random<=0) return ball;
  }
  return balls[0];
}

function makeConfetti(){
  const pieces=16;
  for(let i=0;i<pieces;i++){
    const el=document.createElement("span");
    el.className="confetti";
    el.style.left="50%";
    el.style.top="47%";
    el.style.background=i%2===0?"var(--yellow)":"var(--orange)";
    el.style.setProperty("--dx",`${(Math.random()*420)-210}px`);
    el.style.setProperty("--dy",`${(Math.random()*300)+40}px`);
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),950);
  }
}

function finishSpin(data,ball){
  machine.classList.remove("spinning");
  machine.classList.add("win");

  setTimeout(()=>machine.classList.remove("win"),700);

  dispense.textContent="●";
  resultIcon.textContent="●";
  resultIcon.style.background=ball.color==="yellow"?"var(--yellow)":"var(--orange)";
  resultTitle.textContent=ball.title;
  resultMessage.textContent=ball.message;

  if(!data.collection.includes(ball.id)){
    data.collection.push(ball.id);
    showToast("Ball baru masuk koleksita!");
    makeConfetti();
  }else{
    showToast("Ballna sudah pernah nialle.");
  }

  saveData(data);
  renderCollection(data.collection);
}

spinBtn.addEventListener("click",()=>{
  let data=getData();

  if(!data){
    showToast("Masukki dulu.");
    return;
  }

  data=normalizeData(data);

  if(data.points<COST){
    openRewardModal();
    return;
  }

  data.points-=COST;
  saveData(data);
  pointsEl.textContent=data.points;

  spinBtn.disabled=true;
  machine.classList.remove("win");
  machine.classList.add("spinning");
  dispense.textContent="●";

  setTimeout(()=>{
    const ball=weightedPick();
    spinBtn.disabled=false;
    finishSpin(data,ball);
  },850);
});

tiktokBtn.addEventListener("click",()=>{
  window.open(TIKTOK_URL,"_blank","noopener,noreferrer");
  showToast("Lampa ri TikTok, follow dulu!");
});

claimBtn.addEventListener("click",()=>{
  const data=normalizeData(getData());

  if(data.tiktokRewardClaimed){
    showToast("Bonusna le'ba' nialle.");
    return;
  }

  data.points+=TIKTOK_REWARD;
  data.tiktokRewardClaimed=true;
  saveData(data);

  pointsEl.textContent=data.points;
  claimBtn.disabled=true;
  claimBtn.textContent="LE'BA' NAALLEMI BONUS";
  showToast(`Tarima! +${TIKTOK_REWARD} poin.`);
  makeConfetti();

  setTimeout(closeRewardModal,600);
});

closeReward.addEventListener("click",closeRewardModal);

rewardOverlay.addEventListener("click",e=>{
  if(e.target===rewardOverlay) closeRewardModal();
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape" && rewardOverlay.classList.contains("show")){
    closeRewardModal();
  }
});

function renderCollection(ids){
  collectionList.innerHTML="";

  if(ids.length===0){
    collectionList.innerHTML='<div class="collection-item"><strong>TENA JI BALL.</strong><span>Putarki mesin.</span></div>';
  }else{
    ids.forEach(id=>{
      const ball=balls.find(item=>item.id===id);
      if(!ball) return;

      const item=document.createElement("div");
      item.className="collection-item";

      item.innerHTML=`
        <div class="collection-ball" style="background:${ball.color==="yellow"?"var(--yellow)":"var(--orange)"}"></div>
        <strong>${ball.title}</strong>
        <span>${ball.rarity}</span>
      `;

      collectionList.appendChild(item);
    });
  }

  collectionCount.textContent=`${ids.length} / ${balls.length}`;
}

const saved=getData();

if(saved){
  enterGame(saved);
}else{
  loginPage.classList.add("active");
}
