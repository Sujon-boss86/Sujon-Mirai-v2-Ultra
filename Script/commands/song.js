const axios = require("axios");
const fs = require("fs");
const yts = require("yt-search");

// 🔗 aryannix API source
const API_LIST =
  "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

// 🔗 Load base API
async function getBaseAPI() {
  const res = await axios.get(API_LIST);
  return res.data.api;
}

module.exports.config = {
  name: "song",
  version: "3.1.0",
  aliases: ["music", "play"],
  credits: "bela + aryannix",
  countDown: 5,
  hasPermssion: 0,
  description: "Download audio/video from YouTube",
  commandCategory: "media",
  usages: "{pn} <song name | youtube link>",
  usePrefix: true
};

// ▶ Command start
module.exports.run = async ({ api, args, event }) => {
  if (!args[0])
    return api.sendMessage(
      "❌ Please provide song name or YouTube link",
      event.threadID,
      event.messageID
    );

  const query = args.join(" ");

  // ▶ If link → ask format
  if (query.startsWith("http")) {
    return api.sendMessage(
      "Reply with:\n1️⃣ Audio (mp3)\n2️⃣ Video (mp4)",
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          url: query
        });
      },
      event.messageID
    );
  }

  // ▶ Search
  const search = await yts(query);
  const results = search.videos.slice(0, 6);

  if (!results.length)
    return api.sendMessage(
      "⭕ No results found.",
      event.threadID,
      event.messageID
    );

  let msg = "";
  const thumbs = [];

  results.forEach((v, i) => {
    msg += `${i + 1}. ${v.title}\n⏱ ${v.timestamp}\n📺 ${v.author.name}\n\n`;
    thumbs.push(belaSt(v.thumbnail, "thumb.jpg"));
  });

  api.sendMessage(
    {
      body: msg + "➡ Reply with a number",
      attachment: await Promise.all(thumbs)
    },
    event.threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: event.senderID,
        results
      });
    },
    event.messageID
  );
};

// ▶ Handle Reply
module.exports.handleReply = async ({ api, event, handleReply }) => {
  try {
    const baseAPI = await getBaseAPI();

    // ▶ Direct link
    if (handleReply.url) {
      const type = event.body == "2" ? "video" : "audio";

      const res = await axios.get(`${baseAPI}/ytdl`, {
        params: { url: handleReply.url, type }
      });

      if (!res.data.status) throw new Error("Download failed");

      await api.unsendMessage(handleReply.messageID);

      const file = type === "video" ? "video.mp4" : "audio.mp3";

      return api.sendMessage(
        {
          body: `🎵 ${res.data.title}`,
          attachment: await bela(res.data.downloadUrl, file)
        },
        event.threadID,
        () => fs.unlinkSync(file),
        event.messageID
      );
    }

    // ▶ Search choice
    const index = parseInt(event.body);
    if (isNaN(index)) return;

    const video = handleReply.results[index - 1];
    if (!video) return;

    const res = await axios.get(`${baseAPI}/ytdl`, {
      params: { url: video.url, type: "audio" }
    });

    await api.unsendMessage(handleReply.messageID);

    return api.sendMessage(
      {
        body: `🎵 ${res.data.title}`,
        attachment: await bela(res.data.downloadUrl, "audio.mp3")
      },
      event.threadID,
      () => fs.unlinkSync("audio.mp3"),
      event.messageID
    );
  } catch (e) {
    api.sendMessage(
      "❌ Error downloading media.",
      event.threadID,
      event.messageID
    );
  }
};

// 📥 Download helper
async function bela(url, file) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(file, Buffer.from(res.data));
  return fs.createReadStream(file);
}

// 🖼 Thumbnail helper
async function belaSt(url, name) {
  const res = await axios.get(url, { responseType: "stream" });
  res.data.path = name;
  return res.data;
}