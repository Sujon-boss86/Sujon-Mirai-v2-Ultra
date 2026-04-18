const fs = require("fs");

module.exports.config = {
    name: "boxlist",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "SUJON-BOSS",
    description: "Show all groups and control them",
    commandCategory: "Admin",
    usages: "",
    cooldowns: 5
};

const banFile = __dirname + "/gban.json";

if (!fs.existsSync(banFile)) {
    fs.writeFileSync(banFile, JSON.stringify([]));
}

module.exports.run = async function({ api, event, Threads }) {
    const { threadID, messageID, senderID } = event;

    let allThreads = await Threads.getAll();
    let banned = JSON.parse(fs.readFileSync(banFile));

    let msg = `📋 GROUP LIST\n\n`;
    let ID = [];

    allThreads.forEach((t, i) => {
        let name = t.threadInfo.threadName || "No Name";
        let status = banned.includes(t.threadID) ? "🚫 BANNED" : "✅ ACTIVE";

        msg += `${i + 1}. ${name}\n   → ${status}\n`;
        ID.push(t.threadID);
    });

    msg += `\nReply:\n[out number] → leave group\n[ban number] → disable bot\n[unban number] → enable bot`;

    return api.sendMessage(msg, threadID, (err, info) => {
        global.client.handleReply.push({
            name: this.config.name,
            author: senderID,
            messageID: info.messageID,
            ID: ID
        });
    }, messageID);
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const fs = require("fs");
    const { threadID, messageID, body } = event;
    const { ID } = handleReply;

    let banned = JSON.parse(fs.readFileSync(banFile));

    if (!body) return;

    let [cmd, num] = body.split(" ");
    num = parseInt(num) - 1;

    if (num < 0 || num >= ID.length) {
        return api.sendMessage("❌ Invalid number", threadID, messageID);
    }

    let target = ID[num];

    // OUT
    if (cmd === "out") {
        api.sendMessage("👋 Leaving group...", threadID, () => {
            api.removeUserFromGroup(api.getCurrentUserID(), target);
        });
    }

    // BAN
    else if (cmd === "ban") {
        if (!banned.includes(target)) {
            banned.push(target);
            fs.writeFileSync(banFile, JSON.stringify(banned, null, 2));
        }
        return api.sendMessage("🚫 Bot disabled in that group", threadID, messageID);
    }

    // UNBAN
    else if (cmd === "unban") {
        banned = banned.filter(id => id != target);
        fs.writeFileSync(banFile, JSON.stringify(banned, null, 2));

        return api.sendMessage("✅ Bot enabled in that group", threadID, messageID);
    }
};