// Pretty, Danish UI for class + pause times
// Class: Monday 17:00–19:00
// Break: Monday 17:50–18:00

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
  const candidate = withTime(
    new Date(t.getFullYear(), t.getMonth(), t.getDate() + daysUntilMonday),
    h,
    m,
    0,
    0
  );
  if (candidate <= t) candidate.setDate(candidate.getDate() + 7);
  return candidate;
}

function isMonday(date) {
  return date.getDay() === MONDAY;
}

function between(d, start, end) {
  return d >= start && d < end;
}

function diffHMS(target) {
  const nowTs = now().getTime();
  const delta = Math.max(0, target.getTime() - nowTs);
  const totalSeconds = Math.floor(delta / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { h, m, s, totalMs: delta };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatHMS(d) {
  return `${pad(d.h)}:${pad(d.m)}:${pad(d.s)}`;
}

function computeState(nowDate) {
  // Today's windows
  const start = withTime(nowDate, 17, 0);
  const breakStart = withTime(nowDate, 17, 50);
  const breakEnd = withTime(nowDate, 18, 0);
  const end = withTime(nowDate, 19, 0);

  if (isMonday(nowDate)) {
    if (nowDate < start) {
      return { key: "preClass", nextAt: start, endAt: end };
    }
    if (between(nowDate, start, breakStart)) {
      return { key: "preBreak", nextAt: breakStart, endAt: end };
    }
    if (between(nowDate, breakStart, breakEnd)) {
      return { key: "break", nextAt: breakEnd, endAt: end };
    }
    if (between(nowDate, breakEnd, end)) {
      return { key: "postBreak", nextAt: end, endAt: end };
    }
    // After class on Monday -> next Monday start/end
    return {
      key: "afterClass",
      nextAt: nextMondayAt(17, 0),
      endAt: nextMondayAt(19, 0),
    };
  }
  // Not Monday -> next Monday windows
  return { key: "away", nextAt: nextMondayAt(17, 0), endAt: nextMondayAt(19, 0) };
}

function titleFor(stateKey) {
  switch (stateKey) {
    case "preClass":
      return "Coding Pirates starter om:";
    case "preBreak":
      return "Der er pause om:";
    case "break":
      return "Pausen slutter om:";
    case "postBreak":
      return "Coding Pirates slutter om:";
    case "afterClass":
    case "away":
    default:
      return "Der er først Coding Pirates igen om:";
  }
}

function update() {
  const nowDate = now();
  const state = computeState(nowDate);

  const nextPanel = document.getElementById("nextPanel");
  const nextTitle = document.getElementById("nextTitle");
  const nextCountdown = document.getElementById("nextCountdown");
  const breakBadge = document.getElementById("breakBadge");
  const classEndTitleEl = document.querySelector("#endPanel .panel-title");
  const classEndCountdownEl = document.getElementById("classEndCountdown");

  // Big next-event area
  nextTitle.textContent = titleFor(state.key);
  nextCountdown.textContent = formatHMS(diffHMS(state.nextAt));

  // Break emphasis visuals
  const body = document.body;
  if (state.key === "break") {
    body.classList.add("break-active");
    breakBadge.style.display = "inline-block";
  } else {
    body.classList.remove("break-active");
    breakBadge.style.display = "none";
  }

  // Small "ends" timer (always points to end of current/next class)
  const endLabel =
    state.key === "preClass" || state.key === "preBreak" || state.key === "break" || state.key === "postBreak"
      ? "Coding Pirates slutter om:"
      : "Næste gang slutter om:";
  classEndTitleEl.textContent = endLabel;
  classEndCountdownEl.textContent = formatHMS(diffHMS(state.endAt));

  setTimeout(update, 200);
}

update();
