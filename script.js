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

const timeEyebrow = document.getElementById("timeEyebrow");
const timeTitle = document.getElementById("timeTitle");
const timeSub = document.getElementById("timeSub");
const letterGreeting = document.getElementById("letterGreeting");
const letterIntro = document.getElementById("letterIntro");
const letterThought = document.getElementById("letterThought");

const timeCopy = {
  morning: {
    eyebrow: "A LITTLE MORNING SURPRISE",
    title: "it’s a soft morning...",
    sub: "and someone is still sleeping.",
    greeting: "Good morning,<br>Byan. ♡",
    thought: "So before you disappear under that blanket again, please remember that someone is thinking about you this morning.",
    intro: "I know you’re probably still sleepy, but I wanted to leave you something sweet to wake up to."
  },
  noon: {
    eyebrow: "A LITTLE NOON SURPRISE",
    title: "it’s already noon...",
    sub: "and someone is still sleeping.",
    greeting: "Good afternoon,<br>Byan. ♡",
    thought: "So before you get too comfortable under that blanket again, please remember that someone is thinking about you this afternoon.",
    intro: "The day is already moving along, but I still wanted to leave you a tiny surprise to wake up to."
  },
  afternoon: {
    eyebrow: "A LITTLE AFTERNOON SURPRISE",
    title: "the afternoon is passing by...",
    sub: "but someone is still sleeping.",
    greeting: "Good afternoon,<br>Byan. ♡",
    thought: "And while the afternoon slowly slips away, just remember that someone is thinking about you this afternoon.",
    intro: "You may have slept through a little bit of the day, but that’s okay. I still wanted to leave you something sweet."
  },
  evening: {
    eyebrow: "A LITTLE EVENING SURPRISE",
    title: "the day is getting sleepy...",
    sub: "and someone is still sleeping.",
    greeting: "Good evening,<br>Byan. ♡",
    thought: "Even as the day settles down, please remember that someone is thinking about you this evening.",
    intro: "It’s getting a little late, but I couldn’t let the day pass without leaving you a tiny surprise."
  },
  night: {
    eyebrow: "A LITTLE NIGHT SURPRISE",
    title: "it’s a quiet night...",
    sub: "and someone is still sleeping.",
    greeting: "Good night,<br>Byan. ♡",
    thought: "And before this quiet night gets any quieter, remember that someone is thinking about you tonight.",
    intro: "It’s already late, but I still wanted to leave you a little something to find whenever you wake up."
  }
};

function getTimePeriod(hour) {
  if (hour >= 6 && hour <= 10) return "morning";
  if (hour >= 11 && hour <= 14) return "noon";
  if (hour >= 15 && hour <= 17) return "afternoon";
  if (hour >= 18 && hour <= 19) return "evening";
  return "night";
}

function applyTimeCopy() {
  const copy = timeCopy[getTimePeriod(new Date().getHours())];
  timeEyebrow.textContent = copy.eyebrow;
  timeTitle.textContent = copy.title;
  timeSub.textContent = copy.sub;
  letterGreeting.innerHTML = copy.greeting;
  letterIntro.textContent = copy.intro;
  letterThought.textContent = copy.thought;
}

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

applyTimeCopy();
setSleep();
updateClock();
startClockAutomatically();
