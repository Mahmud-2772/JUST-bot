const axios = require("axios");

module.exports.config = {
    name: "weather",
    version: "1.5",
    hasPermission: 0,
    credits: "SaGor",
    description: "Get weather of a city in English",
    commandCategory: "utilities",
    usages: "weather [city name]",
    cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const city = args.join(" ");
        if (!city) return api.sendMessage("Please provide a city name.", event.threadID);

        const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        const data = response.data;

        const current = data.current_condition[0];
        const tempC = current.temp_C;
        const tempF = current.temp_F;
        const condition = current.weatherDesc[0].value;
        const humidity = current.humidity;
        const wind = current.windspeedKmph;

        const message = 
`🌤 City: ${city}
🌡 Temperature: ${tempC}°C / ${tempF}°F
☁ Condition: ${condition}
💧 Humidity: ${humidity}%
🌬 Wind: ${wind} km/h`;

        return api.sendMessage(message, event.threadID);
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Failed to fetch weather. Make sure the city name is correct.", event.threadID);
    }
};
