✦ MESSENGER MIRAI CHATBOT FOEK ✦

❖ अपने मैसेंजर को एक कदम आगे ले जाएं! अधिक स्मार्ट, आसान और आधुनिक Messenger Experience के लिए उपयोग करें SHAHADAT CHAT BOT — आपके मैसेंजर के लिए एक Powerful Multi-Device Bot!

अस्सलामु अलैकुम सभी को! — SHAHADAT CHAT BOT Fork में आपका स्वागत है!

SHAHADAT CHAT BOT — Developed By SHAHADAT SAHU

Node.js 20.x • Messenger Bot • License: MIT

---

❖ DEPLOY WORKFLOWS ❖

🚀 GitHub Actions से ऑटो डिप्लॉय करने के लिए .github/workflows/main.yml फाइल को इस YML कोड से बदल दें।

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    # Step to check out the repository code
    - uses: actions/checkout@v2

    # Step to set up the specified Node.js version
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}

    # Step to install dependencies
    - name: Install dependencies
      run: npm install

    # Step to run the bot with the correct port
    - name: Start the bot
      env:
        PORT: 8080
      run: npm start
```

---

🚀 इस प्रोजेक्ट को कैसे उपयोग करें

🎬 Thumbnail पर क्लिक करके पूरा वीडियो ट्यूटोरियल देखें → YouTube Tutorial

🤖 बॉट चलाने के चरण

Start Command — जिस फोल्डर में आपके बॉट फाइल्स हैं वहां जाएं:

```bash
node Sahu.js
```

---

⚙️ Command System

💡 Prefix और Aliases से अपने Command System को और Flexible बनाएं। दो फीचर — usePrefix (prefix नियम) और aliases (कई नाम)।

1️⃣ usePrefix

🤔 यह असल में क्या करता है?

बॉट को कमांड भेजते समय prefix लगेगा या नहीं — यही तय करता है usePrefix।

· Prefix = कमांड से पहले लगाया जाने वाला चिह्न, जैसे /। इसलिए /help = prefix के साथ, और help = prefix के बिना।
· usePrefix: true → prefix के साथ भी चलेगा, बिना भी चलेगा।
· usePrefix: false → सिर्फ prefix के साथ ही चलेगा।

सेटिंग /help help
true ✅ ✅
false ✅ ❌

📌 ध्यान दें: false का मतलब "prefix बिल्कुल बंद" नहीं है — बल्कि "prefix अनिवार्य"। दोनों स्थितियों में prefix से काम करता है, फर्क सिर्फ यह है कि prefix के बिना चलेगा या नहीं।

🌐 Global — config.json में सेट करने पर सभी कमांड पर

config.json में एक बार सेट करने पर पूरे बॉट के सभी कमांड में एक ही नियम लागू होगा। हर कमांड फाइल को अलग से एडिट नहीं करना पड़ेगा।

```json
{
  "usePrefix": true
}
```

👉 अब जो भी भेजें, दोनों तरह से काम करेगा:

```
/help    ➜  help
/ping    ➜  ping
/song    ➜  song
```

🧩 Per-command — सिर्फ एक कमांड के लिए

सभी कमांड में एक ही नियम नहीं चाहिए तो जिस कमांड के लिए बदलना चाहते हैं सिर्फ उसकी फाइल में usePrefix लिखें।

```js
// prefix + no prefix — दोनों तरह से चलेगा
module.exports.config = {
  name: "help",
  usePrefix: true
};

// सिर्फ prefix — prefix के बिना लिखने पर कुछ नहीं होगा
module.exports.config = {
  name: "restart",
  usePrefix: false
};
```

⚖️ दोनों सेट करने पर कौन मानेगा? (Priority)

कमांड फाइल की सेटिंग हमेशा जीत जाएगी। Global सिर्फ तभी काम करता है जब कमांड फाइल में usePrefix नहीं लिखा हो।

```
कमांड फाइल में usePrefix है?  →  हाँ ➜ वही मानेगा
                              →  नहीं ➜ config.json का मान मानेगा
```

config.json कमांड फाइल परिणाम
true नहीं लिखा prefix + no prefix
true false सिर्फ prefix
false true prefix + no prefix
false नहीं लिखा सिर्फ prefix

---

2️⃣ Aliases

एक कमांड के कई नाम देने के लिए aliases उपयोग करें:

```js
module.exports.config = {
  name: "help",
  aliases: ["h", "menu", "commands", "cmd"]
};
```

👉 अब एक ही कमांड चलेगा: /help /h /menu /commands /cmd

· जितने चाहें नाम जोड़ सकते हैं।
· छोटे alias रखें — h, menu, cmd।
· एक ही alias दो कमांड में देने पर कॉन्फ्लिक्ट होगा।
· aliases सिर्फ नाम बढ़ाता है — prefix नियम तय करता है usePrefix।

---

🔥 Features

✨ फीचर 📝 विवरण
💬 Auto Chat प्राकृतिक भाषा प्रोसेसिंग के माध्यम से स्वचालित और निर्बाध बातचीत का आनंद लें।
🖼️ Photo Editing हमारे एडवांस्ड कमांड से प्रोफेशनल स्तर की फोटो एडिट करें, अतिरिक्त ऐप की जरूरत नहीं।
🎨 Image Generation हमारी आधुनिक टेक्स्ट-टू-इमेज तकनीक से अनोखी तस्वीरें बनाएं।
📥 Video Downloader YouTube, Facebook, TikTok और अन्य प्लेटफॉर्म से HD वीडियो डाउनलोड करें।
🎮 Interactive Games मैसेंजर में सीधे गेम जोड़कर मजेदार गेम खेलें, इंस्टॉलेशन की झंझट के बिना!
🎉 Fun Commands सैकड़ों मजेदार कमांड से अपने दोस्तों को चौंका दें!

---

👨‍💻 Developer

जानकारी विवरण
Name SHAHADAT SAHU
Age 18+
Location KHAGRACHARI, BANGLADESH
Role STUDENT • DEVELOPER

About: 💻 मैं कोई प्रोफेशनल प्रोग्रामर नहीं हूं। मुझे प्रोग्रामिंग करना अच्छा लगता है, इसलिए दोस्तों की मदद से और AI Tools की सहायता से अलग-अलग Project, Chatbot और नई-नई Technology Develop करना पसंद करता हूं।

Interests: 🤖 Chatbot Development • 💻 Programming • 🌐 Web Development • 🧠 AI & Technology • 🛠️ Open Source Projects

📞 Contact:

· Facebook → CLICK NOW
· Messenger → MESSAGE ME
· WhatsApp → CHAT NOW

---

❖ सपोर्ट

अगर आपको किसी मदद की जरूरत हो, तो आप एडमिन से संपर्क कर सकते हैं। खास जरूरत के बिना कृपया एडमिन को डिस्टर्ब न करें। धन्यवाद!

· WhatsApp पर संपर्क करें
· Messenger पर संपर्क करें

🤝 Support Community

अपनी सामान्य मदद, चर्चा और अपडेट के लिए हमारे Support Box में Join करें।

· Telegram Support
· Messenger Support

💡 किसी भी सामान्य समस्या या मदद के लिए पहले Support Box में Join करके सवाल पूछ सकते हैं।

---

✨🌟 Special Thanks 🌟✨

· 🚀 Cyber Bot Team
· 🧙‍♂️ Ullash — Owner, Cyber Bot Team
· 🛡️ Sujon — Admin, Cyber Bot Team
· 🎓 Grandpa EJ — Owner, Grandpa Academy

---

💖 𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁 चुनने के लिए धन्यवाद!

🗓️ Release Date: 11/08/2025 at 02:00

⭐ Fork करने के बाद एक Star देना न भूलें! यह सच में मदद करता है!

Connect: GitLab • Telegram • Messenger Group • YouTube

मुझे उम्मीद है कि आपको मेरा Fork पसंद आएगा! CHAT BOT कम्युनिटी को सपोर्ट करने के लिए आपका बहुत-बहुत धन्यवाद!