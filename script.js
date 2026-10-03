const byan = document.getElementById("byan");
const byanImage = document.getElementById("byanImage");
const bubble = document.getElementById("bubble");
const stage = document.getElementById("stage");
const counter = document.getElementById("counter");
const letter = document.getElementById("letter");
const again = document.getElementById("again");
const closeLetter = document.getElementById("closeLetter");
const soundToggle = document.getElementById("soundToggle");
const clockAudio = document.getElementById("clockAudio");
const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");
const sleepZzz = document.getElementById("sleepZzz");

let clicks = 0;
let soundOn = false;

const poses = {
  sleep: "assets/byan-sleeping.png",
  five: "assets/byan-5min.png",
  more: "assets/byan-5more.png",
  awake: "assets/byan-awake.png"
};

function setBubble(text) {
  bubble.classList.remove("pop");
  void bubble.offsetWidth;
  bubble.textContent = text;
  bubble.classList.add("pop");
}

function showSleepState() {
  byanImage.src = poses.sleep;
  byanImage.alt = "Sleeping Byan";
  byan.classList.add("sleeping");
  sleepZzz.hidden = false;
  stage.textContent = "ROUND ONE — HE'S BARELY AWAKE";
  setBubble("5 minutes please...");
}

function wakeStep() {
  clicks++;
  counter.textContent = `${clicks} / 9`;

  byan.classList.remove("sleeping");
  sleepZzz.hidden = true;

  if (clicks <= 3) {
    byanImage.src = poses.five;
    byanImage.alt = "Sleepy Byan";
    stage.textContent = "ROUND ONE — HE'S BARELY AWAKE";
    setBubble("5 minutes please...");
  } else if (clicks <= 6) {
    byanImage.src = poses.more;
    byanImage.alt = "Byan asking for more sleep";
    stage.textContent = "ROUND TWO — HE'S STILL SLEEPY";
    setBubble("5 more minutes, please?");
  } else if (clicks <= 8) {
    byanImage.src = poses.awake;
    byanImage.alt = "Awake Byan";
    stage.textContent = "ROUND THREE — OKAY, OKAY...";
    setBubble("okayy, im awake!");
  } else {
    byanImage.src = poses.awake;
    byanImage.alt = "Awake Byan";
    stage.textContent = "HE'S FINALLY AWAKE";
    setBubble("okayy, im awake!");
    setTimeout(() => {
      letter.hidden = false;
    }, 450);
  }

  byan.classList.add("wake");
  setTimeout(() => byan.classList.remove("wake"), 650);

  // A click is a user gesture, so the new clock can start here if enabled.
  if (soundOn) {
    clockAudio.play().catch(() => {});
  }
}

byan.addEventListener("click", wakeStep);

function resetWakeUp() {
  clicks = 0;
  counter.textContent = "0 / 9";
  letter.hidden = true;
  showSleepState();
  window.scrollTo({top: 0, behavior: "smooth"});
}

again.addEventListener("click", resetWakeUp);
closeLetter.addEventListener("click", () => {
  letter.hidden = true;
});

function toggleSound() {
  soundOn = !soundOn;

  if (soundOn) {
    clockAudio.currentTime = 0;
    clockAudio.play().then(() => {
      soundToggle.textContent = "🔊 sound on";
    }).catch(() => {
      soundOn = false;
      soundToggle.textContent = "🔇 sound off";
    });
  } else {
    clockAudio.pause();
    soundToggle.textContent = "🔇 sound off";
  }
}

soundToggle.addEventListener("click", toggleSound);

function updateClock() {
  const now = new Date();
  const ms = now.getMilliseconds();
  const seconds = now.getSeconds() + ms / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  secondHand.style.transform = `rotate(${seconds * 6}deg)`;
  minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
  hourHand.style.transform = `rotate(${hours * 30}deg)`;

  requestAnimationFrame(updateClock);
}

showSleepState();
updateClock();
