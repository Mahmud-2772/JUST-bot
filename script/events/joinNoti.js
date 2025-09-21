module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "SaGor",
  description: "Notify bots or people entering the group",
  dependencies: {
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event }) {
  const request = require("request");
  const fs = global.nodemodule["fs-extra"];
  const { threadID } = event;

  // Time fix
  const currentTime = new Date().toLocaleString("en-US", { hour12: false });

  // If BOT is added
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`${global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    return api.sendMessage(`✅ 𝐁𝐨𝐭 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲!

╭╼|━━━━━━━━━━━━━━|╾╮
👑 𝗔𝗱𝗺𝗶𝗻: 𝐉𝐀𝐇𝐈𝐃𝐔𝐋 𝐈𝐒𝐋𝐀𝐌 𝐒𝐀𝐆𝐎𝐑
🌐 𝗡𝗮𝗺𝗲: 𝐒𝐀𝐆𝐎𝐑 𝐈𝐒𝐋𝐀𝐌
📧 𝗘𝗺𝗮𝗶𝗹: babygithub@gmail.com
📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: +8801611079915
✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: t.me/xxSaGorxx
🔗 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: fb.com/SAGOR.DJK.FORYOU
⏰ 𝗧𝗶𝗺𝗲: ${currentTime}
╰╼|━━━━━━━━━━━━━━|╾╯`, threadID);
  }

  // If users are added
  try {
    const { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};

    let mentions = [], nameArray = [], memLength = [], i = 0;
    const addedParticipants1 = event.logMessageData.addedParticipants;

    // Ensure cache dir
    fs.ensureDirSync(__dirname + "/cache");

    for (let newParticipant of addedParticipants1) {
      let userID = newParticipant.userFbId;
      api.getUserInfo(parseInt(userID), (err, data) => {
        if (err) return console.log(err);

        const obj = Object.keys(data);
        const userName = data[obj].name.replace("@", "");
        if (userID !== api.getCurrentUserID()) {

          nameArray.push(userName);
          mentions.push({ tag: userName, id: userID, fromIndex: 0 });

          memLength.push(participantIDs.length - i++);
          memLength.sort((a, b) => a - b);

          // Default / Custom message
          let msg = (typeof threadData.customJoin == "undefined") ? 
`╭─❍❍❍───────────
│ 🦋 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓝𝓮𝔀 𝓢𝓽𝓪𝓻 🦋 │
╰─❍❍❍───────────╯

✨🌸❝ 𝓝𝓮𝔀 𝓜𝓮𝓶𝓫𝓮𝓻 ❞🌸✨  

${nameArray.join("\n")}

🏷️ 𝓖𝓻𝓸𝓾𝓹: "${threadName}"  
👥 𝓣𝓸𝓽𝓪𝓵 𝓜𝓮𝓶𝓫𝓮𝓻𝓼: ${participantIDs.length}  
⏰ 𝓣𝓲𝓶𝓮: ${currentTime}

╭╼|━━━━━━━━━━━━━━|╾╮
🤖 𝐅𝐫𝐨𝐦 𝐒𝐀𝐆𝐎𝐑 𝐁𝐎𝐓
╰╼|━━━━━━━━━━━━━━|╾╯`
          : threadData.customJoin;

          // Placeholder replace (if customJoin used)
          msg = msg
            .replace(/\{uName}/g, nameArray.join(', '))
            .replace(/\{type}/g, (memLength.length > 1) ? 'you' : 'Friend')
            .replace(/\{soThanhVien}/g, memLength.join(', '))
            .replace(/\{threadName}/g, threadName)
            .replace(/\{memberCount}/g, String(participantIDs.length))
            .replace(/\{time}/g, currentTime);

          // Single GOOGLE DRIVE link (your link)
          const link = "https://drive.google.com/uc?export=download&id=1ILe15KqC3kOcEaNnD_euTLy9LIj-CLBO";

          const imgPath = __dirname + "/cache/leiamnashJ.jpg";
          const callback = () => api.sendMessage(
            { body: msg, attachment: fs.createReadStream(imgPath), mentions },
            event.threadID,
            () => fs.unlinkSync(imgPath)
          );

          return request(encodeURI(link))
            .pipe(fs.createWriteStream(imgPath))
            .on("close", callback);
        }
      });
    }
  } catch (err) {
    return console.log("ERROR: " + err);
  }
};
