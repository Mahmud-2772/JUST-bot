const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "unsplash",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Fetch images from Unsplash",
  commandCategory: "picture",
  usages: "unsplash <keyword>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const send = msg => api.sendMessage(msg, event.threadID, event.messageID);
  if (!args[0]) return send("Please provide a search keyword.\nUsage: unsplash <keyword>");

  const query = args.join(" ");
  try {
    const res = await axios.get(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=10`);
    const results = res.data.results;
    if (!results || results.length === 0) return send("No images found for: " + query);

    let attachments = [];
    for (let i = 0; i < results.length; i++) {
      const imgUrl = results[i].urls.full;
      const imgPath = path.join(__dirname, `unsplash_${i}.jpg`);
      const imgResp = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, imgResp.data);
      attachments.push(fs.createReadStream(imgPath));
    }

    await send({ attachment: attachments });

    for (let i = 0; i < results.length; i++) {
      const imgPath = path.join(__dirname, `unsplash_${i}.jpg`);
      fs.unlinkSync(imgPath);
    }

  } catch (err) {
    return send("Error fetching images: " + err.message);
  }
};
