const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "hindu",
    aliases: ["hinduvideo", "bhakti", "mandir"],
    version: "1.1.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Send a random Hindu devotional video",
    commandCategory: "Random video",
    usages: "hindu",
    cooldowns: 5,
    usePrefix: true,
    dependencies: { axios: "", "fs-extra": "" }
};

// 🕉️ Hindu / Bhakti video links (Catbox)
const videos = [
    "https://files.catbox.moe/1royi5.mp4",
    "https://files.catbox.moe/ooy2k5.mp4",
    "https://files.catbox.moe/kpbte9.mp4",
    "https://files.catbox.moe/kqk4m2.mp4",
    "https://files.catbox.moe/x81n8l.mp4",
    "https://files.catbox.moe/y0o68y.mp4",
    "https://files.catbox.moe/u29i30.mp4",
    "https://files.catbox.moe/gbvq8i.mp4",
    "https://files.catbox.moe/mxtao5.mp4"
];

// 🚩 Hindu greetings / captions (Hindi)
const captions = [
    "🕉️ ॐ नमः शिवाय!\n\nजय श्री राम 🚩\nभगवान हम सबका कल्याण करें। 🙏",
    "🚩 जय श्री कृष्ण!\n\nराधे राधे 🌸\nहर हर महादेव 🕉️",
    "🕉️ हर हर महादेव!\n\nबोलो जय श्री राम 🚩\nसंकट हरें भगवान। 🙏",
    "🌸 जय माता दी!\n\nजय श्री गणेश 🐘\nहर कार्य में सफलता मिले। 🙏",
    "🚩 सियावर रामचंद्र की जय!\n\nप्रभु श्री राम हम सब पर कृपा करें। 🙏",
    "🕉️ ॐ नमो भगवते वासुदेवाय!\n\nश्री कृष्ण की कृपा सदा बनी रहे। 🌸",
    "🙏 जय बजरंगबली!\n\nसंकट कटे, मन शांत रहे। 🚩",
    "🌸 दुर्गा माता की जय!\n\nशेरावाली माँ हमें शक्ति दें। 🙏",
    "🚩 जय लक्ष्मी माता!\n\nघर में सुख-समृद्धि बनी रहे। 🌸",
    "🕉️ वक्रतुण्ड महाकाय!\n\nगणपति बप्पा मोरया 🐘"
];

module.exports.run = async function ({ api, event }) {
    const msgID = event.messageID || null;

    // ✅ 1. Safe reaction helper (पुराने bot versions के लिए)
    const react = (emoji) => {
        try {
            if (typeof api.setMessageReaction === "function") {
                api.setMessageReaction(emoji, msgID, () => {}, true);
            }
        } catch {}
    };

    // ✅ 2. Per-thread lock — ek time pe ek hi video download
    if (!global._hinduLock) global._hinduLock = {};
    if (global._hinduLock[event.threadID]) {
        return api.sendMessage(
            "⏳ पिछला वीडियो अभी आ रहा है, थोड़ा रुको।",
            event.threadID,
            msgID
        );
    }
    global._hinduLock[event.threadID] = true;

    const fileName = `hindu_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`;
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, fileName);

    try {
        await fs.ensureDir(cacheDir);

        const videoUrl = videos[Math.floor(Math.random() * videos.length)];

        react("⏳");

        const response = await axios.get(videoUrl, {
            responseType: "stream",
            timeout: 60000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://catbox.moe/"
            }
        });

        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
            response.data.on("error", reject);
        });

        const stat = await fs.stat(filePath);

        if (!stat.size) throw new Error("Downloaded video is empty");

        // ✅ 3. Size check — Messenger limit (24MB) से बड़ी video भेजने से पहले रोक
        const MB = stat.size / (1024 * 1024);
        if (MB > 24) {
            throw new Error(`Video too large: ${MB.toFixed(1)} MB (limit 24MB)`);
        }

        react("✅");

        const caption = captions[Math.floor(Math.random() * captions.length)];

        return api.sendMessage(
            {
                body: caption,
                attachment: fs.createReadStream(filePath)
            },
            event.threadID,
            async () => {
                await fs.remove(filePath).catch(() => {});
            },
            msgID
        );

    } catch (error) {
        await fs.remove(filePath).catch(() => {});

        console.error(
            "[HINDU ERROR]",
            error?.response?.status || error?.message || error
        );

        react("❌");

        return api.sendMessage(
            "❌ हिंदू भक्ति वीडियो भेजा नहीं जा सका।\n\n" +
            "⚠️ कारण: " + (error?.message || "unknown") + "\n" +
            "🔁 थोड़ी देर बाद फिर कोशिश करें।",
            event.threadID,
            msgID
        );

    } finally {
        // ✅ 4. Lock हमेशा release (success या fail दोनों में)
        global._hinduLock[event.threadID] = false;
    }
};