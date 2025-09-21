const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "ss",
    version: "1.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "Take screenshot of a website",
    commandCategory: "utilities",
    usages: "[website URL]",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
    if (!args[0]) return api.sendMessage("❌ Please provide a website URL!", event.threadID, event.messageID);
    
    const url = encodeURIComponent(args[0]);
    const apiKey = "UAAIEYKBJADPNB7IUQTEUF4NAP";
    const shotUrl = `https://api.site-shot.com/?url=${url}&userkey=${apiKey}&width=1280&height=1024&format=jpeg&response_type=image`;

    try {
        const response = await axios.get(shotUrl, { responseType: "arraybuffer" });
        const cacheDir = path.join(__dirname, "cache");
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
        const filePath = path.join(cacheDir, `ss_${Date.now()}.jpg`);
        fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

        api.sendMessage({ body: `📸 Screenshot of: ${args[0]}`, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Failed to take screenshot! Make sure the URL is correct.", event.threadID, event.messageID);
    }
};
