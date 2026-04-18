const axios = require('axios');

module.exports.config = {
 name: "imgur",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SUJON",
 description: "Create an Imgur image link",
 commandCategory: "other",
 usages: "[reply with image or link]",
 cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
 try {
 const apis = await axios.get('https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json');
 const Shaon = apis.data.imgur;

 let linkanh = null;

 // যদি ইউজার কোনো ছবি reply করে
 if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
 linkanh = event.messageReply.attachments[0].url;
 }
 // নাহলে args থেকে লিঙ্ক নিতে চেষ্টা করো
 else if (args.length > 0) {
 linkanh = args.join(" ");
 }

 // যদি কোন ছবি বা লিঙ্ক না পাওয়া যায়
 if (!linkanh) {
 return api.sendMessage(
 '╭•┄┅══❁🌺❁══┅┄•╮\n\nআসসালামু আলাইকুম! 🖤💫\n\nযেই ছবিটিকে Imgur লিংকে রূপান্তর করতে চান, সেই ছবিটিতে `imgur` লিখে রিপ্লাই করুন।\n\n╰•┄┅══❁🌺❁══┅┄•╯',
 event.threadID,
 event.messageID
 );
 }

 // API কল করে ইমেজ আপলোড
 const res = await axios.get(`${Shaon}/imgur?link=${encodeURIComponent(linkanh)}`);

 if (res.data && res.data.uploaded && res.data.uploaded.image) {
 const img = res.data.uploaded.image;
 return api.sendMessage(`🔗 আপনার Imgur লিংক:\n${img}`, event.threadID, event.messageID);
 } else {
 return api.sendMessage("❌ ইমেজ আপলোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
 }

 } catch (error) {
 console.error("Imgur Module Error:", error.message || error);
 return api.sendMessage("❌ কিছু একটা ভুল হয়েছে। দয়া করে পরবর্তীতে আবার চেষ্টা করুন।", event.threadID, event.messageID);
 }
};