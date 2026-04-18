const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// JSON with Renz API URLs
const noobcore =
 "https://raw.githubusercontent.com/noobcore404/NC-STORE/main/NCApiUrl.json";

// Fetch Renz API base URL
async function getRenzApi() {
 const res = await axios.get(noobcore, { timeout: 10000 });
 if (!res.data?.renz) throw new Error("Renz API not found in JSON");
 return res.data.renz;
}

module.exports = {
 config: {
 name: "edit",
 aliases: ["gptedit", "imageedit"],
 version: "1.1",
 credits: "rx + sujon",
 premium: true,
 countDown: 5,
 hasPermssion: 0,
 shortDescription: "Edit image with smart prompt system",
 longDescription:
 "Edit an image by replying to it. Special system for 'remove the dog' prompt.",
 commandCategory: "image",
 usages:
 "Reply to an image with prompt\nExample:\nremove the dog\nremove The dog\nmake it anime"
 },

 run: async function ({ api, event, args }) {
 const { threadID, messageReply } = event;

 const repliedImage = messageReply?.attachments?.[0];
 let prompt = args.join(" ").trim();

 if (!repliedImage || repliedImage.type !== "photo") {
 return api.sendMessage(
 "❌ Please reply to an image to edit it.",
 threadID
 );
 }

 if (!prompt) {
 return api.sendMessage(
 "❌ Please provide a prompt.\nExample:\nremove the dog",
 threadID
 );
 }

 // 🔥 SPECIAL PROMPT SYSTEM
 if (prompt === "remove the dog") {
 prompt = "remove the first man";
 } else if (prompt === "remove The dog") {
 prompt = "remove the 2nd boy";
 }
 // other prompts will stay as-is

 const processingMsg = await api.sendMessage(
 "⏳ Editing your image...",
 threadID
 );

 const imgPath = path.join(
 __dirname,
 "cache",
 `${Date.now()}_edit.png`
 );

 try {
 const BASE_URL = await getRenzApi();

 let apiURL = `${BASE_URL}/api/gptimage?prompt=${encodeURIComponent(
 prompt
 )}&ref=${encodeURIComponent(repliedImage.url)}`;

 if (repliedImage.width && repliedImage.height) {
 apiURL += `&width=${repliedImage.width}&height=${repliedImage.height}`;
 }

 const res = await axios.get(apiURL, {
 responseType: "arraybuffer",
 timeout: 180000
 });

 await fs.ensureDir(path.dirname(imgPath));
 await fs.writeFile(imgPath, Buffer.from(res.data));

 await api.unsendMessage(processingMsg.messageID);

 await api.sendMessage(
 {
 body: `🖌 Image edited successfully.\nPrompt used: ${prompt}`,
 attachment: fs.createReadStream(imgPath)
 },
 threadID
 );
 } catch (err) {
 console.error("EDIT Error:", err?.response?.data || err.message);
 await api.unsendMessage(processingMsg.messageID);
 api.sendMessage(
 "❌ Failed to edit the image. Try again later.",
 threadID
 );
 } finally {
 if (fs.existsSync(imgPath)) await fs.remove(imgPath);
 }
 }
};