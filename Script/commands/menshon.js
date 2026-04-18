module.exports.config = {

  name: "goiadmin",

  version: "1.0.0",

  hasPermssion: 0,

  credits: "SUJON",

  description: "Bot will rep ng tag admin or rep ng tagbot ",

  commandCategory: "Other",

  usages: "",

  cooldowns: 1

};

module.exports.handleEvent = function({ api, event }) {

  if (event.senderID !== "100093864940916") {

    var aid = ["100093864940916"];

    for (const id of aid) {

    if ( Object.keys(event.mentions) == id) {

      var msg = ["ডাকাডাকি করিস না বস ব্যস্ত আছে 😒😌", "বস এক আবালে আপনাকে মেনশন দিছে 😑🌚😁", "যেভাবে মেনশন দিতাচত মনে হয় তোর গার্লফ্রেন্ডটারে , আমার বসকে দিয়া দিবি 🫥😒", "বস এক পাগল ছাগল , আপনাকে ডাকতেছে 🐸🫵🏾", "বস এক হালায় আপনার নাম ধরছে , আপনি শুধু একবার আদেশ করুন, আজকে হালার নানিরে চমলক্ক করে দিমু 😑🥴", "মেনশন না দিয়া একটা girlfriend খুজে দে 🙃😮‍💨", "মাইয়া হলে বসের ইনবক্স এ যাও", "বস এখন ব্যস্ত আছে , কিছু বলতে হলে ইনবক্স এ গিয়া বল ", "বস এখন আমার সাথে মিটিং এ আছে , মেনশন দিস না 🙂", "বস এখন ব্যস্ত আছে , কি বলবি আমাকে বল ", "আরেক বার mention দিলে চুমায়া ঠোঁটের কালার চেঞ্জ করে ফেলবো 🥵💋", "তাকে ডাকার আগে একবার আয়নায় নিজেকে দেখে নে—এই লেভেলের মানুষকে ডাকার সাহস সবার হয় না!",];

      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);

    }

    }}

};

module.exports.run = async function({}) {

        }