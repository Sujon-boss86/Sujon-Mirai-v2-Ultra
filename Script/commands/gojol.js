const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "gojol",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "CYBER-SUJON",
  description: "Send Gojol when emoji matched (no prefix)",
  commandCategory: "no prefix",
  usages: "Just send an emoji 🕌",
  cooldowns: 5,
  usePrefix: false
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, senderID } = event;
  if (!body || body.length > 3) return;

  const emoji = body.trim();

  const gojolList = {
    "🕌": "https://drive.google.com/uc?id=1yHB48N_wPJnU5uV18KMZOLNqo5NE7L4W",
    "🌙": "https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
    "📿": "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
    "🕋": "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
    "✨": "https://drive.google.com/uc?id=1xpwuubDL_ebjKJhujb-Ee-FikUF92oF6"
  };

  if (!(emoji in gojolList)) return;

  const filePath = __dirname + `/cache/gojol_${senderID}.mp3`;
  const url = gojolList[emoji];

  request(encodeURI(url))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage({
        body: `📿 গজল পাঠানো হলো [${emoji}]`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath));
    });
};

module.exports.run = () => {};


