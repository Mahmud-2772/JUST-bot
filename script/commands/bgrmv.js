const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "bgrmv",
    version: "1.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "Remove background from image",
    commandCategory: "utilities",
    usages: "[reply to image or provide image URL]",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
    let imageUrl;

    if (event.type === "message_reply" && event.messageReply.attachments[0]) {
        imageUrl = event.messageReply.attachments[0].url;
    } else if (args[0]) {
        imageUrl = args[0];
    } else {
        return api.sendMessage("❌ Please reply to an image or provide an image URL.", event.threadID, event.messageID);
    }

    const apiKey = "Yz4WycyAeLgByZNA9WaDyhCT";
    try {
        const response = await axios({
            method: "post",
            url: "https://api.remove.bg/v1.0/removebg",
            data: { image_url: imageUrl, size: "auto" },
            headers: { "X-Api-Key": apiKey },
            responseType: "arraybuffer"
        });

        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
        const filePath = path.join(cacheDir, `bgrmv_${Date.now()}.png`);
        fs.writeFileSync(filePath, response.data);

        api.sendMessage({ body: "🖼 Background Removed:", attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Failed to remove background. Make sure the image is valid.", event.threadID, event.messageID);
    }
};
