const canvas=document.getElementById('game');const ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score');const streakEl=document.getElementById('streak');const startBtn=document.getElementById('start');
let w,h,tiles=[],running=false,last=0,score=0,streak=1,palette=0;
const colors=['#ff5a5f','#4ef0ff','#7cff7c','#ffd166'];
let coins=0,dailyBonusClaimed=false,lastLogin=null,highScore=0;
const SAVE_KEY='colorSync_save';
function loadSave(){try{const s=localStorage.getItem(SAVE_KEY);if(s){const d=JSON.parse(s);coins=d.coins||0;dailyBonusClaimed=d.dailyBonusClaimed||false;lastLogin=d.lastLogin||null;highScore=d.highScore||0;}}catch(e){}}
function saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({coins,dailyBonusClaimed,lastLogin,highScore}));}catch(e){}}
function checkDaily(){const today=new Date().toDateString();if(lastLogin!==today){dailyBonusClaimed=false;}if(!dailyBonusClaimed){coins+=50;dailyBonusClaimed=true;lastLogin=today;saveGame();alert('Daily Bonus: +50 coins!');}}
function onGameOver(){running=false;startBtn.style.display='inline-block';if(score>highScore){highScore=score;}coins+=Math.floor(score/10);saveGame();setTimeout(()=>{console.log('Interstitial ad');},500);}
function resize(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;}addEventListener('resize',resize);resize();
function spawn(){tiles.push({y:-50,color:Math.floor(Math.random()*4),speed:2+Math.random()*2});}
function update(dt){if(Math.random()<0.02)spawn();tiles.forEach(t=>t.y+=t.speed*dt*60);if(tiles.length&&tiles[0].y>h){tiles.shift();streak=1;onGameOver();}}
function draw(){ctx.clearRect(0,0,w,h);const laneW=w/2;ctx.fillStyle=colors[palette];ctx.fillRect(w/2-60,h-80,120,40);
ctx.fillStyle='#1e2636';ctx.fillRect(0,h-30,w,30);
ctx.fillStyle='#cfe3ff';ctx.fillText('Swipe to rotate palette',10,20);
for(const t of tiles){ctx.fillStyle=colors[t.color];ctx.fillRect(w/2-40,t.y,80,40);}}
function loop(ts){if(!running) return;const dt=(ts-last)/1000;last=ts;update(dt);draw();scoreEl.textContent=score;streakEl.textContent='x'+streak;requestAnimationFrame(loop);}
function onMatch(){if(!tiles.length) return;const t=tiles[0];if(t.y>h-120 && t.y<h-40){ if(t.color===palette){score+=10*streak;streak=Math.min(10,streak+1);tiles.shift();} else {streak=1;}}}
function rotate(){palette=(palette+1)%4;onMatch();}
startBtn.onclick=()=>{running=true;last=performance.now();score=0;streak=1;loadSave();checkDaily();requestAnimationFrame(loop);startBtn.style.display='none';};
addEventListener('touchstart',(e)=>{e.preventDefault();rotate();},{passive:false});addEventListener('mousedown',rotate);
