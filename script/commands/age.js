const moment = require("moment-timezone");

module.exports.config = {
  name: "age",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SaGor",
  description: "Calculate exact age from year or date",
  commandCategory: "Tool",
  usages: "[year] or [DD-MM-YYYY]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!args[0]) {
      return api.sendMessage(
        "⚠️ Please provide your birth year or birth date!\n\n📌 Example:\n• age 2005\n• age 01-01-2001",
        event.threadID,
        event.messageID
      );
    }

    let input = args[0];

    if (/^\d{4}$/.test(input)) {
      let birthYear = parseInt(input);
      let currentYear = moment().tz("Asia/Dhaka").year();
      let age = currentYear - birthYear;
      return api.sendMessage(
        `🎂 Birth Year: ${birthYear}\n🧾 Age: ${age} years`,
        event.threadID,
        event.messageID
      );
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
      let birthDate = moment.tz(input, "DD-MM-YYYY", "Asia/Dhaka").startOf("day");
      if (!birthDate.isValid()) {
        return api.sendMessage(
          "⚠️ Invalid date! Use format: DD-MM-YYYY",
          event.threadID,
          event.messageID
        );
      }

      let now = moment.tz("Asia/Dhaka").startOf("day");
      let years = now.diff(birthDate, "years");
      birthDate.add(years, "years");
      let months = now.diff(birthDate, "months");
      birthDate.add(months, "months");
      let days = now.diff(birthDate, "days");

      return api.sendMessage(
        `🎂 Birth Date: ${input}\n🧾 Age: ${years} years, ${months} months, ${days} days`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      "⚠️ Invalid format!\n\n📌 Example:\n• age 2005\n• age 01-01-2001",
      event.threadID,
      event.messageID
    );
  } catch (e) {
    return api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
  }
};
