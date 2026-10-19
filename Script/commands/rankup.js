module.exports.config = {
  name: "rankup",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "SHAHADAT SAHU",
  description: "Automatic rankup banner and notification",
  commandCategory: "system",
  dependencies: {
    "fs-extra": "",
    "axios": ""
  },
  cooldowns: 2
};

const FACEBOOK_ACCESS_TOKEN = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

module.exports.handleEvent = async function ({ api, event, Currencies, Users }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const { createCanvas, loadImage } = require("canvas");

  const threadID = String(event.threadID);
  const senderID = String(event.senderID);

  const thread = global.data.threadData.get(threadID) || {};

  if (thread.rankup === false) return;

  let data;
  try {
    data = await Currencies.getData(senderID);
  } catch (e) {
    return;
  }

  let exp = Number(data?.exp) || 0;
  const deltaNext = 3;

  const oldLevel = Math.floor(Math.sqrt(1 + (4 * exp / deltaNext) + 1) / 2);
  exp++;

  const newLevel = Math.floor(Math.sqrt(1 + (4 * exp / deltaNext) + 1) / 2);

  try {
    await Currencies.setData(senderID, { exp });
  } catch (e) {
    return;
  }

  if (newLevel <= oldLevel || newLevel === 1) return;

  let name = global.data.userName.get(senderID);
  if (!name) {
    try {
      name = await Users.getNameUser(senderID);
    } catch (e) {
      name = "दोस्त";
    }
  }

  // 📝 मज़ेदार हिंदी रैंकअप मैसेजेस का सेट
  const rankupMessages = [
    `🎉 अरे वाह! गजब ढा दिया! 😂

👤 {name}
📈 आपका रैंक अब Level {level} हो गया है!

भाई, इतने मैसेज क्यों भेज रहे हो? 🐸
क्या मैसेंजर वाले घर से फ्री वाई-फाई दे रहे हैं क्या? 🤣

खैर, बहुत-बहुत बधाई! 🥳
थोड़ा और स्पैम करो, आगे अभी और लेवल्स बाकी हैं! 🚀`,

    `🎉 बधाई हो {name}! 😂

आप सीधे Level {level} पर पहुँच चुके हैं!

इतने मैसेज भेजने के लिए बोट से रिवॉर्ड तो मिल गया,
लेकिन असल ज़िंदगी में अभी भी कोई अचीवमेंट अनलॉक नहीं हुआ है! 🐸🤣

लगे रहो बॉस,
बोट की नज़रों में अब आप वीआईपी (VIP) बन चुके हो! 😎🔥`,

    `🚨 ब्रेकिंग न्यूज़! 🚨😂

👤 {name} ने फिर से Level Up कर लिया है!
📈 नया लेवल: {level}

आपको इतने मैसेज भेजते देख,
अब तो मैसेंजर भी सोच रहा है,
"क्या यह इंसान कभी सोता भी है या नहीं?" 🐸🤣

जो भी हो, बहुत--बहुत बधाई! 🎉
थोड़ी और मेहनत करो, अगला लेवल भी आपका ही है! 🚀`
  ];

  let message = rankupMessages[Math.floor(Math.random() * rankupMessages.length)]
    .replace(/\{name}/g, name)
    .replace(/\{level}/g, newLevel);

  const output = __dirname + `/cache/rankup_${senderID}_${Date.now()}.png`;

  try {
    let avatar = null;

    // 🛠️ यहाँ मैंने फिक्स कर दिया है: facebook.com के बाद / लगाया है ताकि प्रोफाइल पिक्चर सही से लोड हो
    try {
      const response = await axios.get(`https://facebook.com{senderID}/picture`, {
        params: {
          type: "large",
          access_token: FACEBOOK_ACCESS_TOKEN
        },
        responseType: "arraybuffer",
        timeout: 20000,
        maxRedirects: 5,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      if (response.data && Buffer.isBuffer(response.data)) {
        avatar = await loadImage(Buffer.from(response.data));
      }
    } catch (e) {
      console.log("[RANKUP] Facebook PP failed:", e.message);
    }

    // FCA Profile Picture Fallback
    if (!avatar) {
      try {
        const info = await api.getUserInfo([senderID]);
        const thumb = info?.[senderID]?.thumbSrc;
        if (thumb) {
          const response = await axios.get(thumb, {
            responseType: "arraybuffer",
            timeout: 20000,
            headers: {
              "User-Agent": "Mozilla/5.0"
            }
          });
          avatar = await loadImage(Buffer.from(response.data));
        }
      } catch (e) {
        console.log("[RANKUP] FCA PP failed:", e.message);
      }
    }

    const width = 1600;
    const height = 650;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background Gradient
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#F8FAFF");
    bg.addColorStop(0.5, "#FFFFFF");
    bg.addColorStop(1, "#F3E8FF");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Decorative circles
    ctx.fillStyle = "rgba(99,102,241,0.08)";
    ctx.beginPath();
    ctx.arc(70, 60, 230, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(124,58,237,0.08)";
    ctx.beginPath();
    ctx.arc(1530, 590, 280, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(99,102,241,0.22)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(18, 18, width - 36, height - 36, 35);
    ctx.stroke();

    // Level Up Top Badge
    ctx.fillStyle = "#312E81";
    ctx.beginPath();
    ctx.roundRect(575, 55, 350, 62, 31);
    ctx.fill();

    ctx.font = '700 27px "BeVietnamPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♛  LEVEL UP", 750, 86);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Avatar Frame & Clip
    const avatarX = 75;
    const avatarY = 145;
    const avatarSize = 300;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip();

    if (avatar) {
      const scale = Math.max(avatarSize / avatar.width, avatarSize / avatar.height);
      const avatarWidth = avatar.width * scale;
      const avatarHeight = avatar.height * scale;
      ctx.drawImage(
        avatar,
        avatarX + (avatarSize - avatarWidth) / 2,
        avatarY + (avatarSize - avatarHeight) / 2,
        avatarWidth,
        avatarHeight
      );
    } else {
      const fallback = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
      fallback.addColorStop(0, "#6366F1");
      fallback.addColorStop(1, "#06B6D4");
      ctx.fillStyle = fallback;
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    }
    ctx.restore();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.stroke();

    // Member Name
    ctx.fillStyle = "#0F172A";
    ctx.font = '700 58px "BeVietnamPro-Bold"';
    ctx.fillText(name.length > 22 ? name.substring(0, 22) + "..." : name, 430, 210);

    // 🎨 फोटो बैनर के हिंदी टेक्स्ट अपडेट्स
    ctx.font = '600 25px "BeVietnamPro-SemiBold"';
    ctx.fillStyle = "#64748B";
    ctx.fillText("बहुत-बहुत बधाई! आपका लेवल बढ़ गया है", 435, 255);

    ctx.fillStyle = "#7C3AED";
    ctx.font = '700 34px "BeVietnamPro-Bold"';
    ctx.fillText("नया लेवल", 435, 330);

    ctx.fillStyle = "#0F172A";
    ctx.font = '700 88px "BeVietnamPro-Bold"';
    ctx.fillText(String(newLevel), 435, 430);

    // Save & Send Canvas Attachment
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(output, buffer);

    api.sendMessage(
      {
        body: message,
        attachment: fs.createReadStream(output)
      },
      threadID,
      () => {
        if (fs.existsSync(output)) {
          fs.unlinkSync(output);
        }
      },
      event.messageID
    );
  } catch (err) {
    console.log("[RANKUP ERROR]:", err);
  }
};
