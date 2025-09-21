const moment = require("moment");

module.exports.config = {
    name: "age",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Sagor",
    description: "Check age from date of birth",
    commandCategory: "fun",
    usages: "age <DD-MM-YYYY>",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    if (!args[0]) {
        return api.sendMessage("⚠️ Please provide your birth date.\n👉 Format: DD-MM-YYYY\nExample: age 21-09-2005", event.threadID, event.messageID);
    }

    const inputDate = args[0];
    const birthDate = moment(inputDate, "DD-MM-YYYY", true);

    if (!birthDate.isValid()) {
        return api.sendMessage("❌ Invalid date format!\n👉 Use: DD-MM-YYYY\nExample: age 21-09-2005", event.threadID, event.messageID);
    }

    const today = moment();
    const ageYears = today.diff(birthDate, "years");
    const ageMonths = today.diff(birthDate, "months") % 12;
    const ageDays = today.diff(birthDate.add(ageYears, "years").add(ageMonths, "months"), "days");

    return api.sendMessage(
        `📅 Birth Date: ${birthDate.format("DD-MM-YYYY")}\n🎂 Your Age: ${ageYears} years ${ageMonths} months ${ageDays} days`,
        event.threadID,
        event.messageID
    );
};
