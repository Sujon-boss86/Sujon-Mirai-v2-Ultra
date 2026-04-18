const chalk = require('chalk');

module.exports.config = {
    name: "join",
    version: "1.0.2",
    hasPermssion: 2,
    credits: "SUJON",
    description: "Join the Bot boxes are in",
    commandCategory: "System",
    usages: "",
    cooldowns: 5
};

module.exports.onLoad = () => {
    console.log(chalk.bold.hex("#00c300")("============ SUCCESFULLY LOADED THE JOIN COMMAND ============"));
}

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
    const { threadID, messageID, senderID, body } = event;
    const { ID } = handleReply;

    if (!body || isNaN(body)) 
        return api.sendMessage('Your selection must be a number.', threadID, messageID);

    const choice = parseInt(body) - 1;

    if (choice < 0 || choice >= ID.length) 
        return api.sendMessage("Your pick is not on the list", threadID, messageID);

    try {
        const threadInfo = await Threads.getInfo(ID[choice]);
        const { participantIDs, approvalMode, adminIDs, threadName } = threadInfo;

        if (participantIDs.includes(senderID)) 
            return api.sendMessage(`You are already in the group "${threadName}".`, threadID, messageID);

        await api.addUserToGroup(senderID, ID[choice]);

        if (approvalMode && !adminIDs.some(item => item.id === api.getCurrentUserID())) {
            return api.sendMessage("Added you to the group's approval list. Check the waiting section.", threadID, messageID);
        } else {
            return api.sendMessage(`You have been added to the group "${threadName}"! Check your messages. 💟`, threadID, messageID);
        }
    } catch (error) {
        return api.sendMessage(`I couldn't add you to that group:\n${error}`, threadID, messageID);
    }
}

module.exports.run = async function({ api, event, Threads }) {
    const { threadID, messageID, senderID } = event;

    const allThreads = await Threads.getAll();
    if (!allThreads || allThreads.length == 0)
        return api.sendMessage("No groups found.", threadID, messageID);

    let msg = `🔰==[ BOX LIST ]==🔰\n\n`;
    const ID = [];

    allThreads.forEach((thread, index) => {
        msg += `${index + 1}. ${thread.threadInfo.threadName}\n`;
        ID.push(thread.threadID);
    });

    msg += `\n👉 Reply to this message with the number corresponding to the group you want to join.`;

    return api.sendMessage(msg, threadID, (error, info) => {
        if (!error) {
            global.client.handleReply.push({
                name: this.config.name,
                author: senderID,
                messageID: info.messageID,
                ID: ID
            });
        }
    }, messageID);
}