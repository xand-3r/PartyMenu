const EVENT = {
  title: "День рождение Насти Дей",
  start: [2026, 10, 31, 16, 0],
  end: [2026, 10, 31, 23, 0],
  description: "Ресторан Пушкин Таймс",
};

function pad(n) {
  return String(n).padStart(2, "0");
}

/** @param {[number, number, number, number, number]} parts */
function toIcsUtc(parts) {
  const [y, m, d, h, min] = parts;
  const local = new Date(y, m - 1, d, h, min, 0);
  return (
    local.getUTCFullYear() +
    pad(local.getUTCMonth() + 1) +
    pad(local.getUTCDate()) +
    "T" +
    pad(local.getUTCHours()) +
    pad(local.getUTCMinutes()) +
    pad(local.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcs(text) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** @param {import("./storage.js").PartyOrder} _order */
export function downloadCalendarEvent(_order) {
  const uid = `party-menu-${Date.now()}@local`;
  const dtStamp = toIcsUtc([
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
    new Date().getHours(),
    new Date().getMinutes(),
  ]);
  const dtStart = toIcsUtc(EVENT.start);
  const dtEnd = toIcsUtc(EVENT.end);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Party Menu//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(EVENT.title)}`,
    `DESCRIPTION:${escapeIcs(EVENT.description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(EVENT.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nastya-birthday.ics";
  link.click();
  URL.revokeObjectURL(url);
}
