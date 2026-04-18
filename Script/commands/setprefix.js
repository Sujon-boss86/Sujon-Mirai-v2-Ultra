module.exports.config = {
	name: "setprefix",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "SUJON",
	description: "Change group prefix",
	commandCategory: "Group",
	usages: "[prefix/reset]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"successChange": "Đã chuyển đổi prefix của nhóm thành: %1",
		"missingInput": "Phần prefix cần đặt không được để trống",
		"resetPrefix": "Đã reset prefix về mặc định: %1",
		"confirmChange": "Bạn có chắc bạn muốn đổi prefix của nhóm thành: %1"
	},
	"en": {
		"successChange": "Changed prefix into: %1",
		"missingInput": "Prefix cannot be blank",
		"resetPrefix": "Reset prefix to: %1",
		"confirmChange": "Are you sure you want to change prefix into: %1"
	}
};

module.exports.handleReaction = async function ({ api, event, Threads, handleReaction, getText }) {
	try {
		if (event.userID != handleReaction.author) return;

		const { threadID, messageID } = event;

		// 🔥 GET OLD DATA
		var threadData = await Threads.getData(String(threadID));
		var data = threadData.data || {};

		// 🔥 FIXED (small letter prefix)
		data["prefix"] = handleReaction.PREFIX;

		// 🔥 SAVE DB
		await Threads.setData(threadID, { data });

		// 🔥 UPDATE CACHE (IMPORTANT)
		global.data.threadData.set(String(threadID), data);

		api.unsendMessage(handleReaction.messageID);

		return api.sendMessage(
			getText("successChange", handleReaction.PREFIX),
			threadID,
			messageID
		);

	} catch (e) {
		console.log(e);
	}
};

module.exports.run = async ({ api, event, args, Threads, getText }) => {
	if (typeof args[0] == "undefined")
		return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);

	let prefix = args[0].trim();

	if (!prefix)
		return api.sendMessage(getText("missingInput"), event.threadID, event.messageID);

	// 🔄 RESET PREFIX
	if (prefix == "reset") {
		var threadData = await Threads.getData(event.threadID);
		var data = threadData.data || {};

		// 🔥 FIXED
		data["prefix"] = global.config.PREFIX;

		await Threads.setData(event.threadID, { data });
		global.data.threadData.set(String(event.threadID), data);

		return api.sendMessage(
			getText("resetPrefix", global.config.PREFIX),
			event.threadID,
			event.messageID
		);
	}

	// 🔐 CONFIRM CHANGE (REACTION SYSTEM)
	return api.sendMessage(
		getText("confirmChange", prefix),
		event.threadID,
		(error, info) => {
			global.client.handleReaction.push({
				name: "setprefix",
				messageID: info.messageID,
				author: event.senderID,
				PREFIX: prefix
			});
		}
	);
};