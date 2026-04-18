module.exports.config = {
  name: "helpall",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "SUJON",
  description: "FREE SET-UP MESSENGER",
  commandCategory: "system",
  usages: "[Name module]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
      "╭──────•◈•──────╮\n" +
      " | 𝗜𝘀𝗹𝗮𝗺𝗶𝗰𝗸 𝗰𝗵𝗮𝘁 𝗯𝗼𝘁\n" +
      " |●𝗡𝗮𝗺𝗲: •—» %1 «—•\n" +
      " |●𝗨𝘀𝗮𝗴𝗲: %3\n" +
      " |●𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: %2\n" +
      " |●𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: %4\n" +
      " |●𝗪𝗮𝗶𝘁𝗶𝗻𝗴 𝘁𝗶𝗺𝗲: %5 seconds\n" +
      " |●𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %6\n" +
      " |𝗠𝗼𝗱𝘂𝗹𝗲 𝗰𝗼𝗱𝗲 𝗯𝘆\n" +
      " |•—» Sujon «—•\n" +
      "╰──────•◈•──────╯",

    user: "User",
    adminGroup: "Admin group",
    adminBot: "Admin bot"
  }
};

module.exports.run = async function ({ api, event, args, getText }) {

  const axios = require("axios");
  const fs = require("fs-extra");

  const { commands } = global.client;
  const { threadID, messageID } = event;

  const threadData = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadData.PREFIX || global.config.PREFIX;

  // IMAGE
  const imgURL = "https://i.postimg.cc/JnzBCPst/20250330_234834.jpg";
  const imgPath = __dirname + "/cache/help.jpg";

  const res = await axios.get(imgURL, { responseType: "arraybuffer" });
  fs.writeFileSync(imgPath, Buffer.from(res.data));

  // ================= SHOW ALL =================

  if (!args[0] || args[0] == "all") {

    let text = "";
    for (const command of commands.values()) {
      text += `•—» ${command.config.name}\n`;
    }

    return api.sendMessage(
      {
        body:
`✿🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃✿

${text}

✿══════════════✿
│𝗨𝘀𝗲 ${prefix}helpall [Name]
│𝗡𝗔𝗠𝗘 𝗢𝗪𝗡𝗘𝗥 : Sujon
│𝗧𝗢𝗧𝗔𝗟 : ${commands.size}`,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  }

  // ================= MODULE INFO =================

  const cmd = commands.get((args[0] || "").toLowerCase());

  if (!cmd) {
    return api.sendMessage("❌ Module not found!", threadID, messageID);
  }

  const msg = getText(
    "moduleInfo",
    cmd.config.name,
    cmd.config.description,
    cmd.config.usages || "",
    cmd.config.commandCategory,
    cmd.config.cooldowns,
    cmd.config.hasPermssion == 0
      ? getText("user")
      : cmd.config.hasPermssion == 1
      ? getText("adminGroup")
      : getText("adminBot")
  );

  return api.sendMessage(
    {
      body: msg,
      attachment: fs.createReadStream(imgPath)
    },
    threadID,
    () => fs.unlinkSync(imgPath),
    messageID
  );
};