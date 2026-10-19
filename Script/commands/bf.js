module.exports.config = {
  name: "bf",
  version: "2.0.3",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Couple banner",
  commandCategory: "banner",
  usages: "[@mention | reply]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function ({ event, api }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const { threadID, messageID, senderID, mentions, messageReply } = event;

  let targetID =
    messageReply?.senderID ||
    (mentions && Object.keys(mentions)[0]);

  if (!targetID)
    return api.sendMessage(
      "किसी को reply करें या mention करें......\n" +
      "Please reply or mention someone......",
      threadID,
      messageID
    );

  try {
    const apiList = await axios.get(
      "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json"
    );

    const AVATAR_CANVAS_API = apiList.data.AvatarCanvas;
    if (!AVATAR_CANVAS_API) throw true;

    const res = await axios.post(
      `${AVATAR_CANVAS_API}/api`,
      { cmd: "gf", senderID, targetID },
      { responseType: "arraybuffer", timeout: 30000 }
    );

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgPath = path.join(
      cacheDir,
      `gf_${senderID}_${targetID}.png`
    );

    fs.writeFileSync(imgPath, res.data);

    // ---------- Captions (Hindi + English) ----------
    const CAPTIONS = [
      "~ देख, अपने बॉयफ्रेंड को दूसरी लड़कियों की तरफ देखना मत\n" +
      "~ Hey, don't let your boyfriend look at other girls",

      "~ तेरे बॉयफ्रेंड का ध्यान रखना, वरना कोई और ले जाएगी\n" +
      "~ Take care of your boyfriend, or someone else will take him",

      "~ ये तेरा बॉयफ्रेंड है, इसे संभाल कर रखना\n" +
      "~ This is your boyfriend, keep him safe",

      "~ प्यार में पागल हो जाओ,\n" +
      "~ पर अपने बॉयफ्रेंड को पागल मत बनने दो\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "~ Go crazy in love,\n" +
      "~ But don't let your boyfriend go crazy",

      "~ तेरा बॉयफ्रेंड सिर्फ तेरा है,\n" +
      "~ किसी और को देखा तो मुँह तोड़ दूँगा\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "~ Your boyfriend is only yours,\n" +
      "~ If he looks at someone else, I'll break his face",

      "~ प्रेम में पड़ना अच्छी बात है,\n" +
      "~ पर अपने बॉयफ्रेंड को काबू में रखना\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "~ Falling in love is good,\n" +
      "~ But keep your boyfriend under control"
    ];

    const caption =
      CAPTIONS[Math.floor(Math.random() * CAPTIONS.length)];

    return api.sendMessage(
      {
        body: caption,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        try {
          fs.unlinkSync(imgPath);
        } catch (_) {}
      },
      messageID
    );

  } catch (e) {
    return api.sendMessage(
      "GF API Error | SAHU-API unreachable\n" +
      "API Error, Boss Rishikesh को call करें",
      threadID,
      messageID
    );
  }
};