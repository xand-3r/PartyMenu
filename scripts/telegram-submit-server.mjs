/**
 * Локальный тест отправки в Telegram (сайт по SMS, не Mini App).
 *
 *   set BOT_TOKEN=...
 *   set ADMIN_CHAT_ID=...
 *   set SUBMIT_KEY=dev-secret
 *   node scripts/telegram-submit-server.mjs
 *
 * js/config.js:
 *   apiUrl: "http://127.0.0.1:8787/submit"  (на телефоне — http://LAN-IP:8787/submit)
 *   apiSubmitKey: "dev-secret"
 */
import { createServer } from "node:http";

const port = Number(process.env.PORT || 8787);
const submitKey = process.env.SUBMIT_KEY || "";
const botToken = process.env.BOT_TOKEN || "";
const adminChatId = process.env.ADMIN_CHAT_ID || "";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Submit-Key");
}

async function sendTelegram(text) {
  if (!botToken || !adminChatId) {
    console.log("[telegram-submit-server] (no BOT_TOKEN) message:\n", text);
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: adminChatId, text }),
  });
  if (!res.ok) {
    throw new Error(`Telegram API ${res.status}: ${await res.text()}`);
  }
}

createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method !== "POST" || req.url !== "/submit") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  if (submitKey && req.headers["x-submit-key"] !== submitKey) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let body = "";
  for await (const chunk of req) body += chunk;

  try {
    const payload = JSON.parse(body);
    const text = typeof payload.text === "string" ? payload.text : JSON.stringify(payload, null, 2);
    await sendTelegram(text);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end("error");
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Submit API: http://0.0.0.0:${port}/submit`);
  if (!botToken) console.log("BOT_TOKEN not set — orders only logged to console");
});
