const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const axios = require("axios");

module.exports.config = {
  name: "rank",
  version: "2.0",
  hasPermission: 0,
  credits: "Sagor",
  description: "Show user rank and XP",
  commandCategory: "level",
  usages: "[reply/@mention/uid]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users, Currencies, args }) {
  try {
    let uid;
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }

    const userInfo = await Users.getData(uid);
    const name = userInfo.name || "Unknown User";

    const balance = await Currencies.getData(uid);
    let exp = balance.exp || 0;
    let level = balance.level || 1;

    let nextLevel = level;
    while (exp >= nextLevel * 500) nextLevel++;
    const expNextLevel = nextLevel * 500;
    const progress = (exp / expNextLevel) * 100;

    const avatar = await axios.get(
      `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    );
    const avatarImg = await loadImage(Buffer.from(avatar.data, "binary"));

    const canvas = createCanvas(800, 250);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, 25, 25, 200, 200);
    ctx.restore();

    ctx.fillStyle = "#fff";
    ctx.font = "28px Arial";
    ctx.fillText(name, 250, 100);

    ctx.font = "22px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.fillText(`Level: ${level}`, 250, 150);

    ctx.fillStyle = "#333";
    ctx.fillRect(250, 180, 500, 30);

    ctx.fillStyle = "#00ff00";
    ctx.fillRect(250, 180, (progress / 100) * 500, 30);

    ctx.fillStyle = "#fff";
    ctx.font = "18px Arial";
    ctx.fillText(`${exp} / ${expNextLevel} XP`, 250, 170);

    const imgPath = path.join(__dirname, "rank.png");
    fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));

    return api.sendMessage(
      { body: `🎖 Rank card for ${name}`, attachment: fs.createReadStream(imgPath) },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ | Failed to generate rank card!", event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ event, Currencies }) {
  if (!event.body) return;
  const data = await Currencies.getData(event.senderID);
  let exp = data.exp || 0;
  let level = data.level || 1;

  exp += 10;
  const expNextLevel = level * 500;

  if (exp >= expNextLevel) {
    level++;
    exp = 0;
  }

  await Currencies.setData(event.senderID, { ...data, exp, level });
};
