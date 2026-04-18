module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0",
  credits: "FIXED",
  description: "Detect bot added to group"
};

module.exports.run = async function({ api, event }) {
  const { logMessageData, threadID } = event;

  // bot added check
  if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {

    const threadInfo = await api.getThreadInfo(threadID);

    if (!global.pendingList) global.pendingList = [];

    // already exist check
    if (global.pendingList.some(g => g.threadID == threadID)) return;

    global.pendingList.push({
      threadID,
      name: threadInfo.threadName || "Unnamed Group"
    });

    // notify admin
    const adminID = global.config.ADMINBOT[0];

    api.sendMessage(
      `📥 New group added to pending:\n${threadInfo.threadName}\nID: ${threadID}`,
      adminID
    );

    // notify group
    api.sendMessage(
      "⏳ This group is pending approval.\nAdmin will approve soon.",
      threadID
    );
  }
};