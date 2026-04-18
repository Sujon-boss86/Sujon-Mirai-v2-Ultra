const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/cyber-ullash/cyber-ullash/refs/heads/main/UllashApi.json"
  );
  return base.data.api;
};

module.exports.config = {
  name: "sing",
  version: "3.0.0",
  aliases: ["video", "play"],
  credits: "SUJON + ullash",
  countDown: 5,
  hasPermssion: 0,
  description: "Download YouTube video (MP4 only)",
  commandCategory: "media",
  usages:
    "{pn} <song name | youtube link>\nExample:\n{pn} chipi chipi chapa chapa",
};

module.exports.run = async ({ api, args, event }) => {
  const checkurl =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;

  if (!args[0]) {
    return api.sendMessage(
      "❌ Please provide a YouTube link or search keyword.",
      event.threadID,
      event.messageID
    );
  }

  const isUrl = checkurl.test(args[0]);

  // ================= VIDEO FROM URL =================
  if (isUrl) {
    try {
      const match = args[0].match(checkurl);
      const videoID = match ? match[1] : null;

      const { data } = await axios.get(
        `${await baseApiUrl()}/ytDl3?link=${videoID}&format=mp4`
      );

      return api.sendMessage(
        {
          body: `🎬 ${data.title}\n📽 Quality: ${data.quality}`,
          attachment: await dipto(data.downloadLink, "video.mp4"),
        },
        event.threadID,
        () => fs.unlinkSync("video.mp4"),
        event.messageID
      );
    } catch (err) {
      return api.sendMessage(
        "❌ Video download failed.",
        event.threadID,
        event.messageID
      );
    }
  }

  // ================= SEARCH VIDEO =================
  const keyword = args.join(" ");
  let results;

  try {
    results = (
      await axios.get(
        `${await baseApiUrl()}/ytFullSearch?songName=${encodeURIComponent(
          keyword
        )}`
      )
    ).data.slice(0, 6);
  } catch (err) {
    return api.sendMessage(
      "❌ Search failed.",
      event.threadID,
      event.messageID
    );
  }

  if (!results || results.length === 0) {
    return api.sendMessage(
      "⭕ No results found.",
      event.threadID,
      event.messageID
    );
  }

  let msg = "🎬 Search Results:\n\n";
  let i = 1;
  const thumbs = [];

  for (const info of results) {
    msg += `${i++}. ${info.title}\n⏱ ${info.time}\n📺 ${
      info.channel.name
    }\n\n`;
    thumbs.push(diptoSt(info.thumbnail, "thumb.jpg"));
  }

  api.sendMessage(
    {
      body: msg + "Reply with number (1-6) to download video",
      attachment: await Promise.all(thumbs),
    },
    event.threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        result: results,
      });
    },
    event.messageID
  );
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  try {
    const choice = parseInt(event.body);
    if (
      isNaN(choice) ||
      choice < 1 ||
      choice > handleReply.result.length
    ) {
      return api.sendMessage(
        "❌ Invalid choice.",
        event.threadID,
        event.messageID
      );
    }

    const video = handleReply.result[choice - 1];

    const { data } = await axios.get(
      `${await baseApiUrl()}/ytDl3?link=${video.id}&format=mp4`
    );

    await api.unsendMessage(handleReply.messageID);

    await api.sendMessage(
      {
        body: `╭🌸🌿🦋🌿🌸╮
🎵 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲 ✅
🎧 𝗣𝗿𝗲𝘀𝗲𝗻𝘁𝗲𝗱 𝗯𝘆: ✪𝙎𝙐𝙅𝙊𝙉-𝘽𝙊𝙎𝙎✪
🎬 𝗘𝗻𝗷𝗼𝘆 𝗬𝗼𝘂𝗿 𝗩𝗶𝗱𝗲𝗼 💜
╰🌸🌿🦋🌿🌸╯🎬 ${data.title}\n📽 Quality: ${data.quality}`,
        attachment: await dipto(data.downloadLink, "video.mp4"),
      },
      event.threadID,
      () => fs.unlinkSync("video.mp4"),
      event.messageID
    );
  } catch (err) {
    api.sendMessage(
      "⭕ Video size too large or failed.",
      event.threadID,
      event.messageID
    );
  }
};

// ================= HELPERS =================
async function dipto(url, pathName) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(pathName, Buffer.from(res.data));
  return fs.createReadStream(pathName);
}

async function diptoSt(url, pathName) {
  const res = await axios.get(url, { responseType: "stream" });
  res.data.path = pathName;
  return res.data;
}