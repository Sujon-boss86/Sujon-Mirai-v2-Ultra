const axios = require('axios');
const yts = require("yt-search");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
    );
    return base.data.api;
};

(async () => {
    global.apis = {
        diptoApi: await baseApiUrl()
    };
})();

async function getStreamFromURL(url, pathName) {
    try {
        const response = await axios.get(url, {
            responseType: "stream"
        });
        response.data.path = pathName;
        return response.data;
    } catch (err) {
        throw err;
    }
}

global.utils = {
    ...global.utils,
    getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

function getVideoID(url) {
    const checkurl = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const match = url.match(checkurl);
    return match ? match[1] : null;
}

const config = {
    name: "music",
    author: "SUJON-BOSS",
    credits: "SUJON-BOSS",
    version: "1.2.0",
    role: 0,
    hasPermssion: 0,
    description: "YouTube Music Downloader",
    usePrefix: true,
    prfix: true,
    category: "media",
    commandCategory: "media",
    cooldowns: 5,
    countDown: 5,
};

async function onStart({ api, args, event }) {
    try {
        let videoID;
        const url = args[0];
        let w;

        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            videoID = getVideoID(url);
            if (!videoID) {
                return api.sendMessage("❌ Invalid YouTube URL.", event.threadID, event.messageID);
            }
        } else {
            const songName = args.join(' ');
            w = await api.sendMessage(`🔎 Searching song "${songName}"...`, event.threadID);

            const r = await yts(songName);
            const videos = r.videos.slice(0, 50);
            const videoData = videos[Math.floor(Math.random() * videos.length)];

            videoID = videoData.videoId;
        }

        const { data: { title, quality, downloadLink } } = await axios.get(
            `${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp3`
        );

        if (w) api.unsendMessage(w.messageID);

        const shortenedLink = (await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`
        )).data;

        await api.sendMessage({
            body:
`🎵 𝙼𝚄𝚂𝙸𝙲 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳

🔖 Title: ${title}
✨ Quality: ${quality}

📥 Download Link:
${shortenedLink}

👑 Powered By: SUJON-BOSS`,
            attachment: await global.utils.getStreamFromURL(downloadLink, title + '.mp3')
        }, event.threadID, event.messageID);

    } catch (e) {
        api.sendMessage("❌ Error: " + (e.message || "Something went wrong"), event.threadID, event.messageID);
    }
}

module.exports = {
    config,
    onStart,
    run: onStart
};