module.exports = function ({ api, models, Users, Threads, Currencies }) {
const logger = require("../../utils/log.js");
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

return async function ({ event }) {  
    if (!event) return;  

    const timeStart = Date.now();  

    const { userBanned, threadBanned } = global.data;  
    const { events } = global.client;  
    const { DeveloperMode } = global.config;  

    let { senderID, threadID } = event;  
    senderID = String(senderID);  
    threadID = String(threadID);  

    if (!global._eventDebugShown) {
        console.log("✅ Loaded Events:", [...events.keys()]);
        global._eventDebugShown = true;
    }

    if (senderID == api.getCurrentUserID()) return;  

    if (userBanned.has(senderID) || threadBanned.has(threadID)) return;  

    if (event.type == "change_thread_image") 
        event.logMessageType = "change_thread_image";  

    try {
        const antiPath = path.join(__dirname, "../../Script/commands/data/anti.json");
        const antiEmojiPath = path.join(__dirname, "../../Script/commands/data/antiemoji.json");
        const antiThemePath = path.join(__dirname, "../../Script/commands/data/antitheme.json");
        const antiQTVPath = path.join(__dirname, "../../Script/commands/data/antiqtv.json");

        const dataAnti = fs.existsSync(antiPath) ? JSON.parse(fs.readFileSync(antiPath, "utf8")) : {};
        const dataEmoji = fs.existsSync(antiEmojiPath) ? JSON.parse(fs.readFileSync(antiEmojiPath, "utf8")) : {};
        const dataTheme = fs.existsSync(antiThemePath) ? JSON.parse(fs.readFileSync(antiThemePath, "utf8")) : {};
        const dataQTV = fs.existsSync(antiQTVPath) ? JSON.parse(fs.readFileSync(antiQTVPath, "utf8")) : {};

        // 🔰 Anti Namebox
        if (event.logMessageType === "log:thread-name") {
            const antiName = dataAnti.boxname?.find(item => item.threadID == threadID);
            if (antiName) {
                await api.setTitle(antiName.name, threadID);
                api.sendMessage("🚫 Name change blocked!", threadID);
            }
        }

        // 🖼️ Anti Group Image
        if (event.logMessageType === "log:thread-image" || event.logMessageType === "change_thread_image") {
            const antiImg = dataAnti.boximage?.find(item => item.threadID == threadID);
            if (antiImg) {
                await api.changeGroupImage(antiImg.url, threadID);
                api.sendMessage("🚫 Group image change blocked!", threadID);
            }
        }

        // 😈 Anti Nickname
        if (event.logMessageType === "log:user-nickname") {
            const antiNick = dataAnti.antiNickname?.find(item => item.threadID == threadID);
            if (antiNick) {
                const nickData = antiNick.data;
                for (const uid in nickData) {
                    await api.changeNickname(nickData[uid], threadID, uid);
                }
                api.sendMessage("🚫 Nickname change blocked!", threadID);
            }
        }

        // 😀 Anti Emoji
        if (event.logMessageType === "log:thread-icon") {
            if (dataEmoji[threadID]?.emojiEnabled) {
                await api.changeThreadEmoji(dataEmoji[threadID].emoji, threadID);
                api.sendMessage("🚫 Emoji change blocked!", threadID);
            }
        }

        // 🎨 Anti Theme
        if (event.logMessageType === "log:thread-color") {
            if (dataTheme[threadID]?.themeEnabled) {
                await api.changeThreadColor(dataTheme[threadID].themeid, threadID);
                api.sendMessage("🚫 Theme change blocked!", threadID);
            }
        }

        // 👑 Anti Admin Protect
        if (event.logMessageType === "log:thread-admins") {
            if (dataQTV[threadID]) {
                const botID = api.getCurrentUserID();
                const threadInfo = await api.getThreadInfo(threadID);

                if (!threadInfo.adminIDs.some(a => a.id == botID)) return;

                const target = event.logMessageData.TARGET_ID;
                const type = event.logMessageData.ADMIN_EVENT;

                if (type === "remove_admin") {
                    await api.changeAdminStatus(threadID, target, true);
                    api.sendMessage("🚫 Admin remove blocked!", threadID);
                }
            }
        }

    } catch (e) {
        console.log("Anti System Error:", e);
    }
    // ================= ANTI SYSTEM END =================

    // ================= EVENT RUN =================
    for (const [key, value] of events.entries()) {  
        if (!value?.config?.eventType) continue;  

        if (value.config.eventType.includes(event.logMessageType)) {  
            try {  
                const Obj = { api, event, models, Users, Threads, Currencies };  

                if (typeof value.run === "function") 
                    await value.run(Obj);  

                if (typeof value.runEvent === "function") 
                    await value.runEvent(Obj);  

                if (DeveloperMode === true)  
                    logger(`Executed event: ${value.config.name} | ${threadID} | ${Date.now()-timeStart}ms`, "[EVENT]");  

            } catch (e) {  
                logger(`Event error: ${value.config.name} | ${JSON.stringify(e)}`, "error");  
            }  
        }  
    }  

};
};