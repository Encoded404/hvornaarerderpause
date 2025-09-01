// Pretty, Danish UI for class + pause times
// Class: Monday 17:00–19:00
// Break: Monday 17:50–18:00

const MS = 1000;
const MONDAY = 1;

function now() {
  return new Date();
}

function withTime(base, h, m, s = 0, ms = 0) {
  const d = new Date(base);
  d.setHours(h, m, s, ms);
  return d;
}

function nextMondayAt(h, m) {
  const t = now();
  const day = t.getDay();
  const daysUntilMonday = (MONDAY - day + 7) % 7;
  const candidate = withTime(new Date(t.getFullYear(), t.getMonth(), t.getDate() + daysUntilMonday), h, m, 0, 0);
  if (candidate <= t) {
    // already passed today -> add 7 days
    candidate.setDate(candidate.getDate() + 7);
  }
  return candidate;
}

function isMonday(date) {
  return date.getDay() === MONDAY;
}

function between(d, start, end) {
  return d >= start && d < end;
}

function diffHMS(target) {
  const delta = Math.max(0, target - now());
  const totalSeconds = Math.floor(delta / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s, ms: delta % 1000, totalMs: delta };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatHMS(d) {
  return `${pad(d.h)}:${pad(d.m)}:${pad(d.s)}`;
}

function update() {
  const nowDate = now();

  // Class windows today
  const todayStart = withTime(nowDate, 17, 0);
  const todayBreakStart = withTime(nowDate, 17, 50);
  const todayBreakEnd = withTime(nowDate, 18, 0);
  const todayEnd = withTime(nowDate, 19, 0);

  const breakStatusEl = document.getElementById("breakStatusText");
  const breakCountdownEl = document.getElementById("breakCountdown");
  const classEndTitleEl = document.querySelector("#endPanel .panel-title");
  const classEndCountdownEl = document.getElementById("classEndCountdown");

  // Break section logic
  if (isMonday(nowDate) && between(nowDate, todayStart, todayBreakStart)) {
    // Before break today
    breakStatusEl.textContent = "Der er pause om:";
    breakCountdownEl.textContent = formatHMS(diffHMS(todayBreakStart));
  } else if (isMonday(nowDate) && between(nowDate, todayBreakStart, todayBreakEnd)) {
    // Break is active (assume 10 min)
    breakStatusEl.textContent = "Nu er der pause!";
    breakCountdownEl.classList.add("small");
    breakCountdownEl.textContent = formatHMS(diffHMS(todayBreakEnd));
  } else {
    // Outside the pre-break window -> show next class start
    breakStatusEl.textContent = "Der er først Coding Pirates igen om:";
    breakCountdownEl.classList.remove("small");
    const nextStart = nextMondayAt(17, 0);
    breakCountdownEl.textContent = formatHMS(diffHMS(nextStart));
  }

  // Class end section logic
  if (isMonday(nowDate) && between(nowDate, todayStart, todayEnd)) {
    classEndTitleEl.textContent = "Coding Pirates slutter om:";
    classEndCountdownEl.textContent = formatHMS(diffHMS(todayEnd));
  } else {
    classEndTitleEl.textContent = "Næste gang slutter om:";
    const nextEnd = nextMondayAt(19, 0);
    classEndCountdownEl.textContent = formatHMS(diffHMS(nextEnd));
  }

  const refresh = 200; // ms
  setTimeout(update, refresh);
}

update();
