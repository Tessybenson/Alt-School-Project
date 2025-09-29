let startTimestamp = null;
let elapsedBefore = 0;
let timerId = null;
const tickInterval = 10;

const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn  = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn   = document.getElementById('lapBtn');
const lapsEl   = document.getElementById('laps');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function formatTime(ms){
  const total = Math.floor(ms);
  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const millis = total % 1000;

  const hh = String(hours).padStart(2,'0');
  const mm = String(minutes).padStart(2,'0');
  const ss = String(seconds).padStart(2,'0');
  const mmm = String(millis).padStart(3,'0');
  return `${hh}:${mm}:${ss}.${mmm}`;
}

function render(){
  const now = performance.now();
  const elapsed = (startTimestamp ? (now - startTimestamp) : 0) + elapsedBefore;
  timeDisplay.textContent = formatTime(elapsed);
}

function start(){
  if (timerId !== null) return;
  startTimestamp = performance.now();
  timerId = setInterval(render, tickInterval);
  render();
  startBtn.setAttribute('disabled','true');
}

function stop(){
  if (timerId === null) return;
  clearInterval(timerId);
  timerId = null;
  const now = performance.now();
  elapsedBefore += now - startTimestamp;
  startTimestamp = null;
  startBtn.removeAttribute('disabled');
  render();
}

function reset(){
  stop();
  elapsedBefore = 0;
  timeDisplay.textContent = '00:00:00.000';
  lapsEl.innerHTML = '';
}

function lap(){
  const now = performance.now();
  const elapsed = (startTimestamp ? (now - startTimestamp) : 0) + elapsedBefore;
  const li = document.createElement('div');
  li.className = 'lap';
  const count = lapsEl.children.length + 1;
  li.innerHTML = `<div>Lap ${count}</div><div>${formatTime(elapsed)}</div>`;
  lapsEl.prepend(li);
}

function setTheme(theme){
  body.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  localStorage.setItem('stopwatch-theme', theme);
}

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

themeToggle.addEventListener('click', ()=>{
  const current = body.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
});

window.addEventListener('keydown', (e)=>{
  if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (e.code === 'Space'){ e.preventDefault(); timerId ? stop() : start(); }
  if (e.key.toLowerCase() === 'l'){ e.preventDefault(); lap(); }
  if (e.key.toLowerCase() === 'r'){ e.preventDefault(); reset(); }
});

(function(){
  const saved = localStorage.getItem('stopwatch-theme') || 'dark';
  setTheme(saved);
})();
render();
