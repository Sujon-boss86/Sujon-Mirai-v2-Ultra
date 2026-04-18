module.exports.config = {

  name: "fork",

  version: "1.0.0",

  hasPermssion: 0,

  credits: "SUJON",

  description: "Send GitHub repo link",

  commandCategory: "other",

  usages: "fork",

  cooldowns: 3,

  usePrefix: true // prefix সাপোর্ট থাকবে

};


const repoLink = "https://github.com/Sujon-boss86/Sujon-boss.git";


// 🔹 noprefix কাজ করার জন্য

module.exports.handleEvent = async function ({ api, event }) {

  if (!event.body) return;

  const text = event.body.toLowerCase().trim();


  if (text === "fork") {

    return api.sendMessage(repoLink, event.threadID, event.messageID);

  }

};


// 🔹 prefix কাজ করার জন্য

module.exports.run = async function ({ api, event }) {

  return api.sendMessage(repoLink, event.threadID, event.messageID);

};