const fs = require("fs-extra");

module.exports.config = {
  name: "file",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "SUJON",
  description: "Delete the file or folder in the commands folder",
  commandCategory: "Admin",
  usages: "\nfile start <text>\nfile ext <text>\nfile <text>\nfile [leave blank]\nfile help",
  cooldowns: 5
};

module.exports.handleReply = ({ api, event, handleReply }) => {
  if (event.senderID != handleReply.author) return;

  const filesys = require("fs-extra");
  const numbers = event.body.split(" ").map(n => parseInt(n));
  let deleted = "";

  for (let num of numbers) {
    const file = handleReply.files[num - 1];
    if (!file) continue;

    const filePath = __dirname + "/" + file;
    const stat = filesys.statSync(filePath);

    if (stat.isDirectory()) {
      filesys.removeSync(filePath);
      deleted += `[Folder🗂️] ${file}\n`;
    } else {
      filesys.unlinkSync(filePath);
      deleted += `[File📄] ${file}\n`;
    }
  }

  api.sendMessage("⚡️Deleted the following:\n\n" + deleted, event.threadID, event.messageID);
};

module.exports.run = async function ({ api, event, args }) {
  const filesys = require("fs-extra");
  let allFiles = filesys.readdirSync(__dirname + "/") || [];
  let showFiles = [...allFiles]; // copy for filtering

  let msg = "";
  let header = "";

  // -------- HELP ---------
  if (args[0] == "help") {
    msg = "\nHow to use:\n" +
      "• file start <text> → show files starting with <text>\n" +
      "• file ext <text> → show files ending with <text>\n" +
      "• file <text> → show files containing <text>\n" +
      "• file → show all files\n" +
      "• file help → this guide";
    return api.sendMessage(msg, event.threadID, event.messageID);
  }

  // -------- FILTERS ---------
  if (args[0] == "start" && args[1]) {
    const key = args.slice(1).join(" ");
    showFiles = allFiles.filter(f => f.startsWith(key));
    header = `⚡️Found ${showFiles.length} file(s) starting with: ${key}`;
  } else if (args[0] == "ext" && args[1]) {
    const key = args[1];
    showFiles = allFiles.filter(f => f.endsWith(key));
    header = `⚡️Found ${showFiles.length} file(s) ending with: ${key}`;
  } else if (args.length > 0) {
    const key = args.join(" ");
    showFiles = allFiles.filter(f => f.includes(key));
    header = `⚡️Found ${showFiles.length} file(s) containing: ${key}`;
  } else {
    header = `⚡️All ${allFiles.length} file(s) in commands folder:`;
  }

  if (showFiles.length === 0) {
    return api.sendMessage("⚡️No matching files found.", event.threadID, event.messageID);
  }

  let i = 1;
  for (const file of showFiles) {
    const stat = filesys.statSync(__dirname + "/" + file);
    const type = stat.isDirectory() ? "[Folder🗂️]" : "[File📄]";
    msg += `${i++}. ${type} ${file}\n`;
  }

  api.sendMessage(
    "⚡️Reply with number(s) to delete. (Multiple allowed, separated by space)\n\n" + header + "\n\n" + msg,
    event.threadID,
    (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          files: showFiles
        });
      }
    }
  );
};