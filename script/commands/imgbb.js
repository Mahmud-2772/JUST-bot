module.exports.config = {
  name: "imgbb",
  version: "1.0",
  author: "Sagor",
  cooldown: 5,
  description: "Upload photo (reply or URL)",
  commandCategory: "media",
  usages: "reply photo or send image URL + type imgbb",
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  const FormData = require("form-data");

  let imageUrl = null;

  if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo")
      return api.sendMessage("Only photo supported!", event.threadID);
    imageUrl = attachment.url;
  } else if (args.length > 0) {
    imageUrl = args[0];
  } else {
    return api.sendMessage("Reply a photo", event.threadID);
  }

  try {
    const imageData = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;
    const form = new FormData();
    form.append("image", Buffer.from(imageData, "binary"), { filename: "photo.jpg" });

    const API_KEY = "a82f94b1bdb1e19ee416378df234f052";

    const imgbbRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    api.sendMessage(`${imgbbRes.data.data.url}`, event.threadID);
  } catch (err) {
    api.sendMessage("Upload failed!", event.threadID);
  }
};
