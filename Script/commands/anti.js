module.exports.config = {
  name: "anti",
  version: "4.2.0",
  hasPermssion: 1,
  credits: "SUJON",
  description: "Anti change Group info system",
  commandCategory: "Administrator",
  usages: "anti [reply number]",
  cooldowns: 5,
};

const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

const getDataFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 4), "utf8");
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    return defaultData;
  }
};

const writeDataFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
  const { senderID, threadID, messageID } = event;
  const { author, permssion } = handleReply;
  const permission = permssion || 1;

  if (author !== senderID) return api.sendMessage("❎ You are not the user who called this command.", threadID, messageID);

  const numbers = event.body.match(/\d+/g);
  if (!numbers || numbers.length === 0) return api.sendMessage("❎ Please reply with a number from the list.", threadID, messageID);

  // paths
  const antiPath = path.join(__dirname, "data", "anti.json");
  const antiEmojiPath = path.join(__dirname, "data", "antiemoji.json");
  const antiThemePath = path.join(__dirname, "data", "antitheme.json");
  const antiQTVPath = path.join(__dirname, "data", "antiqtv.json");
  const antiJoinPath = path.join(__dirname, "data", "threadData.json");

  // load data safely
  const dataAnti = getDataFile(antiPath, { boxname: [], boximage: [], antiNickname: [], antiout: {} });
  const dataEmoji = getDataFile(antiEmojiPath, {});
  const dataTheme = getDataFile(antiThemePath, {});
  const dataQTV = getDataFile(antiQTVPath, {});
  const dataJoin = getDataFile(antiJoinPath, {});

  for (const num of numbers) {
    switch (num) {
      case "1": { // Anti Namebox
        if (permission < 1) return api.sendMessage("⚠️ You don't have enough permission.", threadID, messageID);
        const antiName = dataAnti.boxname.find(item => item.threadID === threadID);
        if (antiName) dataAnti.boxname = dataAnti.boxname.filter(item => item.threadID !== threadID);
        else {
          const threadInfo = await api.getThreadInfo(threadID);
          dataAnti.boxname.push({ threadID, name: threadInfo.threadName });
        }
        writeDataFile(antiPath, dataAnti);
        api.sendMessage(`☑️ Anti Namebox ${antiName ? "DISABLED" : "ENABLED"}`, threadID, messageID);
        break;
      }
      case "2": { // Anti Box Image
        if (permission < 1) return api.sendMessage("⚠️ You don't have enough permission.", threadID, messageID);
        const antiImg = dataAnti.boximage.find(item => item.threadID === threadID);
        if (antiImg) dataAnti.boximage = dataAnti.boximage.filter(item => item.threadID !== threadID);
        else {
          const threadInfo = await api.getThreadInfo(threadID);
          dataAnti.boximage.push({ threadID, url: threadInfo.imageSrc || "" });
        }
        writeDataFile(antiPath, dataAnti);
        api.sendMessage(`☑️ Anti Box Image ${antiImg ? "DISABLED" : "ENABLED"}`, threadID, messageID);
        break;
      }
      case "3": { // Anti Nickname
        if (permission < 1) return api.sendMessage("⚠️ You don't have enough permission.", threadID, messageID);
        const antiNick = dataAnti.antiNickname.find(item => item.threadID === threadID);
        if (antiNick) dataAnti.antiNickname = dataAnti.antiNickname.filter(item => item.threadID !== threadID);
        else {
          const threadInfo = await api.getThreadInfo(threadID);
          dataAnti.antiNickname.push({ threadID, data: threadInfo.nicknames });
        }
        writeDataFile(antiPath, dataAnti);
        api.sendMessage(`☑️ Anti Nickname ${antiNick ? "DISABLED" : "ENABLED"}`, threadID, messageID);
        break;
      }
      case "4": { // Anti Out
        dataAnti.antiout[threadID] = !dataAnti.antiout[threadID];
        writeDataFile(antiPath, dataAnti);
        api.sendMessage(`☑️ Anti Out ${dataAnti.antiout[threadID] ? "ENABLED" : "DISABLED"}`, threadID, messageID);
        break;
      }
      case "5": { // Anti Emoji
        const threadInfo = await api.getThreadInfo(threadID);
        if (!dataEmoji[threadID]) dataEmoji[threadID] = { emoji: threadInfo.emoji || "", emojiEnabled: true };
        else dataEmoji[threadID].emojiEnabled = !dataEmoji[threadID].emojiEnabled;
        writeDataFile(antiEmojiPath, dataEmoji);
        api.sendMessage(`☑️ Anti Emoji ${dataEmoji[threadID].emojiEnabled ? "ENABLED" : "DISABLED"}`, threadID, messageID);
        break;
      }
      case "6": { // Anti Theme
        const threadInfo = await Threads.getInfo(threadID);
        if (!dataTheme[threadID]) dataTheme[threadID] = { themeid: threadInfo.threadTheme?.id || "", themeEnabled: true };
        else dataTheme[threadID].themeEnabled = !dataTheme[threadID].themeEnabled;
        writeDataFile(antiThemePath, dataTheme);
        api.sendMessage(`☑️ Anti Theme ${dataTheme[threadID].themeEnabled ? "ENABLED" : "DISABLED"}`, threadID, messageID);
        break;
      }
      case "7": { // Anti QTV
        const threadInfo = await api.getThreadInfo(threadID);
        if (!threadInfo.adminIDs.some(a => a.id == api.getCurrentUserID()))
          return api.sendMessage("❎ Bot needs Admin privileges!", threadID, messageID);
        dataQTV[threadID] = !dataQTV[threadID];
        writeDataFile(antiQTVPath, dataQTV);
        api.sendMessage(`☑️ Anti QTV ${dataQTV[threadID] ? "ENABLED" : "DISABLED"}`, threadID, messageID);
        break;
      }
      case "8": { // Anti Join
        dataJoin[threadID] = !dataJoin[threadID];
        writeDataFile(antiJoinPath, dataJoin);
        api.sendMessage(`☑️ Anti Join ${dataJoin[threadID] ? "ENABLED" : "DISABLED"}`, threadID, messageID);
        break;
      }
      case "9": { // Check Status
        const status = bool => bool ? "ON" : "OFF";
        const antiName = dataAnti.boxname.find(item => item.threadID === threadID);
        const antiImg = dataAnti.boximage.find(item => item.threadID === threadID);
        const antiNick = dataAnti.antiNickname.find(item => item.threadID === threadID);
        api.sendMessage(
          `[ ANTI SYSTEM STATUS ]\n────────────────────\n` +
          `|› 1. Anti Namebox: ${status(antiName)}\n` +
          `|› 2. Anti Imagebox: ${status(antiImg)}\n` +
          `|› 3. Anti Nickname: ${status(antiNick)}\n` +
          `|› 4. Anti Out: ${status(dataAnti.antiout[threadID])}\n` +
          `|› 5. Anti Emoji: ${status(dataEmoji[threadID]?.emojiEnabled)}\n` +
          `|› 6. Anti Theme: ${status(dataTheme[threadID]?.themeEnabled)}\n` +
          `|› 7. Anti QTV: ${status(dataQTV[threadID])}\n` +
          `|› 8. Anti Join: ${status(dataJoin[threadID])}\n` +
          `────────────────────\n` +
          `|› Maria Anti System - Protect your group!`,
          threadID, messageID
        );
        break;
      }
      default:
        api.sendMessage("❎ Invalid number.", threadID, messageID);
    }
  }
};

module.exports.run = async function({ api, event, permssion, Threads }) {
  const { threadID, messageID, senderID } = event;
  api.sendMessage(
    `╭─────────────⭓\n` +
    `│ Sujon Anti-Change Group\n` +
    `├─────⭔\n` +
    `│ 1. Anti Namebox\n` +
    `│ 2. Anti Box Image\n` +
    `│ 3. Anti Nickname\n` +
    `│ 4. Anti Out\n` +
    `│ 5. Anti Emoji\n` +
    `│ 6. Anti Theme\n` +
    `│ 7. Anti QTV\n` +
    `│ 8. Anti Join\n` +
    `│ 9. Check Anti Status\n` +
    `├────────⭔\n` +
    `│ 📌 Reply with a number to toggle the mode\n` +
    `╰─────────────⭓`,
    threadID,
    (err, info) => {
      if (!err) global.client.handleReply.push({
        name: "anti",
        messageID: info.messageID,
        author: senderID,
        permssion
      });
    },
    messageID
  );
};