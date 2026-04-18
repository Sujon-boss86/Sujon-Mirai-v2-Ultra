const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../../antigroupname.json");

module.exports.config = {
    name: "antigroupname",
    version: "1.0",
    hasPermssion: 1,
    credits: "SUJON",
    description: "ON/OFF group name & icon lock",
    commandCategory: "group",
    usages: "[on/off]",
    cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
    const { threadID, messageID, args } = event;

    let data = {};
    if (fs.existsSync(DATA_FILE)) {
        data = JSON.parse(fs.readFileSync(DATA_FILE));
    }

    if (!data[threadID]) {
        data[threadID] = {
            lock: false,
            name: "",
            icon: "",
            warn: {}
        };
    }

    // ===== ON =====
    if (args[0] === "on") {
        const threadInfo = await api.getThreadInfo(threadID);

        data[threadID].lock = true;
        data[threadID].name = threadInfo.threadName || "No Name";
        data[threadID].warn = {};

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return api.sendMessage("✅ Anti Group Name & Icon Lock চালু হয়েছে", threadID, messageID);
    }

    // ===== OFF =====
    if (args[0] === "off") {
        data[threadID].lock = false;

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return api.sendMessage("❌ Anti Group Name & Icon Lock বন্ধ করা হয়েছে", threadID, messageID);
    }

    // ===== INVALID =====
    return api.sendMessage("⚙️ ব্যবহার:\nantigroupname on\nantigroupname off", threadID, messageID);
};