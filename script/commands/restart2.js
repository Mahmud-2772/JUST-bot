module.exports.config = {
	name: "rst",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "SaGor",
	description: "Restart Bot",
	commandCategory: "system",
	usages: "",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(`${global.config.BOTNAME}  𝐁𝐎𝐓 𝐑𝐄𝐒𝐓𝐀𝐑𝐓 🔴🟡🟢...`, threadID, () => process.exit(1));
}
