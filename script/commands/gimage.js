const axios = require("axios");
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");

module.exports.config = {
    name: "gimage",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "SaGor",
    description: "Search google images",
    commandCategory: "Search",
    usages: "gimage [text]",
    cooldowns: 10,
};

module.exports.run = async ({ api, event, args }) => {
    if (!args[0]) return api.sendMessage("❌ Please enter a search query!", event.threadID, event.messageID);
    const query = encodeURIComponent(args.join(" "));
    const url = `https://www.google.com/search?tbm=isch&q=${query}`;

    try {
        const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(data);
        const images = [];
        $("img").each((i, el) => {
            const src = $(el).attr("src");
            if (src && src.startsWith("http")) images.push(src);
        });

        if (!images.length) return api.sendMessage("❌ No images found!", event.threadID, event.messageID);

        const shuffled = images.sort(() => 0.5 - Math.random());
        const selectedImages = shuffled.slice(1, 11);

        const attachments = [];
        for (let i = 0; i < selectedImages.length; i++) {
            const imageUrl = selectedImages[i];
            const imagePath = path.join(__dirname, `/cache/gimage${i}.jpg`);

            await new Promise((resolve) => {
                request(imageUrl).pipe(fs.createWriteStream(imagePath)).on("close", () => {
                    attachments.push(fs.createReadStream(imagePath));
                    resolve();
                });
            });
        }

        api.sendMessage({ body: `🔍 Results for: ${args.join(" ")}`, attachment: attachments }, event.threadID, () => {
            attachments.forEach((_, i) => fs.unlinkSync(path.join(__dirname, `/cache/gimage${i}.jpg`)));
        }, event.messageID);

    } catch (err) {
        return api.sendMessage("❌ Failed to fetch images.", event.threadID, event.messageID);
    }
};
