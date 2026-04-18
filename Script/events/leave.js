const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");

// ✅ Bangla Font Add (NEW)
Canvas.registerFont(__dirname + "/fonts/NotoSansBengali-Regular.ttf", {
	family: "Bangla"
});

module.exports.config = {
	name: "antioutNotify",
	eventType: ["log:unsubscribe"],
	version: "2.1.1",
	credits: "SUJON",
	description: "Send goodbye image with name replacing frame text"
};

module.exports.run = async ({ event, api }) => {
	const userID = event.logMessageData.leftParticipantFbId;
	const author = event.author;
	const threadID = event.threadID;

	if (userID == api.getCurrentUserID()) return;

	try {
		// 1️⃣ Get user name
		const resUser = await api.getUserInfo(userID);
		const userName = resUser[userID]?.name || "Unknown User";

		// 2️⃣ Get profile picture
		const profilePicURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
		const profileBuffer = (await axios.get(profilePicURL, { responseType: "arraybuffer" })).data;

		// 3️⃣ Get frame image
		const frameURL = "https://i.postimg.cc/KzJwdPkM/20260325-023613.png";
		const frameBuffer = (await axios.get(frameURL, { responseType: "arraybuffer" })).data;

		// 4️⃣ Setup Canvas
		const base = await Canvas.loadImage(frameBuffer);
		const avatar = await Canvas.loadImage(profileBuffer);
		const canvas = Canvas.createCanvas(base.width, base.height);
		const ctx = canvas.getContext("2d");

		// 🔥 Avatar আগে draw হবে (নিচে থাকবে)
		const pX = 190;
		const pY = 107;
		const pSize = 230;

		ctx.save();
		ctx.beginPath();
		ctx.arc(pX + pSize / 2, pY + pSize / 2, pSize / 2, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(avatar, pX, pY, pSize, pSize);
		ctx.restore();

		// 🔥 Frame পরে draw হবে (উপরে থাকবে)
		ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

		// Position control variables
		let posX = 195; // left-right control
		let posY = 380; // up-down control

		// Control functions (optional)
		const moveLeft = () => posX -= 20;
		const moveRight = () => posX += 20;
		const moveUp = () => posY -= 20;
		const moveDown = () => posY += 20;

		// 6️⃣ Add user name (✅ Bangla Support)
		ctx.font = "bold 36px Bangla";
		ctx.fillStyle = "#000000";
		ctx.textAlign = "left";
		ctx.fillText(userName.normalize("NFC"), posX, posY);

		// 7️⃣ Save and send
		const imgPath = __dirname + `/cache/goodbye_${userID}.png`;
		fs.writeFileSync(imgPath, canvas.toBuffer());

		api.sendMessage({
			body: `👋 Goodbye, ${userName}!`,
			attachment: fs.createReadStream(imgPath)
		}, threadID, () => fs.unlinkSync(imgPath));

	} catch (err) {
		console.error(err);
		api.sendMessage("❌ Error creating goodbye image.", threadID);
	}
};