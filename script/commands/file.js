const fs = require("fs");

module.exports.config = {
    name: "file",
    version: "1.0",
    hasPermission: 0,
    credits: "SaGor",
    description: "Get the content of a JS file (Admin only)",
    commandCategory: "owner",
    usages: "file [file name]",
    cooldowns: 3,
};

module.exports.run = async function ({ args, api, event }) {
    const allowedUIDs = ["61579792988640"];

    if (!allowedUIDs.includes(event.senderID)) {
        return api.sendMessage("❌ You are not allowed to use this command.", event.threadID, event.messageID);
    }

    const fileName = args[0];
    if (!fileName) {
        return api.sendMessage("❗ Please provide a file name.", event.threadID, event.messageID);
    }

    const filePath = __dirname + `/${fileName}.js`;
    if (!fs.existsSync(filePath)) {
        return api.sendMessage(`❌ File not found: ${fileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    return api.sendMessage({ body: fileContent }, event.threadID, event.messageID);
};
