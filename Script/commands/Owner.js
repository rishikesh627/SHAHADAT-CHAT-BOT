const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "owner",
  aliases: ["ownerinfo", "owners"],
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Show Owner Info with photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

  const info = `
👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢

👤 𝗡𝗮𝗺𝗲: 𝗥𝗜𝗦𝗛𝗜𝗞𝗘𝗦𝗛 𝗔𝗡𝗔𝗡𝗗
🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲: 𝗥𝗜𝗦𝗛𝗨
🎂 𝗔𝗴𝗲: 𝟮𝟴+
💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻: 𝗦𝗶𝗻𝗴𝗹𝗲
🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻: 𝗕𝗔𝗦𝗜𝗖 𝗞𝗡𝗢𝗪𝗟𝗔𝗗𝗚𝗘 𝗖𝗢𝗗𝗘𝗦
📚 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻: 𝗛𝗦𝗖
🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: 𝗕𝗛𝗔𝗚𝗔𝗟𝗣𝗨𝗥

🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦

📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:
61594111949950

💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:
m.me/hello.baby1222

📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
wa.me/@rishikesh9980
`;

  // Sirf ek hi fixed image
  const imageUrl = "https://i.imgur.com/l5xNpRB.jpeg";

  const filePath = __dirname + "/cache/owner.jpg";

  const callback = () => {
    api.sendMessage(
      {
        body: info,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    );
  };

  return request(encodeURI(imageUrl))
    .pipe(fs.createWriteStream(filePath))
    .on("close", callback);
};