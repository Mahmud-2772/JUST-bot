const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "2k",
    version: "1.1",
    hasPermission: 0,
    credits: "SaGor",
    description: "Enhance a replied or URL image using Remini API",
    commandCategory: "utilities",
    usages: "remini [image URL] (or reply to an image)",
    cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
    try {
        let imageUrl;

        if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
            imageUrl = event.messageReply.attachments[0].url;
        } else if (args[0]) {
            imageUrl = args[0];
        } else {
            return api.sendMessage("❌ Please provide an image URL or reply to an image.", event.threadID);
        }

        const apiKey = "4fe7e522-70b7-420b-a746-d7a23db49ee5";

        const response = await axios.get(`https://kaiz-apis.gleeze.com/api/remini?url=${encodeURIComponent(imageUrl)}&stream=true&apikey=${apiKey}`, {
            responseType: "arraybuffer"
        });

        const filePath = path.join(__dirname, "remini_result.jpg");
        fs.writeFileSync(filePath, response.data);

        return api.sendMessage({ body: "✅ Image enhanced successfully!", attachment: fs.createReadStream(filePath) }, event.threadID, () => {
            fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Failed to enhance the image. Make sure the URL is valid or the replied message contains a valid image.", event.threadID);
    }
};
