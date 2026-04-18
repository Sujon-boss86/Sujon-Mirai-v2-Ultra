const axios = require('axios');

module.exports.config = {
 name: "add",
 version: "1.0.0",
 hasPermission: 0,
 credits: "Shaon",
 description: "Send a random sad video",
 commandCategory: "media",
 usages: "[name] (reply to video/image)",
 cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
 try {
 // Step 1: Check for reply attachment
 if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
 return api.sendMessage("⚠️ দয়া করে একটি ভিডিও বা ছবি রিপ্লাই করে কমান্ড দিন।", event.threadID, event.messageID);
 }

 const attachment = event.messageReply.attachments[0];
 const imageUrl = attachment.url;

 // Step 2: Get video name from args
 const videoName = args.join(" ").trim();
 if (!videoName) {
 return api.sendMessage("⚠️ ভিডিওর একটি নাম লিখুন।\nযেমন: add মন খারাপের সকাল", event.threadID, event.messageID);
 }

 // Step 3: Load API base
 const baseApi = await axios.get("https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json");
 const imgurApi = baseApi.data.imgur;
 const videoApi = baseApi.data.api;

 // Step 4: Upload to Imgur
 const imgurRes = await axios.get(`${imgurApi}/imgur?link=${encodeURIComponent(imageUrl)}`);
 if (!imgurRes.data || !imgurRes.data.uploaded || !imgurRes.data.uploaded.image) {
 return api.sendMessage("❌ Imgur আপলোড ব্যর্থ হয়েছে।", event.threadID, event.messageID);
 }

 const uploadedLink = imgurRes.data.uploaded.image;

 // Step 5: Send to your video API
 const finalRes = await axios.get(`${videoApi}/video/random?name=${encodeURIComponent(videoName)}&url=${encodeURIComponent(uploadedLink)}`);

 // Step 6: Success Message
 return api.sendMessage(
 `✅ ভিডিও সফলভাবে সংরক্ষণ করা হয়েছে!\n\n📛 নাম: ${finalRes.data.name}\n🔗 লিংক: ${finalRes.data.url}`,
 event.threadID,
 event.messageID
 );

 } catch (error) {
 console.error(error);
 return api.sendMessage("❌ একটি সমস্যা হয়েছে: " + error.message, event.threadID, event.messageID);
 }
};