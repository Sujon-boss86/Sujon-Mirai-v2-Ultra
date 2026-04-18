module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "SUJON",
  description: "Notify bot or group member with random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

  const path = join(__dirname, "SUJON", "font");
  if (existsSync(path)) mkdirSync(path, { recursive: true });	

  const path2 = join(__dirname, "SUJON", "font");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}


module.exports.run = async function({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { threadID } = event;
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    const fs = require("fs");
    return api.sendMessage("চ্ঁলে্ঁ এ্ঁসে্ঁছি্ঁ সু্ঁজ্ঁনে্ঁর্ঁ চ্যা্ঁট্ঁ ব্ঁট্ঁ", event.threadID, () => api.sendMessage({body:`╔════•| ✿ |•════╗\nআ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ\n╚════•| ✿ |•════╝
________________________
𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐢-𝐠𝐫𝐨𝐮𝐩-🖤🤗\n𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐚𝐡𝐚𝐥𝐥𝐚𝐡 🌺❤️-!!
________________________\n\n𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝

${global.config.PREFIX}Help\n${global.config.PREFIX}Info\n${global.config.PREFIX}Admin
________________________\n★যে্ঁকো্ঁনো্ঁ অ্ঁভি্ঁযো্ঁগ্ঁ অ্ঁথ্ঁবা্ৃ হে্ঁল্প্ঁ এ্ঁর্ঁ জ্ঁন্য্ঁ এ্ঁড্ঁমি্ঁন্ঁ সু্ঁজ্ঁন্ঁ কে্ঁ ন্ঁক্ঁ ক্ঁর্ঁতে্ঁ পা্ঁরে্ঁন্ঁ★\n𝐌𝐞𝐬𝐬𝐞𝐠𝐞𝐫: https://m.me/cybersujonbossrs\n𝐈𝐦𝐨 𝐎𝐫 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩: 01609162551
\n⋆✦⎯⎯⎯⎯⎯⎯⎯⎯✦⋆\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ➢ 𝐒𝐮𝐣𝐨𝐧 - 𝐁𝐨𝐬𝐬`, attachment: fs.createReadStream(__dirname + "/SUJON/wlc.png")} ,threadID));
  }
  else {
    try {
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);

      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const path = join(__dirname, "SUJON", "font");
      const pathGif = join(path, `${threadID}.gif`);

      var mentions = [], nameArray = [], memLength = [], i = 0;

      for (id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id });
        memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);

      (typeof threadData.customJoin == "undefined") ? msg = "╔════•| ✿ |•════╗\nআ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ\n╚════•| ✿ |•════╝\nহা্ঁসি্ঁ ম্ঁজা্ঁ ঠা্ঁট্টা্ঁয়্ঁ ব্ঁন্ধু্ঁত্ব্ঁ হ্ঁবে্ঁ চি্ঁর্ঁকা্ঁলী্ঁন্ঁ বে্ঁচে্ঁ থা্ঁকু্ঁক্ঁ ব্ঁন্ধু্ঁত্ব্ঁ\nভা্ঁলো্ঁবা্ঁসা্ঁর্ঁ স্ঁম্প্ঁর্কে্ঁ আ্ঁজী্ঁব্ঁন্ঁ\n\n {name} \n\nআ্ঁপ্ঁনি্ঁ এ্ঁই্ঁ গ্রু্ঁফে্ঁর্ঁ {soThanhVien} না্ঁম্বা্ঁর্ঁ মে্ঁম্বা্ঁর্ঁ\n\n {threadName}\n\n🥀 গ্রুঁপেঁরঁ পঁক্ষঁ থেঁকেঁ আঁপঁনাঁকেঁ স্বাঁগঁতঁমঁ♥\n\n🥰🥀ᏔᎬᏞᏟϴᎷᎬ 🥀🥰 \n    ┌────♣─────┐\n        ♦ 𝐒𝐔𝐉𝐎𝐍 ♦\n    └────♣─────┘\n\n⋆✦⎯⎯⎯⎯⎯⎯⎯⎯✦⋆\n𝐂𝐑𝐄𝐀𝐓𝐎𝐑 ➢ 𝐒𝐔𝐉𝐎𝐍-𝐁𝐎𝐒𝐒" : msg = threadData.customJoin;
      msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{type}/g, (memLength.length > 1) ?  'You' : 'Friend')
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

      if (existsSync(path)) mkdirSync(path, { recursive: true });

      const randomPath = readdirSync(join(__dirname, "SUJON", "font"));

      if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
      else if (randomPath.length != 0) {
        const pathRandom = join(__dirname, "SUJON", "font", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
        formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
      }
      else formPush = { body: msg, mentions }

      return api.sendMessage(formPush, threadID);
    } catch (e) { return console.log(e) };
  }
        }
