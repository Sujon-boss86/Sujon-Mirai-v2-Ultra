module.exports.config = {
 name: "removebg",
 version: "1.1.1",
 hasPermssion: 0,
 credits: "SUJON",
 description: "Remove Background from photo",
 commandCategory: "Tool",
 usages: "Reply images or url images",
 cooldowns: 2,
 dependencies: {
 "form-data": "",
 "image-downloader": ""
 }
};

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs-extra");
const path = require("path");
const { image } = require("image-downloader");

module.exports.run = async function ({ api, event, args }) {
 try {
 if (event.type !== "message_reply") {
 return api.sendMessage("⚠️ Please reply to an image", event.threadID, event.messageID);
 }

 if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
 return api.sendMessage("⚠️ Please reply to an image", event.threadID, event.messageID);
 }

 if (event.messageReply.attachments[0].type !== "photo") {
 return api.sendMessage("❌ This is not an image", event.threadID, event.messageID);
 }

 const imageUrl = event.messageReply.attachments[0].url;

 const apiKeys = [
 "y5K9ssQnhr8sB9Tp4hrMsLtU",
 "s6d6EanXm7pEsck9zKjgnJ5u",
 "GJkFyR3WdGAwn8xW5MDYAVWf",
 "xHSGza4zdY8KsHGpQs4phRx9",
 "ymutgb6hEYEDR6xUbfQUiPri",
 "m6AhtWhWJBAPqZzy5BrvMmUp",
 "ZLTgza4FPGii1AEUmZpkzYb7"
 ];

 const filePath = path.resolve(__dirname, "cache", "removebg.png");

 // Download image
 await image({
 url: imageUrl,
 dest: filePath
 });

 const formData = new FormData();
 formData.append("size", "auto");
 formData.append("image_file", fs.createReadStream(filePath));

 const response = await axios({
 method: "post",
 url: "https://api.remove.bg/v1.0/removebg",
 data: formData,
 responseType: "arraybuffer",
 headers: {
 ...formData.getHeaders(),
 "X-Api-Key": apiKeys[Math.floor(Math.random() * apiKeys.length)]
 }
 });

 if (response.status !== 200) {
 return api.sendMessage("❌ Failed to remove background", event.threadID, event.messageID);
 }

 fs.writeFileSync(filePath, response.data);

 return api.sendMessage(
 {
 attachment: fs.createReadStream(filePath)
 },
 event.threadID,
 () => fs.unlinkSync(filePath)
 );

 } catch (err) {
 console.log(err);
 return api.sendMessage("❌ Error processing image", event.threadID, event.messageID);
 }
};