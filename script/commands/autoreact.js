const fs = require("fs");
const path = __dirname + "/autoreact.txt";

module.exports.config = {
    name: "autoreact",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Sagor",
    description: "Auto reaction system",
    commandCategory: "system",
    usages: "autoreact on/off",
    cooldowns: 3
};

module.exports.handleEvent = async function({ api, event }) {
    if (event.type !== "message" || event.body == null) return;

    if (!fs.existsSync(path)) return;

    const status = fs.readFileSync(path, "utf-8");
    if (status === "on") {
        const reacts = ["😂", "❤️", "👍", "😮", "😢", "😡"];
        const random = reacts[Math.floor(Math.random() * reacts.length)];
        api.setMessageReaction(random, event.messageID, () => {}, true);
    }
};

module.exports.run = async function({ api, event, args }) {
    if (args[0] === "on") {
        fs.writeFileSync(path, "on");
        return api.sendMessage("✅ AutoReact Enabled!", event.threadID, event.messageID);
    }
    else if (args[0] === "off") {
        fs.writeFileSync(path, "off");
        return api.sendMessage("❌ AutoReact Disabled!", event.threadID, event.messageID);
    }
    else {
        return api.sendMessage("⚙️ Usage: autoreact on/off", event.threadID, event.messageID);
    }
};
