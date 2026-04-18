const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "admininfo",
  version: "2.2.0",
  hasPermssion: 0,
  credits: " Sujon",
  description: "Displays Admin Info in floral styled box",
  commandCategory: "info",
  usages: "",
  cooldowns: 5,
  usePrefix: false
};

module.exports.run = async function({ api, event }) {
  const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm A");

  const callback = () => api.sendMessage({
    body:
`╭•┄┅═══❁🌸❁═══┅┄•╮
       🌼 𝐀𝐃𝐌𝐈𝐍 𝐈𝐍𝐅𝐎 🌼
╰•┄┅═══❁🌸❁═══┅┄•╯

╭⊱ 𝗡𝗮𝗺𝗲: 𝗦𝗨𝗝𝗢𝗡
├⊱ 𝗚𝗲𝗻𝗱𝗲𝗿: 𝗠𝗮𝗹𝗲
├⊱ 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻: 𝗠𝗮𝗿𝗶𝗱
├⊱ 𝗔𝗴𝗲: 26
├⊱ 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻: 𝗜𝘀𝗹𝗮𝗺
├⊱ 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: Kaliakor, Gazipur
╰⊱ 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻: Job Holder

╭─❖ 𝗦𝗼𝗰𝗶𝗮𝗹 𝗟𝗶𝗻𝗸𝘀 ❖─╮
▶ TikTok: tiktok.com/@sujon  
▶ Facebook: facebook.com/sujonxn123  
▶ YouTube: youtube.com/@Sujon-bai  
╰──────────────────────╯

⌚ Updated Time: ${time}
`,
    attachment: fs.createReadStream(__dirname + "/cache/owner.jpg")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/owner.jpg"));

  return request("https://i.postimg.cc/FR6Tdrnv/received-1461582061731133.jpg")
    .pipe(fs.createWriteStream(__dirname + "/cache/owner.jpg"))
    .on("close", () => callback());
};