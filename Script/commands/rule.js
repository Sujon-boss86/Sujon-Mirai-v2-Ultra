module.exports.config = {
 name: "rules",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "SUJON",
 description: "Important group rules",
 commandCategory: "random-img",
 usages: "Send group rules message",
 cooldowns: 5,
 dependencies: {
 request: "",
 "fs-extra": "",
 axios: ""
 }
};

module.exports.run = async ({
 api,
 event,
 args,
 client,
 Users,
 Threads,
 __GLOBAL,
 Currencies
}) => {
 const request = global.nodemodule.request;
 const fs = global.nodemodule["fs-extra"];

 var imageLinks = ["https://i.postimg.cc/fTj5gGC1/20250627-222448.jpg"];

 var sendRules = () => api.sendMessage({
 body: `⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
•—»✨ আসসালামু আলাইকুম 🖤💫
•—»✨ এটি একটি আড্ডা গ্রুপ এবং আমি সুজন এর রোবট 🤖🕋
দয়া করে নিচের নিয়মগুলো অনুসরণ করুন:

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆

❄️ ১. বাজে ভাষা বা গালি করা সম্পূর্ণ নিষিদ্ধ।
❄️ ২. অশ্লীল ছবি/ভিডিও বা ১৮+ বিষয় শেয়ার করা যাবে না।
❄️ ৩. সবাইকে সম্মান দিন, বড় হোক বা ছোট হোক।
❄️ ৪. ঝগড়া, তর্ক বা অপমান করা যাবে না।
❄️ ৫. গ্রুপের নাম, ছবি বা সেটিংস শুধুমাত্র এডমিন পরিবর্তন করতে পারবেন।
❄️ ৬. অন্য বট বা স্প্যাম লিঙ্ক শেয়ার করা যাবে না।
❄️ ৭. সকলে ইসলামিক ও জ্ঞানমূলক আলোচনা করুন।
❄️ ৮. এক ইমোজি বারবার ব্যবহার করা যাবে না।
❄️ ৯. ব্যবসা বা প্রমোশন শেয়ার করা যাবে না।
❄️ ১০. নিয়ম ভঙ্গ করলে গ্রুপ থেকে সরানো হতে পারে।

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
💛 প্রিয় ভাই-বোনেরা, এই গ্রুপ আপনাদের জন্য কষ্ট করে তৈরি করা হয়েছে। 
দয়া করে নিয়মগুলো মানুন এবং সুন্দর পরিবেশ বজায় রাখুন। 

⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
📌 ৫ ওয়াক্ত নামাজ পড়ুন, আল্লাহকে ডাকুন এবং হারাম থেকে দূরে থাকুন। 
দোয়া রইলো আপনাদের জন্য। 🤲❤️`,
 attachment: fs.createReadStream(__dirname + "/cache/ZiaRein1.jpg")
 }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/ZiaRein1.jpg"), event.messageID);

 return request(encodeURI(imageLinks[Math.floor(Math.random() * imageLinks.length)]))
 .pipe(fs.createWriteStream(__dirname + "/cache/ZiaRein1.jpg"))
 .on("close", () => sendRules());
};