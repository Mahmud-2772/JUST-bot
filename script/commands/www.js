const axios = require("axios");

module.exports.config = {
    name: "www",
    version: "1.0",
    hasPermission: 0,
    credits: "SaGor",
    description: "Randomly select two group members and generate a 'Who Would Win?' image",
    commandCategory: "fun",
    usages: "www",
    cooldowns: 5,
};

function formatFont(text) {
    return text;
}

module.exports.run = async function ({ api, event }) {
    const { threadID, senderID } = event;

    let dataSender = await api.getUserInfo(senderID);
    let nameSender = dataSender[senderID].name;

    let threadInfo = await api.getThreadInfo(threadID);
    let participants = threadInfo.participantIDs;

    let id1 = senderID;
    let id2;
    do {
        id2 = participants[Math.floor(Math.random() * participants.length)];
    } while (id2 === id1);

    let data1 = await api.getUserInfo(id1);
    let name1 = data1[id1].name;

    let data2 = await api.getUserInfo(id2);
    let name2 = data2[id2].name;

    let arraytag = [
        { id: id1, tag: name1 },
        { id: id2, tag: name2 }
    ];

    let messageBody = formatFont(`Who would win? ${name1} vs ${name2}!`);

    let url = `https://api.popcat.xyz/whowouldwin?image1=https://api-canvass.vercel.app/profile?uid=${id1}&image2=https://api-canvass.vercel.app/profile?uid=${id2}`;

    const imageStream = await axios.get(url, { responseType: "stream" }).then(res => res.data);

    return api.sendMessage({ body: messageBody, attachment: imageStream, mentions: arraytag }, threadID);
};
