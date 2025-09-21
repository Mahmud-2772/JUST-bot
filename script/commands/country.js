const axios = require("axios");

module.exports.config = {
    name: "country",
    version: "1.0",
    hasPermission: 0,
    credits: "SaGor",
    description: "Get detailed information about a country",
    commandCategory: "utilities",
    usages: "country [country name]",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const name = args.join(' ').trim();
    if (!name) return api.sendMessage(
        `════『 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 』════\n\n⚠️ Please provide a country name.\n📌 Usage: country <country name>\n💬 Example: country Philippines\n> Powered by Rapido Country API`,
        threadID, messageID
    );

    try {
        await api.sendMessage(`════『 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 』════\n🌍 Fetching information for: "${name}"\nPlease wait...`, threadID, messageID);

        const apiUrl = "https://rapido.zetsu.xyz/api/country";
        const response = await axios.get(apiUrl, { params: { name } });
        const data = response.data;

        let resultMsg = `════『 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 』════\n\n`;

        if (typeof data === "object" && (data.country || data.name)) {
            resultMsg += `• Country: ${data.country || data.name}\n`;
            if (data.capital) resultMsg += `• Capital: ${data.capital}\n`;
            if (data.region) resultMsg += `• Region: ${data.region}\n`;
            if (data.subregion) resultMsg += `• Subregion: ${data.subregion}\n`;
            if (data.population) resultMsg += `• Population: ${data.population}\n`;
            if (data.area) resultMsg += `• Area: ${data.area} km²\n`;
            if (data.currency) resultMsg += `• Currency: ${data.currency}\n`;
            if (data.languages) resultMsg += `• Languages: ${data.languages}\n`;
            if (data.flag) resultMsg += `• Flag: ${data.flag}\n`;
            if (data.timezone) resultMsg += `• Timezone: ${data.timezone}\n`;
        } else {
            resultMsg += "⚠️ No data found for this country.";
        }

        resultMsg += `\n> Powered by Rapido Country API`;
        return api.sendMessage(resultMsg, threadID, messageID);

    } catch (error) {
        console.error('❌ Error in country command:', error.message || error);
        return api.sendMessage(
            `════『 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 𝗘𝗥𝗥𝗢𝗥 』════\n\n🚫 Failed to fetch the country info.\nReason: ${error.response?.data?.message || error.message || 'Unknown error'}\n> Please try again later.`,
            threadID, messageID
        );
    }
};
