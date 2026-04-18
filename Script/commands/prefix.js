const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
 name: "prefix",
 version: "3.1.1",
 hasPermssion: 0,
 credits: "SUJON FIX UPDATED",
 description: "Show bot and group prefix",
 commandCategory: "system",
 usages: "",
 cooldowns: 5,
 usePrefix: false
};

module.exports.handleEvent = async function ({ api, event, Threads }) {
 const { threadID, messageID, body } = event;
 if (!body) return;

 if (body.toLowerCase().trim() === "prefix") {

 const ping = Date.now() - event.timestamp;

 const now = new Date();
 const day = now.toLocaleDateString("en-US", {
 weekday: "long",
 timeZone: "Asia/Dhaka"
 });

 const time = now.toLocaleTimeString("en-US", {
 timeZone: "Asia/Dhaka",
 hour12: true
 });

 const BOTPREFIX = global.config.PREFIX || "!";
 let GROUPPREFIX = BOTPREFIX;

 try {
 // ✅ MAIN FIX START

 const data = await Threads.getData(threadID);

 if (data && data.data) {
 if (data.data.prefix && data.data.prefix.trim() !== "") {
 GROUPPREFIX = data.data.prefix;
 }
 }

 // fallback (old cache)
 const threadData = global.data.threadData.get(threadID);
 if (threadData && threadData.prefix) {
 GROUPPREFIX = threadData.prefix;
 }

 // ✅ MAIN FIX END

 } catch (e) {
 GROUPPREFIX = BOTPREFIX;
 }

 const BOTNAME = global.config.BOTNAME || "Sujon Chat Bot";

 const msg = `🌟 PREFIX INFO 🌟

🕒 Time: ${time}
📅 Day: ${day}
⚡ Ping: ${ping}ms
🤖 Bot Name: ${BOTNAME}

💠 Bot Prefix: ${BOTPREFIX}
💬 Group Prefix: ${GROUPPREFIX}
`;

 const imageList = [
 "https://i.postimg.cc/FR6Tdrnv/received_1461582061731133.jpg",
 "https://i.postimg.cc/JnzBCPst/20250330_234834.jpg",
 "https://i.postimg.cc/GpjckzNd/1677672960289.jpg"
 ];

 const randomImage = imageList[Math.floor(Math.random() * imageList.length)];

 const cachePath = path.join(__dirname, "cache");
 fs.ensureDirSync(cachePath);

 const filePath = path.join(cachePath, `prefix_${Date.now()}.jpg`);

 const res = await axios.get(randomImage, { responseType: "arraybuffer" });
 fs.writeFileSync(filePath, Buffer.from(res.data));

 api.sendMessage(
 {
 body: msg,
 attachment: fs.createReadStream(filePath)
 },
 threadID,
 () => fs.unlinkSync(filePath),
 messageID
 );
 }
};

module.exports.run = async () => {};