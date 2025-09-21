const os = require("os");

module.exports.config = {
  name: "upt",
  version: "2.2",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Stylish bot uptime",
  commandCategory: "utilities",
  usages: "uptime",
  cooldowns: 5,
};

function formatTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function getPingColor(latency) {
  if (latency >= 150) return "🔴";
  else if (latency >= 50) return "🟡";
  else return "🟢";
}

function createPingBar(latency) {
  const total = 5; // compact 5 block bar
  const color = getPingColor(latency);
  return Array(total).fill(color).join("");
}

module.exports.run = async function({ api, event }) {
  const start = Date.now();

  // Measure API latency
  const tempMsg = await api.sendMessage("BABY YOUR UPTIME CKING", event.threadID);
  const latency = Date.now() - start;

  const uptime = process.uptime() * 1000;
  const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;

  const msg = `
✨ 🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 🤖 ✨
─────────────────────
⏱️ Uptime : ${formatTime(uptime)}
💾 Memory : ${memUsage.toFixed(2)} MB
🖥️ Platform : ${os.platform()} ${os.arch()}
⚙️ CPU : ${os.cpus()[0].model}
📡 Ping : ${latency}ms
─────────────────────
${createPingBar(latency)}
─────────────────────
`;

  return api.editMessage(msg, tempMsg.messageID, event.threadID);
};
