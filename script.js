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

let totalClicks = 0;
let stageClicks = 0;
let phase = 0; // 0 = first sleep, 1 = second sleep, 2 = final sleep, 3 = awake
let busy = false;
let soundOn = true;
let returnTimer = null;

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

function setSleep() {
  clearTimeout(returnTimer);

  busy = false;
  stageClicks = 0;

  byan.classList.remove("tap", "reaction", "awake-reaction");
  byan.classList.add("sleeping");

  byanImage.src = poses.sleep;
  byanImage.alt = "Sleeping Byan";

  sleepZzz.hidden = false;

  if (phase === 0) {
    stage.textContent = "HE'S FAST ASLEEP";
  } else if (phase === 1) {
    stage.textContent = "HE FELL ASLEEP AGAIN";
  } else {
    stage.textContent = "HE REALLY DOESN'T WANT TO WAKE UP";
  }

  setBubble("...");
  counter.textContent = `${totalClicks} / 9`;
}

function tapAnimation() {
  byan.classList.remove("tap");
  void byan.offsetWidth;
  byan.classList.add("tap");

  setTimeout(() => {
    byan.classList.remove("tap");
  }, 600);
}

function showSleepyResponse(pose, message, stageText) {
  busy = true;

  byan.classList.remove("sleeping", "tap");
  sleepZzz.hidden = true;

  byanImage.src = pose;
  byanImage.alt = "Sleepy Byan";

  stage.textContent = stageText;
  setBubble(message);

  void byan.offsetWidth;
  byan.classList.add("reaction");

  // IMPORTANT: after the response, he ALWAYS goes back to the sleeping pose.
  returnTimer = setTimeout(() => {
    phase++;
    setSleep();
  }, 1400);
}

function wakeStep() {
  if (busy || !letter.hidden || phase >= 3) return;

  totalClicks++;
  stageClicks++;
  counter.textContent = `${totalClicks} / 9`;

  tapAnimation();

  // First and second tap of each sleeping round:
  // he stays asleep. Nothing changes to another pose.
  if (stageClicks < 3) {
    if (phase === 0) {
      stage.textContent = "HE'S FAST ASLEEP";
    } else if (phase === 1) {
      stage.textContent = "HE'S BACK TO SLEEP...";
    } else {
      stage.textContent = "HE'S REALLY TRYING TO SLEEP...";
    }
    setBubble("...");
    return;
  }

  // Third tap of round 1.
  if (phase === 0 && stageClicks === 3) {
    showSleepyResponse(
      poses.five,
      "5 minutes please...",
      "ROUND ONE — HE'S BARELY AWAKE"
    );
    return;
  }

  // Third tap of round 2.
  if (phase === 1 && stageClicks === 3) {
    showSleepyResponse(
      poses.more,
      "5 more minutes, please?",
      "ROUND TWO — STILL SLEEPY"
    );
    return;
  }

  // Third tap of final round.
  if (phase === 2 && stageClicks === 3) {
    busy = true;
    phase = 3;

    byan.classList.remove("sleeping", "reaction", "tap");
    sleepZzz.hidden = true;

    byanImage.src = poses.awake;
    byanImage.alt = "Awake Byan";

    stage.textContent = "ROUND THREE — OKAY, OKAY...";
    setBubble("okayy, im awake!");

    void byan.offsetWidth;
    byan.classList.add("awake-reaction");

    setTimeout(() => {
      letter.hidden = false;
    }, 800);
  }

  if (soundOn) {
    clockAudio.play().catch(() => {});
  }
}

byan.addEventListener("click", wakeStep);

function resetWakeUp() {
  clearTimeout(returnTimer);

  totalClicks = 0;
  stageClicks = 0;
  phase = 0;
  busy = false;

  letter.hidden = true;
  setSleep();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

again.addEventListener("click", resetWakeUp);

closeLetter.addEventListener("click", () => {
  letter.hidden = true;
  resetWakeUp();
});

function toggleSound() {
  soundOn = !soundOn;

  if (soundOn) {
    clockAudio.currentTime = 0;
    clockAudio.play().then(() => {
      soundToggle.textContent = "🔊 sound on";
    }).catch(() => {
      soundToggle.textContent = "🔊 sound on";
    });
  } else {
    clockAudio.pause();
    soundToggle.textContent = "🔇 sound off";
  }
}

soundToggle.addEventListener("click", toggleSound);

function startClockAutomatically() {
  soundOn = true;
  soundToggle.textContent = "🔊 sound on";
  clockAudio.loop = true;
  clockAudio.volume = 1;

  clockAudio.play().catch(() => {
    soundToggle.textContent = "🔊 sound on";
  });
}

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

// Tiny bear cursor companion — desktop only.
const bearCursor = document.getElementById("bearCursor");

if (bearCursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let bearX = mouseX;
  let bearY = mouseY;
  let hasMoved = false;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    hasMoved = true;
    bearCursor.classList.add("visible");
  });

  function animateBear() {
    bearX += (mouseX - bearX) * 0.12;
    bearY += (mouseY - bearY) * 0.12;

    bearCursor.style.transform =
      `translate(${bearX}px, ${bearY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateBear);
  }

  animateBear();

  document.addEventListener("mouseleave", () => {
    bearCursor.classList.remove("visible");
  });

  document.addEventListener("mouseenter", () => {
    if (hasMoved) bearCursor.classList.add("visible");
  });
}

setSleep();
updateClock();
startClockAutomatically();
