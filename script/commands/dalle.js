const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "dalle",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "Generate images using DALL·E 3",
    commandCategory: "Ai",
    usages: "dalle [prompt]",
    cooldowns: 10
};

module.exports.run = async function({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
        return api.sendMessage("⚠️ Please provide a prompt.\nExample: dalle a cute dog wearing sunglasses", event.threadID, event.messageID);
    }

    const tempPath = path.join(__dirname, "cache", `${Date.now()}.png`);

    try {
        api.sendMessage("🖌️ Generating image, please wait...", event.threadID, event.messageID);

        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        const response = await axios({
            url,
            method: "GET",
            responseType: "arraybuffer"
        });

        fs.writeFileSync(tempPath, Buffer.from(response.data, "binary"));

        api.sendMessage({
            body: `🎨 Prompt: ${prompt}`,
            attachment: fs.createReadStream(tempPath)
        }, event.threadID, () => fs.unlinkSync(tempPath), event.messageID);

    } catch (e) {
        console.error(e);
        api.sendMessage("❌ Failed to generate image.", event.threadID, event.messageID);
    }
};
