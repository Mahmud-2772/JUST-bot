const axios = require("axios");

module.exports.config = {
  name: "tidinfo",
  version: "1.8",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Extra small RGB progress bar group info",
  commandCategory: "group",
  usages: "tidinfo",
  cooldowns: 5,
};

function createRGBProgressBar(percent) {
  const colors = ["🟥","🟧","🟨","🟩","🟦","🟪"];
  const totalBlocks = 5;
  let filled = Math.round((percent / 100) * totalBlocks);
  if(filled > totalBlocks) filled = totalBlocks;

  let bar = "";
  for (let i = 0; i < filled; i++) bar += colors[i % colors.length];
  for (let i = filled; i < totalBlocks; i++) bar += "⬛";

  return bar;
}

module.exports.run = async function({ api, event }) {
  const threadID = event.threadID;
  const threadInfo = await api.getThreadInfo(threadID);

  let percent = 80;
  const loadingMsg = await api.sendMessage(createRGBProgressBar(percent), threadID);

  const interval = setInterval(async () => {
    percent++;
    if(percent > 100) percent = 100;
    try {
      await api.editMessage(createRGBProgressBar(percent), loadingMsg.messageID, threadID);
    } catch {}
    if(percent === 100) clearInterval(interval);
  }, 2);

  setTimeout(async () => {
    const groupName = threadInfo.threadName || "Unnamed Group";
    const groupID = threadID;
    const memberCount = threadInfo.participantIDs.length;
    const adminIDs = threadInfo.adminIDs.map(a => a.id);
    const messageCount = threadInfo.messageCount || "N/A";
    const approvalMode = threadInfo.approvalMode ? "✅ On" : "❌ Off";
    const emoji = threadInfo.emoji || "🙂";

    let ownerName = "Unknown";
    if (adminIDs[0]) {
      try {
        const ownerInfo = await api.getUserInfo(adminIDs[0]);
        ownerName = `${ownerInfo[adminIDs[0]].name} (${adminIDs[0]})`;
      } catch {
        ownerName = `UID: ${adminIDs[0]}`;
      }
    }

    let adminList = "";
    for (let id of adminIDs) {
      try {
        const user = await api.getUserInfo(id);
        adminList += `• ${user[id].name} (${id})\n`;
      } catch {
        adminList += `• UID: ${id}\n`;
      }
    }

    const msg = `✨ 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 ✨
───────────────────────
🏷️ 𝗡𝗮𝗺𝗲: ${groupName}
🆔 𝗧𝗵𝗿𝗲𝗮𝗱 𝗜𝗗: ${groupID}
👑 𝗢𝘄𝗻𝗲𝗿: ${ownerName}
👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${memberCount}
💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀: ${messageCount}
📩 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹: ${approvalMode}
😃 𝗘𝗺𝗼𝗷𝗶: ${emoji}
───────────────────────
👑 𝗔𝗱𝗺𝗶𝗻𝗦:
${adminList}`;

    await api.editMessage(msg, loadingMsg.messageID, threadID);
  }, 100);
};
