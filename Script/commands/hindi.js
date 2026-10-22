const translate = require("translate-google");

module.exports.config = {
  name: "hindi", 
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "कोर्ट ग्रुप में बंगाली मैसेज को ऑटोमैटिक हिंदी में कनवर्ट करता है।",
  commandCategory: "system",
  usages: "बैकग्राउंड में अपने आप काम करता है",
  cooldowns: 0
};

// यह कोड बंगाली अक्षरों (Unicode) को पहचानता है
const bengaliRegex = /[\u0980-\u09FF]/;

// यह फंक्शन ग्रुप में आने वाले हर मैसेज पर बैकग्राउंड में नज़र रखता है
module.exports.handleEvent = async function({ api, event }) {
  // 1. अगर मैसेज खाली है, या मैसेज खुद बॉट ने भेजा है, तो रुक जाए (ताकि बॉट खुद के मैसेज को ट्रांसलेट न करने लगे)
  if (!event.body || event.senderID === api.getCurrentUserID()) return;

  // 2. चेक करें कि क्या आए हुए मैसेज में बंगाली अक्षर हैं?
  if (bengaliRegex.test(event.body)) {
    try {
      // 3. बंगाली टेक्स्ट को गूगल ट्रांसलेट की मदद से हिंदी ('hi') में बदलें
      const translated = await translate(event.body, { to: "hi" });

      // 4. अगर ट्रांसलेशन सही से हो गया है, तो उसे ग्रुप में भेजें
      if (translated && translated.trim().toLowerCase() !== event.body.trim().toLowerCase()) {
        const msg = {
          body: `🔏 [Court Auto-Translate]\n\n📝 हिंदी अनुवाद:\n${translated}`
        };
        
        // 5. उसी बंगाली मैसेज पर सीधे 'Reply' (कोट) करके हिंदी मैसेज भेज देगा
        api.sendMessage(msg, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("❌ ट्रांसलेशन में एरर आया:", error.message);
    }
  }
};

// यह तब काम करेगा जब कोई ग्रुप में मैन्युअली /hindi लिखकर चेक करेगा
module.exports.run = async function({ api, event }) {
  return api.sendMessage("🌐 कोर्ट ऑटो-ट्रांसलेटर बैकग्राउंड में पूरी तरह चालू है। बंगाली मैसेज अपने आप हिंदी में ट्रांसलेट हो जाएंगे।", event.threadID, event.messageID);
};
