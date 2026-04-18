const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
    name: "faceswap",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "CYBER ULLASH",
    description: "Face swap two images",
    commandCategory: "image",
    usages: "Reply with 2 images",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    try {
        let sourceUrl, targetUrl;

        // 👉 Reply case
        if (
            event.type === "message_reply" &&
            event.messageReply.attachments &&
            event.messageReply.attachments.length >= 2
        ) {
            sourceUrl = event.messageReply.attachments[0].url;
            targetUrl = event.messageReply.attachments[1].url;
        }

        // 👉 Send 2 images together
        else if (event.attachments && event.attachments.length >= 2) {
            sourceUrl = event.attachments[0].url;
            targetUrl = event.attachments[1].url;
        }

        else {
            return api.sendMessage(
                "⚠️ 2টা image একসাথে দে বা 2 image থাকা message এ reply দে!",
                event.threadID,
                event.messageID
            );
        }

        api.sendMessage("⏳ Face swapping চলছে...", event.threadID);

        const apiKey = "hello_world";
        const apiUrl = `https://mahbub-ullash.cyberbot.top/api/faceswap?api_key=${apiKey}&sourceUrl=${encodeURIComponent(sourceUrl)}&targetUrl=${encodeURIComponent(targetUrl)}`;

        const res = await axios.get(apiUrl, { responseType: "arraybuffer" });

        const filePath = path.join(__dirname, "cache", `faceswap_${Date.now()}.png`);
        fs.writeFileSync(filePath, res.data);

        return api.sendMessage(
            {
                body: "✨ Face swap complete!",
                attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            () => fs.unlinkSync(filePath),
            event.messageID
        );

    } catch (err) {
        console.error(err);
        return api.sendMessage(
            "❌ API error বা face detect করতে পারে নাই!",
            event.threadID,
            event.messageID
        );
    }
};