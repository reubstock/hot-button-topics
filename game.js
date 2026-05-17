// Hot Button Topics — curated list
// "hot: true" makes the character's head explode.
// "hot: false" returns Enlightenment.
const TOPICS = [
  // The classics — third-rail at any dinner party
  { label: "Politics",          hot: true  },
  { label: "Religion",          hot: true  },
  { label: "Abortion",          hot: true  },
  { label: "Gun Control",       hot: true  },
  { label: "Immigration",       hot: true  },
  { label: "Climate Change",    hot: true  },
  { label: "Israel / Palestine",hot: true  },
  { label: "Trans Rights",      hot: true  },
  { label: "Vaccines",          hot: true  },
  { label: "Race",              hot: true  },
  { label: "Your Salary",       hot: true  },
  { label: "Cancel Culture",    hot: true  },

  // The safe ones — pure enlightenment
  { label: "The Weather",       hot: false },
  { label: "Dogs vs Cats",      hot: false },
  { label: "Pizza Toppings",    hot: false },
  { label: "Best Pixar Movie",  hot: false },
  { label: "Coffee Order",      hot: false },
  { label: "Naps",              hot: false },
  { label: "Houseplants",       hot: false },
  { label: "Beach or Mountain", hot: false },
  { label: "Cilantro",          hot: false },
  { label: "Tabs vs Spaces",    hot: false },
  { label: "The Oxford Comma",  hot: false },
  { label: "Sourdough",         hot: false },
];

const ENLIGHTENMENT_LINES = [
  "Enlightenment.",
  "Inner peace.",
  "Mmm. Nice.",
  "Pure serenity.",
  "Ahhh.",
  "All is well.",
];

const wall = document.getElementById("wall");
const avatarWrap = document.getElementById("avatar-wrap");
const avatar = document.getElementById("avatar");
const speech = document.getElementById("speech");
const boom = document.getElementById("boom");
const flash = document.getElementById("flash");
const stage = document.getElementById("stage");
const debrisLayer = document.getElementById("debris");
const head = document.getElementById("head");
const hitsEl = document.getElementById("hits");
const boomsEl = document.getElementById("booms");
const resetBtn = document.getElementById("reset");
const floor = document.getElementById("floor");

// Walking speed: pixels per second
const WALK_PX_PER_SEC = 280;
const WALK_MIN_MS = 280;
const WALK_MAX_MS = 1600;

let hits = 0;
let booms = 0;
let busy = false;

// Shuffle topics for replayability
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderWall() {
  wall.innerHTML = "";
  const shuffled = shuffle(TOPICS);
  shuffled.forEach((topic) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hot-button";
    btn.dataset.hot = topic.hot ? "1" : "0";
    btn.dataset.label = topic.label;
    btn.innerHTML = `<span class="dome"></span><span class="label">${topic.label}</span>`;
    btn.addEventListener("click", () => handlePress(btn, topic));
    wall.appendChild(btn);
  });
}

function setBusy(state) {
  busy = state;
  document.querySelectorAll(".hot-button").forEach(b => b.disabled = state);
}

function clearSpeech() {
  speech.classList.remove("show", "enlightenment", "boom");
  speech.textContent = "";
}

function showSpeech(text, type) {
  speech.classList.remove("hidden");
  speech.textContent = text;
  speech.classList.add("show", type);
}

// Compute target X for avatar (centered under the button)
function getTargetX(btn) {
  const dome = btn.querySelector(".dome");
  const rect = dome.getBoundingClientRect();
  const floorRect = floor.getBoundingClientRect();
  return rect.left + rect.width / 2 - floorRect.left;
}

async function handlePress(btn, topic) {
  if (busy) return;
  setBusy(true);
  clearSpeech();

  const startLeft = avatarWrap.getBoundingClientRect().left + avatarWrap.offsetWidth / 2 - floor.getBoundingClientRect().left;
  const targetX = getTargetX(btn);

  // Face the right direction
  if (targetX < startLeft - 4) {
    avatarWrap.classList.add("facing-left");
  } else if (targetX > startLeft + 4) {
    avatarWrap.classList.remove("facing-left");
  }

  // Walk — scale duration by distance so speed is constant
  const distance = Math.abs(targetX - startLeft);
  const walkMs = Math.max(WALK_MIN_MS, Math.min(WALK_MAX_MS, (distance / WALK_PX_PER_SEC) * 1000));
  avatarWrap.style.transition = `left ${walkMs}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;

  if (distance > 4) {
    avatarWrap.classList.add("walking");
    avatarWrap.style.left = `${targetX}px`;
    await waitForTransition(avatarWrap, "left");
    avatarWrap.classList.remove("walking");
  }

  // Face forward to press
  avatarWrap.classList.remove("facing-left");

  // Press arm up
  avatarWrap.classList.add("pressing");
  await sleep(220);
  btn.classList.add("pressing");
  await sleep(180);

  // Outcome
  if (topic.hot) {
    await explode(btn);
  } else {
    await enlighten(btn);
  }

  // Reset button visual
  btn.classList.remove("pressing");
  avatarWrap.classList.remove("pressing");

  setBusy(false);
}

async function enlighten(btn) {
  const line = ENLIGHTENMENT_LINES[Math.floor(Math.random() * ENLIGHTENMENT_LINES.length)];
  showSpeech(line, "enlightenment");
  avatarWrap.classList.add("enlightened");
  hits += 1;
  hitsEl.textContent = hits;
  pulseCounter(hitsEl);
  await sleep(1400);
  avatarWrap.classList.remove("enlightened");
  clearSpeech();
}

async function explode(btn) {
  // Position the boom over the avatar's head
  const wrapRect = avatarWrap.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  boom.style.left = `${wrapRect.left + wrapRect.width / 2 - stageRect.left}px`;
  boom.style.top  = `${wrapRect.top - stageRect.top + 18}px`;
  boom.classList.remove("hidden");
  boom.classList.remove("go");
  void boom.offsetWidth;
  boom.classList.add("go");

  // Screen flash + shake
  flash.classList.remove("hidden");
  flash.classList.remove("go");
  void flash.offsetWidth;
  flash.classList.add("go");

  stage.classList.remove("shake");
  void stage.offsetWidth;
  stage.classList.add("shake");

  // Spawn debris dots
  spawnDebris(18);

  // Trigger head fly + body shudder
  avatarWrap.classList.add("exploding");
  showSpeech("💥 HOT!", "boom");
  await sleep(1100);
  avatarWrap.classList.add("headless");

  booms += 1;
  boomsEl.textContent = booms;
  pulseCounter(boomsEl);

  await sleep(900);

  // Regrow head
  avatarWrap.classList.remove("exploding", "headless");
  avatarWrap.classList.add("regrowing");
  clearDebris();
  clearSpeech();
  boom.classList.remove("go");
  boom.classList.add("hidden");
  flash.classList.add("hidden");
  stage.classList.remove("shake");
  await sleep(520);
  avatarWrap.classList.remove("regrowing");
}

function pulseCounter(el) {
  el.classList.remove("pulse");
  void el.offsetWidth;
  el.classList.add("pulse");
}

function spawnDebris(n) {
  clearDebris();
  for (let i = 0; i < n; i++) {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", "30");
    dot.setAttribute("cy", "24");
    dot.setAttribute("r", String(1.2 + Math.random() * 1.6));
    const palette = ["#e23a2e", "#ffb347", "#f0c9a3", "#922c2c", "#ffd76b"];
    dot.setAttribute("fill", palette[Math.floor(Math.random() * palette.length)]);
    dot.classList.add("debris-dot");
    const angle = (Math.PI * (Math.random() * 1.0 + 1.0)) * -1; // upward arc
    const dist  = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const rot = (Math.random() * 720 - 360) + "deg";
    dot.style.setProperty("--dx", `${dx}px`);
    dot.style.setProperty("--dy", `${dy}px`);
    dot.style.setProperty("--rot", rot);
    debrisLayer.appendChild(dot);
  }
}

function clearDebris() {
  while (debrisLayer.firstChild) debrisLayer.removeChild(debrisLayer.firstChild);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function waitForTransition(el, prop) {
  return new Promise(resolve => {
    let done = false;
    const finish = (e) => {
      if (e && e.propertyName && e.propertyName !== prop) return;
      if (done) return;
      done = true;
      el.removeEventListener("transitionend", finish);
      resolve();
    };
    el.addEventListener("transitionend", finish);
    // Safety fallback in case transitionend doesn't fire
    setTimeout(finish, 1500);
  });
}

resetBtn.addEventListener("click", () => {
  if (busy) return;
  hits = 0;
  booms = 0;
  hitsEl.textContent = "0";
  boomsEl.textContent = "0";
  renderWall();
  // Snap avatar back to center without animating
  avatarWrap.style.transition = "none";
  const floorRect = floor.getBoundingClientRect();
  avatarWrap.style.left = `${floorRect.width / 2}px`;
  avatarWrap.classList.remove("facing-left", "walking", "pressing", "exploding", "headless", "regrowing", "enlightened");
  clearDebris();
  clearSpeech();
  // Restore default transition on next frame
  requestAnimationFrame(() => { avatarWrap.style.transition = ""; });
});

// Initial render — position avatar at center of floor after layout
window.addEventListener("load", () => {
  renderWall();
  // Center the avatar in the floor (use pixel left so transitions work)
  const floorRect = floor.getBoundingClientRect();
  avatarWrap.style.left = `${floorRect.width / 2}px`;
});

// Reposition on resize so the avatar stays sensible
let resizeT;
window.addEventListener("resize", () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if (busy) return;
    const floorRect = floor.getBoundingClientRect();
    avatarWrap.style.left = `${floorRect.width / 2}px`;
  }, 200);
});
