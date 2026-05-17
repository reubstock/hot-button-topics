// Hot Button Topics — curated list with reveal blurbs.
// "hot: true" makes the character's head explode.
// "hot: false" returns Enlightenment.
const TOPICS = [
  // The third rails
  { label: "Politics",           hot: true,  blurb: "You picked a team out loud. The other team is here. Goodnight." },
  { label: "Religion",           hot: true,  blurb: "Two thousand years of theology against three thousand years of theology. Mostly with forks." },
  { label: "Abortion",           hot: true,  blurb: "There is no version of this conversation where you don't lose someone." },
  { label: "Gun Control",        hot: true,  blurb: "Half the room cites the constitution. The other half cites the news. Nobody updates." },
  { label: "Immigration",        hot: true,  blurb: "Everyone at this table is now an immigration economist." },
  { label: "Climate Change",     hot: true,  blurb: "The science is settled. The dinner is not." },
  { label: "Israel / Palestine", hot: true,  blurb: "Pick a side. You're wrong." },
  { label: "Trans Rights",       hot: true,  blurb: "Whatever you said, someone is writing the Substack already." },
  { label: "Vaccines",           hot: true,  blurb: "'I'm just asking questions' has entered the chat. The chat is now four hours long." },
  { label: "Race",               hot: true,  blurb: "Best case scenario: you stayed quiet. You did not stay quiet." },
  { label: "Your Salary",        hot: true,  blurb: "Telling them was a one-way door. The door has locked." },
  { label: "Cancel Culture",     hot: true,  blurb: "Ironic, given what just happened to your head." },

  // Safely enlightening
  { label: "The Weather",        hot: false, blurb: "Universally safe. The diplomatic protocol of elevators worldwide." },
  { label: "Dogs vs Cats",       hot: false, blurb: "A divide so old it has achieved zen. The dogs do not care. The cats never did." },
  { label: "Pizza Toppings",     hot: false, blurb: "Pineapple is on the menu. Civilization, somehow, holds." },
  { label: "Best Pixar Movie",   hot: false, blurb: "It's Up. It is always Up. Anyone who says otherwise will cry in ten minutes anyway." },
  { label: "Coffee Order",       hot: false, blurb: "Whatever you ordered, the barista has heard worse before noon." },
  { label: "Naps",               hot: false, blurb: "Universally pro. The closest the species has come to peace." },
  { label: "Houseplants",        hot: false, blurb: "You will be told your fiddle leaf needs 'more indirect light'. You will nod." },
  { label: "Beach or Mountain",  hot: false, blurb: "Correct answer: whichever one you're currently at." },
  { label: "Cilantro",           hot: false, blurb: "Some taste soap. They are not wrong. They are also not invited back." },
  { label: "Tabs vs Spaces",     hot: false, blurb: "Developers know the answer is tabs. They use spaces anyway. Move on." },
  { label: "The Oxford Comma",   hot: false, blurb: "Defended by people who own three dictionaries and one cat." },
  { label: "Sourdough",          hot: false, blurb: "A 2020 pandemic hobby. Still hanging around the kitchen out of obligation." },
];

// Button color palette — anything except red and green (those telegraph hot/safe).
const BUTTON_COLORS = [
  { light: "#7ab3ff", base: "#3a7dff", dark: "#1a4a99", glow: "rgba(60, 130, 255, 0.55)" },
  { light: "#c98aff", base: "#a155ff", dark: "#6024aa", glow: "rgba(160, 80, 255, 0.55)" },
  { light: "#ffa3c8", base: "#ff5fa5", dark: "#a02565", glow: "rgba(255, 100, 170, 0.55)" },
  { light: "#ffe585", base: "#ffd23f", dark: "#b08010", glow: "rgba(255, 210, 60, 0.55)" },
  { light: "#7cf5e6", base: "#2ee8d0", dark: "#168a7c", glow: "rgba(46, 230, 200, 0.55)" },
  { light: "#e88adf", base: "#d147c4", dark: "#7a1f72", glow: "rgba(210, 80, 200, 0.55)" },
  { light: "#ffb878", base: "#ff9234", dark: "#a85a10", glow: "rgba(255, 150, 60, 0.55)" },
  { light: "#d5c6ff", base: "#b9a4ff", dark: "#7058c2", glow: "rgba(190, 170, 255, 0.55)" },
  { light: "#5fc8c4", base: "#1ea5a1", dark: "#0b6260", glow: "rgba(40, 180, 175, 0.55)" },
  { light: "#f0d27a", base: "#d4af37", dark: "#8a6810", glow: "rgba(220, 180, 60, 0.55)" },
];

const wall = document.getElementById("wall");
const avatarWrap = document.getElementById("avatar-wrap");
const boom = document.getElementById("boom");
const shockwave = document.getElementById("shockwave");
const fireball = document.getElementById("fireball");
const flash = document.getElementById("flash");
const stage = document.getElementById("stage");
const stageDebris = document.getElementById("stage-debris");
const hitsEl = document.getElementById("hits");
const boomsEl = document.getElementById("booms");
const resetBtn = document.getElementById("reset");
const floor = document.getElementById("floor");

const cardBackdrop = document.getElementById("card-backdrop");
const card = document.getElementById("card");
const cardIcon = document.getElementById("card-icon");
const cardTopic = document.getElementById("card-topic");
const cardBlurb = document.getElementById("card-blurb");
const cardDismiss = document.getElementById("card-dismiss");

// Walking speed: pixels per second
const WALK_PX_PER_SEC = 280;
const WALK_MIN_MS = 280;
const WALK_MAX_MS = 1600;

let hits = 0;
let booms = 0;
let busy = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickColor() {
  return BUTTON_COLORS[Math.floor(Math.random() * BUTTON_COLORS.length)];
}

function renderWall() {
  wall.innerHTML = '<div class="wall-sign">⚠ HIGH VOLTAGE</div>';
  const shuffled = shuffle(TOPICS);
  shuffled.forEach((topic) => {
    const color = pickColor();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hot-button";
    btn.dataset.hot = topic.hot ? "1" : "0";
    btn.style.setProperty("--btn-light", color.light);
    btn.style.setProperty("--btn-base",  color.base);
    btn.style.setProperty("--btn-dark",  color.dark);
    btn.style.setProperty("--btn-glow",  color.glow);
    btn.innerHTML = `<span class="dome"></span><span class="label">${topic.label}</span>`;
    btn.addEventListener("click", () => handlePress(btn, topic));
    wall.appendChild(btn);
  });
}

function setBusy(state) {
  busy = state;
  document.querySelectorAll(".hot-button:not(.spent)").forEach(b => b.disabled = state);
}

// ----- coordinate helpers (stage-relative) -----
function stageRect() { return stage.getBoundingClientRect(); }

function buttonCenterInStage(btn) {
  const dome = btn.querySelector(".dome");
  const r = dome.getBoundingClientRect();
  const s = stageRect();
  return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top };
}

function targetXForFloor(btn) {
  const dome = btn.querySelector(".dome");
  const r = dome.getBoundingClientRect();
  const f = floor.getBoundingClientRect();
  return r.left + r.width / 2 - f.left;
}

async function handlePress(btn, topic) {
  if (busy || btn.classList.contains("spent")) return;
  setBusy(true);

  // Walk
  const startLeft = avatarWrap.getBoundingClientRect().left + avatarWrap.offsetWidth / 2 - floor.getBoundingClientRect().left;
  const targetX = targetXForFloor(btn);

  if (targetX < startLeft - 4) avatarWrap.classList.add("facing-left");
  else if (targetX > startLeft + 4) avatarWrap.classList.remove("facing-left");

  const distance = Math.abs(targetX - startLeft);
  const walkMs = Math.max(WALK_MIN_MS, Math.min(WALK_MAX_MS, (distance / WALK_PX_PER_SEC) * 1000));
  avatarWrap.style.transition = `left ${walkMs}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;

  if (distance > 4) {
    avatarWrap.classList.add("walking");
    avatarWrap.style.left = `${targetX}px`;
    await waitForTransition(avatarWrap, "left");
    avatarWrap.classList.remove("walking");
  }
  avatarWrap.classList.remove("facing-left");

  // Press
  avatarWrap.classList.add("pressing");
  await sleep(220);
  btn.classList.add("pressing");
  await sleep(160);

  // Outcome plays at the button
  const center = buttonCenterInStage(btn);
  if (topic.hot) {
    await explodeAt(center);
  } else {
    await enlightenAt(center);
  }

  // Reveal card
  await showCard(topic);

  // Wind down — arm back, button locked open with label revealed
  btn.classList.remove("pressing");
  avatarWrap.classList.add("arm-resetting");
  setTimeout(() => avatarWrap.classList.remove("arm-resetting", "pressing"), 320);

  // If exploded, regrow the head once the card is dismissed
  if (topic.hot) {
    avatarWrap.classList.remove("exploding", "headless");
    avatarWrap.classList.add("regrowing");
    await sleep(520);
    avatarWrap.classList.remove("regrowing");
  } else {
    avatarWrap.classList.remove("enlightened");
  }

  // Mark spent + reveal label
  btn.classList.add("spent");
  btn.classList.add(topic.hot ? "spent-hot" : "spent-cool");
  btn.disabled = true;

  setBusy(false);

  // If all spent, no more presses available
  if (document.querySelectorAll(".hot-button:not(.spent)").length === 0) {
    // leave alone — user can reset
  }
}

async function enlightenAt(center) {
  // Soft sparkle at the button + aura around avatar's head
  spawnSparkles(center, 14);
  avatarWrap.classList.add("enlightened");
  hits += 1;
  hitsEl.textContent = hits;
  pulseCounter(hitsEl);
  await sleep(900);
}

async function explodeAt(center) {
  // Position FX layers at button
  positionAt(boom, center);
  positionAt(shockwave, center);
  positionAt(fireball, center);

  // Restart animations
  restartAnimation(boom, "go");
  restartAnimation(shockwave, "go");
  restartAnimation(fireball, "go");
  restartAnimation(flash, "go");
  restartAnimation(stage, "shake");

  // Stage-level debris from the button
  spawnDebrisAt(center, 28);

  // Avatar's head reacts to the blast
  avatarWrap.classList.add("exploding");

  await sleep(1300);
  avatarWrap.classList.add("headless");

  booms += 1;
  boomsEl.textContent = booms;
  pulseCounter(boomsEl);

  // Brief beat before the card pops up
  await sleep(280);

  // Clean up FX layers (they've already faded)
  boom.classList.add("hidden");
  shockwave.classList.add("hidden");
  fireball.classList.add("hidden");
  flash.classList.add("hidden");
  stage.classList.remove("shake");
}

function positionAt(el, center) {
  el.classList.remove("hidden");
  el.style.left = `${center.x}px`;
  el.style.top  = `${center.y}px`;
}

function restartAnimation(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function spawnDebrisAt(center, count) {
  clearDebris();
  const palette = ["#ff5050", "#ffb347", "#ffd76b", "#f0c9a3", "#ffffff", "#ff8a3a"];
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "debris-dot";
    const size = 5 + Math.random() * 7;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    const color = palette[Math.floor(Math.random() * palette.length)];
    dot.style.background = color;
    dot.style.color = color; // for the box-shadow glow via currentColor
    dot.style.left = `${center.x}px`;
    dot.style.top  = `${center.y}px`;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 90 + Math.random() * 200;
    dot.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    dot.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    dot.style.setProperty("--rot", `${(Math.random() * 720 - 360)}deg`);
    stageDebris.appendChild(dot);
  }
  // Remove debris after they finish animating
  setTimeout(clearDebris, 1300);
}

function spawnSparkles(center, count) {
  clearDebris();
  const palette = ["#ffd76b", "#fff3c0", "#ffeb9c", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "debris-dot";
    const size = 4 + Math.random() * 5;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    const color = palette[Math.floor(Math.random() * palette.length)];
    dot.style.background = color;
    dot.style.color = color;
    dot.style.left = `${center.x}px`;
    dot.style.top  = `${center.y}px`;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 50 + Math.random() * 90;
    dot.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    dot.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    dot.style.setProperty("--rot", `${(Math.random() * 360 - 180)}deg`);
    stageDebris.appendChild(dot);
  }
  setTimeout(clearDebris, 1300);
}

function clearDebris() {
  while (stageDebris.firstChild) stageDebris.removeChild(stageDebris.firstChild);
}

function pulseCounter(el) {
  el.classList.remove("pulse");
  void el.offsetWidth;
  el.classList.add("pulse");
}

// ----- card flow -----
function showCard(topic) {
  cardIcon.textContent = topic.hot ? "💥" : "✨";
  cardTopic.textContent = topic.label;
  cardBlurb.textContent = topic.blurb;
  card.classList.toggle("hot",  topic.hot);
  card.classList.toggle("cool", !topic.hot);
  cardDismiss.textContent = topic.hot ? "Replace head & continue" : "Embrace inner peace";

  cardBackdrop.classList.remove("hidden");
  cardBackdrop.setAttribute("aria-hidden", "false");
  // next frame, trigger transitions
  requestAnimationFrame(() => cardBackdrop.classList.add("show"));

  return new Promise((resolve) => {
    let done = false;
    const close = (e) => {
      if (done) return;
      // ignore clicks inside the card (only backdrop clicks dismiss)
      if (e && e.type === "click" && e.target !== cardBackdrop && e.target !== cardDismiss) return;
      done = true;
      cleanup();
      cardBackdrop.classList.remove("show");
      cardBackdrop.setAttribute("aria-hidden", "true");
      setTimeout(() => cardBackdrop.classList.add("hidden"), 240);
      resolve();
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const cleanup = () => {
      cardBackdrop.removeEventListener("click", close);
      cardDismiss.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
      clearTimeout(autoT);
    };
    cardBackdrop.addEventListener("click", close);
    cardDismiss.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    const autoT = setTimeout(close, 7000);
  });
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
    setTimeout(finish, 2000);
  });
}

resetBtn.addEventListener("click", () => {
  if (busy) return;
  hits = 0;
  booms = 0;
  hitsEl.textContent = "0";
  boomsEl.textContent = "0";
  renderWall();
  avatarWrap.style.transition = "none";
  const floorRect = floor.getBoundingClientRect();
  avatarWrap.style.left = `${floorRect.width / 2}px`;
  avatarWrap.classList.remove("facing-left", "walking", "pressing", "exploding", "headless", "regrowing", "enlightened", "arm-resetting");
  clearDebris();
  requestAnimationFrame(() => { avatarWrap.style.transition = ""; });
});

window.addEventListener("load", () => {
  renderWall();
  const floorRect = floor.getBoundingClientRect();
  avatarWrap.style.left = `${floorRect.width / 2}px`;
});

let resizeT;
window.addEventListener("resize", () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    if (busy) return;
    const floorRect = floor.getBoundingClientRect();
    avatarWrap.style.left = `${floorRect.width / 2}px`;
  }, 200);
});
