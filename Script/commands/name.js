const { createCanvas, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "name",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CYBER BOT TEAM",
  description: "Stylish floral name logo generator",
  commandCategory: "design",
  usages: "[name | @mention]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, Users }) => {
  const { threadID, senderID, mentions } = event;

  let text = args.join(" ");
  if (!text && Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ Please provide a name or mention 1 person.", threadID);
  }

  if (!text && Object.keys(mentions).length > 0) {
    const id = Object.keys(mentions)[0];
    text = await Users.getNameUser(id);
  }

  // font (you will replace later)
  const fontPath = path.join(__dirname, "..", "assets", "fonts", "custom.ttf");
  registerFont(fontPath, { family: "CustomFont" });

  const width = 1080;
  const height = 1080;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // gradient text
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#ff5f6d");
  gradient.addColorStop(0.3, "#ffc371");
  gradient.addColorStop(0.6, "#00f2fe");
  gradient.addColorStop(1, "#4facfe");

  ctx.fillStyle = gradient;
  ctx.font = "120px CustomFont";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // main name
  ctx.fillText(text, width / 2, height / 2);

  // decorative vines (left)
  ctx.strokeStyle = "#6bff95";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(150, height / 2);
  ctx.bezierCurveTo(50, height / 2 - 150, 50, height / 2 + 150, 150, height / 2);
  ctx.stroke();

  // decorative vines (right)
  ctx.beginPath();
  ctx.moveTo(width - 150, height / 2);
  ctx.bezierCurveTo(width - 50, height / 2 - 150, width - 50, height / 2 + 150, width - 150, height / 2);
  ctx.stroke();

  // hanging hearts
  ctx.fillStyle = "#ff6fb1";
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(width / 2 + i * 90, height / 2 + 160, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  // watermark
  ctx.font = "28px sans-serif";
  ctx.fillStyle = "#888888";
  ctx.fillText("CYBER BOT TEAM", width / 2, height - 60);

  const outPath = path.join(__dirname, "..", "assets", "cache", `name_${senderID}.png`);
  await fs.writeFile(outPath, canvas.toBuffer());

  return api.sendMessage(
    {
      body: "✨ Your stylish name is ready",
      attachment: fs.createReadStream(outPath)
    },
    threadID,
    () => fs.unlinkSync(outPath)
  );
};