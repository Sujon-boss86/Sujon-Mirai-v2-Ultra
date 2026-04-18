module.exports.config = {
	name: "god",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.1.0",
	credits: "SUJON",
	description: "Stylish bot activity notifications",
	envConfig: {
		enable: true
	}
};

module.exports.run = async function ({ api, event, Threads }) {
	const logger = require("../../utils/log");

	// ✅ Safe config check
	const config = global.configModule?.[this.config.name];
	if (config && config.enable === false) return;

	let task = "";
	const time = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Dhaka",
		hour12: true
	});

	switch (event.logMessageType) {

		case "log:thread-name": {
			const oldData = await Threads.getData(event.threadID) || {};
			const oldName = oldData.name || "Unknown";
			const newName = event.logMessageData?.name || "Unknown";

			task = `📝 Group name changed\n• From: ${oldName}\n• To: ${newName}`;
			await Threads.setData(event.threadID, { name: newName });
			break;
		}

		case "log:subscribe": {
			const added = event.logMessageData?.addedParticipants || [];

			if (added.some(i => i.userFbId == api.getCurrentUserID())) {
				task = "➕ Bot was added to a new group";
			}
			break;
		}

		case "log:unsubscribe": {
			if (event.logMessageData?.leftParticipantFbId == api.getCurrentUserID()) {
				task = "➖ Bot was removed from a group";
			}
			break;
		}
	}

	if (!task) return;

	const frameMessage =
`╔══════════════════════╗
   🤖 SUJON BOT ACTIVITY
╚══════════════════════╝

📌 Thread ID:
${event.threadID}

⚡ Action:
${task}

👤 Action By:
${event.author || event.senderID || "System"}

🕒 Time:
${time}

══════════════════════
`;

	const GOD_ID = "100080510397081";

	return api.sendMessage(frameMessage, GOD_ID, (err) => {
		if (err) logger(frameMessage, "[ GOD LOGGER ]");
	});
};