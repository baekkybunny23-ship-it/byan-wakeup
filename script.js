const byan = document.getElementById("byan");
const byanImage = document.getElementById("byanImage");
const bubble = document.getElementById("bubble");
const stage = document.getElementById("stage");
const counter = document.getElementById("counter");
const prompt = document.getElementById("prompt");
const site = document.getElementById("site");
const sound = document.getElementById("sound");
const clockAudio = document.getElementById("clockAudio");
const letter = document.getElementById("letter");
const again = document.getElementById("again");

const poses = [
  "assets/byan-sleeping.png",
  "assets/byan-5min.png",
  "assets/byan-5more.png",
  "assets/byan-awake.png"
];

const texts = [
  "shhh... he's sleeping.",
  "5 minutes pplease...",
  "5 more minutes, please?",
  "okayy, im awake!"
];

let clicks = 0;
let soundOn = false;

function setBubble(text) {
  bubble.textContent = text;
  bubble.classList.remove("pop");
  void bubble.offsetWidth;
  bubble.classList.add("pop");
}

function updateStage() {
  counter.textContent = `${clicks} / 9`;
  if (clicks === 0) stage.textContent = "click Byan to wake him ♡";
  else if (clicks <= 3) stage.textContent = "round one — he's barely awake";
  else if (clicks <= 6) stage.textContent = "round two — okay, one more time...";
  else stage.textContent = "final round — no more excuses";
}

function tickSound() {
  if (!soundOn) return;
  clockAudio.currentTime = 0;
  clockAudio.play().catch(() => {});
}

sound.addEventListener("click", () => {
  soundOn = !soundOn;
  sound.setAttribute("aria-pressed", String(soundOn));
  sound.textContent = soundOn ? "🔊 sound on" : "🔇 sound off";
  if (soundOn) {
    clockAudio.play().catch(() => {});
  } else {
    clockAudio.pause();
  }
});

byan.addEventListener("click", () => {
  if (clicks >= 9) return;
  clicks++;
  tickSound();

  if (clicks <= 3) byanImage.src = poses[1];
  else if (clicks <= 6) byanImage.src = poses[2];
  else byanImage.src = poses[3];

  setBubble(texts[Math.min(Math.ceil(clicks / 3), 3)]);
  updateStage();

  site.classList.remove("wake");
  void site.offsetWidth;
  site.classList.add("wake");

  if (clicks === 3) prompt.textContent = "he's really not ready...";
  if (clicks === 6) prompt.textContent = "okay... last three.";
  if (clicks === 9) {
    prompt.textContent = "";
    setTimeout(() => {
      letter.hidden = false;
    }, 700);
  }
});

again.addEventListener("click", () => {
  clicks = 0;
  byanImage.src = poses[0];
  setBubble(texts[0]);
  updateStage();
  prompt.textContent = "maybe you can wake him up?";
  letter.hidden = true;
});

/* Real-time analog clock. */
function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  document.getElementById("second").style.transform = `rotate(${seconds * 6}deg)`;
  document.getElementById("minute").style.transform = `rotate(${minutes * 6}deg)`;
  document.getElementById("hour").style.transform = `rotate(${hours * 30}deg)`;

  requestAnimationFrame(updateClock);
}
updateClock();
updateStage();
