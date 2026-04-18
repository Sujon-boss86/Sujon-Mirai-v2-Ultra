const sendWaiting = true; // enable or disable sending "images in progress, please wait...";
const textWaiting = "Image initialization, please wait a moment";
const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsLink = 20;
const fontsInfo = 28;
const colorName = "#00FFFF";

module.exports.config = {
  name: "cardinfo-uid",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SUJON-BOSS",
  description: "Create a facebook user information card",
  commandCategory: "The group",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": "",
    "jimp": "",
  },
};

// Circle avatar
module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async function ({ api, event, args, Users }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const pathImg = __dirname + `/cache/1.png`;
  const pathAvata = __dirname + `/cache/2.png`;

  // UID input
  const uid = args.join(" ");
  if (!uid) return api.sendMessage("Please provide a UID", threadID, messageID);

  // Fetch user info
  let res;
  try {
    res = await api.getUserInfoV2(uid);
  } catch (e) {
    return api.sendMessage("Failed to fetch user info. Check UID.", threadID, messageID);
  }

  // Download avatar
  let getAvatarOne = await axios.get(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne.data)); // ✅ no utf-8
  const avataruser = await this.circle(pathAvata);

  // Download background
  let bg = await axios.get("https://i.imgur.com/tW6nSDm.png", { responseType: "arraybuffer" });
  fs.writeFileSync(pathImg, Buffer.from(bg.data)); // ✅ no utf-8

  // Download font if not exist
  if(!fs.existsSync(__dirname+fonts)) { 
    let getfont = await axios.get(downfonts, { responseType: "arraybuffer" });
    fs.writeFileSync(__dirname + fonts, Buffer.from(getfont.data)); // ✅ no utf-8
  }

  // Prepare canvas
  const baseImage = await loadImage(pathImg);
  const baseAvata = await loadImage(avataruser);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvata, 80, 73, 285, 285);

  // Default values
  const gender = res.gender == 'male' ? "Male" : res.gender == 'female' ? "Female" : "Not public";
  const birthday = res.birthday || "Not Found";
  const love = res.relationship_status || "Not Found";
  const location = res.location || "Not Found";
  const follow = res.follow || "Not Found";

  // Register font
  registerFont(__dirname + fonts, { family: "Play-Bold" });

  // Draw user info
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";
  ctx.fillText(`${res.name}`, 480, 172);
  ctx.fillText(`${gender}`, 550, 208);
  ctx.fillText(`${follow}`, 550, 244);
  ctx.fillText(`${love}`, 550, 281);
  ctx.fillText(`${birthday}`, 550, 320);
  ctx.fillText(`${location}`, 550, 357);
  ctx.fillText(`${uid}`, 550, 399);

  // Draw user link
  ctx.font = `${fontsLink}px Play-Bold`;
  ctx.fillStyle = "#0000FF";
  ctx.fillText(`${res.link}`, 180, 475);

  // Output final image
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvata);

  return api.sendMessage(
    { attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};