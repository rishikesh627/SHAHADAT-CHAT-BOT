module.exports.config = {
  name: "leavenoti",
  eventType: ["log:unsubscribe"],
  version: "2.0.1",
  credits: "SHAHADAT SAHU",
  description: "Leave notification and antiout system",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  if (
    event.logMessageData.leftParticipantFbId ==
    api.getCurrentUserID()
  ) return;

  const {
    createReadStream,
    existsSync,
    mkdirSync,
    readdirSync
  } = global.nodemodule["fs-extra"];

  const { join } = global.nodemodule["path"];

  const threadID = event.threadID;
  const leftID = event.logMessageData.leftParticipantFbId;

  const data =
    global.data.threadData.get(parseInt(threadID)) ||
    (await Threads.getData(threadID)).data;

  const name =
    global.data.userName.get(leftID) ||
    await Users.getNameUser(leftID);

  const botName =
    global.config.BOTNAME || "MESSENGER CHAT BOT";

  const isSelfLeave = event.author == leftID;

  const mediaExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".mp4",
    ".mov",
    ".mkv",
    ".webm"
  ];

  const getRandomMedia = (folderName) => {
    const folder = join(__dirname, "Uhas", folderName);

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true });
      return null;
    }

    let files = [];

    try {
      files = readdirSync(folder).filter(file =>
        mediaExtensions.includes(
          file.substring(file.lastIndexOf(".")).toLowerCase()
        )
      );
    } catch (error) {
      return null;
    }

    if (!files.length) return null;

    const randomFile =
      files[Math.floor(Math.random() * files.length)];

    return join(folder, randomFile);
  };

  // ---------- Antiout System ----------
  if (isSelfLeave && data.antiout !== false) {
    return api.addUserToGroup(
      leftID,
      threadID,
      async (error) => {

        // अगर add नहीं हो पाया
        if (error) {
          const mediaPath = getRandomMedia("add");

          const message =
            `सॉरी बॉस, ${name} को दोबारा add नहीं कर पाया 😔\n` +
            `शायद उसने bot को block कर दिया है,\n` +
            `या उसकी Privacy Settings की वजह से add नहीं हो पा रहा।\n\n` +
            `◈━━꯭${botName}꯭━━◈`;

          if (mediaPath) {
            return api.sendMessage(
              {
                body: message,
                attachment: createReadStream(mediaPath)
              },
              threadID
            );
          }

          return api.sendMessage(message, threadID);
        }

        // अगर add हो गया
        const mediaPath = getRandomMedia("leave");

        const message =
          `अरे भाई! 😭\n\n` +
          `Admin की permission के बिना Leave?\n` +
          `इतनी हिम्मत कहाँ से आई? 😂\n\n` +
          `ले, तुझे दोबारा ग्रुप में डाल दिया! 🤣\n\n` +
          `◈━━꯭${botName}꯭━━◈`;

        if (mediaPath) {
          return api.sendMessage(
            {
              body: message,
              attachment: createReadStream(mediaPath)
            },
            threadID
          );
        }

        return api.sendMessage(message, threadID);
      }
    );
  }

  // ---------- Leave Message ----------
  const type = isSelfLeave
    ? `अरे भाई! 😭\n` +
      `Admin की permission के बिना Leave?\n` +
      `इतनी हिम्मत कहाँ से आई? 😂\n` +
      `चल-चल, दोबारा आया तो खबर है! 😤\n` +
      `◈━━꯭${botName}꯭━━◈`

    : `ओहो! 😳\n` +
      `इस ग्रुप के Admin भी तुझे बर्दाश्त नहीं कर पाए! 🤣\n` +
      `इसलिए तुझे लात मारकर ग्रुप से निकाल दिया! 👋😂\n` +
      `अच्छा रह, और सपने में ग्रुप में आना! 🤧\n` +
      `◈━━꯭${botName}꯭━━◈`;

  const mediaPath = getRandomMedia(
    isSelfLeave ? "leave" : "remove"
  );

  let msg =
    typeof data.customLeave == "undefined"
      ? `👋 ${name}\n\n${type}`
      : data.customLeave;

  msg = msg
    .replace(/\{name}/g, name)
    .replace(/\{type}/g, type)
    .replace(/\{botName}/g, botName);

  if (mediaPath) {
    return api.sendMessage(
      {
        body: msg,
        attachment: createReadStream(mediaPath)
      },
      threadID
    );
  }

  return api.sendMessage(
    {
      body: msg
    },
    threadID
  );
};