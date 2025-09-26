module.exports.config = {
  name: "imgbb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Upload image to ImgBB",
  commandCategory: "Uploader",
  usages: "imgbb [reply to photo]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs");
  const path = require("path");

  if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
    return api.sendMessage("Please reply to a photo.", event.threadID, event.messageID);
  }

  try {
    const attachment = event.messageReply.attachments[0];
    const imageUrl = attachment.url;

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    const apiResponse = await axios.post("https://imgbb-sagor-api.vercel.app/sagor/upload", {
      image: base64Image
    });

    const data = apiResponse.data;

    if (data.success) {
      api.sendMessage(`${data.url}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("Upload failed!", event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("Something went wrong!", event.threadID, event.messageID);
  }
};
