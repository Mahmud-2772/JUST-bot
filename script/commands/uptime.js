const os = require("os");

module.exports.config = {
  name: "uptime",
  version: "3.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Stylish system status with progress bar",
  commandCategory: "system",
  usages: "uptime",
  cooldowns: 5,
  aliases: ["rtm", "upt", "up"]
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;

  const frames = [
    "[████░░░░░░░░░░░░░░░░] 30%",
    "[██████████░░░░░░░░░] 80%",
    "[████████████████████] 100%"
  ];

  let loading;
  try {
    loading = await api.sendMessage(frames[0], threadID);

    setTimeout(() => api.editMessage(frames[0], loading.messageID), 200);
    setTimeout(() => api.editMessage(frames[1], loading.messageID), 600);
    setTimeout(() => api.editMessage(frames[2], loading.messageID), 1000);

    setTimeout(() => {
      const uptime = process.uptime();
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeStr =
        (days > 0 ? `${days}d ` : "") +
        (hours > 0 ? `${hours}h ` : "") +
        (minutes > 0 ? `${minutes}m ` : "") +
        `${seconds}s`;

      const ramUsed = (os.totalmem() - os.freemem()) / 1024 / 1024 / 1024;
      const ramTotal = os.totalmem() / 1024 / 1024 / 1024;

      const msg =
`╭─『 💻 SYSTEM STATUS 💻 』
│
│ ⏱ Uptime   : ${uptimeStr}
│ 📡 Ping     : ${Math.floor(process.uptime()*10)} ms
│
│ 💾 RAM     : ${ramUsed.toFixed(2)} GB / ${ramTotal.toFixed(2)} GB
│ 💽 ROM     : ${(os.totalmem()/1024/1024/1024).toFixed(2)} GB
│
╰───────────────◊`;

      api.editMessage(msg, loading.messageID);
    }, 1300);

  } catch (err) {
    console.error("Uptime command error:", err);
    if (loading) api.sendMessage("⚠️ Error fetching system info!", threadID);
  }
};
