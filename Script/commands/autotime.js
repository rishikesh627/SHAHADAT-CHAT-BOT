const schedule = require("node-schedule");

module.exports.config = {
  name: "autosent",
  version: "3.3.0",
  hasPermssion: 0,
  credits: "RISHIKESH",
  description: "Automatically sends scheduled messages (Hindi + English + Hindu Greetings)",
  commandCategory: "group messenger",
  usages: "[]",
  cooldowns: 0,
  usePrefix: true
};

/* ==================== STYLIZED GREETINGS ==================== */
const GREET = {
  radheKrishna:
    "~*- 🦚🥀 ꯭꧊ꝛᴀᴅʜᴇ ❤️ ᴋʀɪꜱʜɴᴀ 💗 💘 -*~\n" +
    "🌸 Jai Shree Krishna ❤️🙏",

  jaiShreeRam:
    "🌸 Jai Shree Ram ❤️🙏\n" +
    "🚩 जय श्री राम 🚩",

  harHarMahadev:
    "🕉️🔱❤️ हर हर महादेव ❤️🔱🕉️\n" +
    "🔱 जय श्री राम 🔱",

  omNamahShivaya:
    "🕉️ ॐ नमः शिवाय 🕉️\n" +
    "🔱 हर हर महादेव 🔱"
};

/* ==================== MESSAGES ==================== */
const messages = [
  // 12:00 AM
  {
    time: "12:00 AM",
    message:
      "🌙 अब रात के 12:00 बजे हैं ⏳\n" +
      "बहुत रात हो गई, अब सो जाओ बेबी। गुड नाइट 😴💤❤️\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌙 It's 12:00 AM now ⏳\n" +
      "It's too late, go to sleep baby. Good Night 😴💤❤️",
    special: null
  },

  // 1:00 AM
  {
    time: "1:00 AM",
    message:
      "🌙 अब रात के 1:00 बजे हैं ⏳\n" +
      "किरे तू अभी तक सोया नहीं? जल्दी सो जा! 😾😴🛌\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌙 It's 1:00 AM now ⏳\n" +
      "Hey, you still awake? Go to sleep now! 😾😴🛌",
    special: null
  },

  // 2:00 AM
  {
    time: "2:00 AM",
    message:
      "🌙 अब रात के 2:00 बजे हैं ⏳\n" +
      "सो जा भाई! अभी तक जागकर पछताएगा क्यों? 😤👊💤\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌙 It's 2:00 AM now ⏳\n" +
      "Go to sleep brother! Why stay awake and regret later? 😤👊💤",
    special: null
  },

  // 3:00 AM
  {
    time: "3:00 AM",
    message:
      "🌙 अब रात के 3:00 बजे हैं ⏳\n" +
      "सब सो गए, तू अभी तक जाग क्यों रहा है? 🙄🌃🛌\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌙 It's 3:00 AM now ⏳\n" +
      "Everyone's asleep, why are you still awake? 🙄🌃🛌",
    special: null
  },

  // 4:00 AM
  {
    time: "4:00 AM",
    message:
      "🌅 अब सुबह के 4:00 बजे हैं ⏳\n" +
      "🕉️🔱❤️ हर हर महादेव ❤️🔱🕉️\n" +
      "🔱 जय श्री राम 🔱\n" +
      "सुबह हो गई, उठ जाओ और दिन की शुरुआत करो 🌅✨\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌅 It's 4:00 AM now ⏳\n" +
      "Har Har Mahadev 🔱🕉️\n" +
      "Jai Shree Ram 🔱\n" +
      "Morning has come, wake up and start your day 🌅✨",
    special: null
  },

  // 5:00 AM
  {
    time: "5:00 AM",
    message:
      "🌅 अब सुबह के 5:00 बजे हैं ⏳\n" +
      "🌸 Jai Shree Ram ❤️🙏\n" +
      "🚩 जय श्री राम 🚩\n" +
      "उठ जाओ, सुबह की ताज़गी का आनंद लो 🌅💖\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌅 It's 5:00 AM now ⏳\n" +
      "🌸 Jai Shree Ram ❤️🙏\n" +
      "🚩 Jai Shree Ram 🚩\n" +
      "Wake up and enjoy the fresh morning 🌅💖",
    special: null
  },

  // 6:00 AM
  {
    time: "6:00 AM",
    message:
      "🌅 अब सुबह के 6:00 बजे हैं ⏳\n" +
      "~*- 🦚🥀 ꯭꧊ꝛᴀᴅʜᴇ ❤️ ᴋʀɪꜱʜɴᴀ 💗 💘 -*~\n" +
      "🌸 Jai Shree Krishna ❤️🙏\n" +
      "गुड मॉर्निंग बेबी! अब उठ जाओ और थोड़ा व्यायाम कर लो 🌅💖😳\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌅 It's 6:00 AM now ⏳\n" +
      "🦚 Radhe Krishna ❤️🙏\n" +
      "🌸 Jai Shree Krishna ❤️🙏\n" +
      "Good Morning Baby! Wake up and do some exercise 🌅💖😳",
    special: null
  },

  // 7:00 AM
  {
    time: "7:00 AM",
    message:
      "☀️ अब सुबह के 7:00 बजे हैं ⏳\n" +
      "नींद खुलते ही मोबाइल! ब्रश करेगा या नहीं? 🛌➡️📱\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "☀️ It's 7:00 AM now ⏳\n" +
      "Phone as soon as you wake up! Will you brush or not? 🛌➡️📱",
    special: null
  },

  // 8:00 AM
  {
    time: "8:00 AM",
    message:
      "☀️ अब सुबह के 8:00 बजे हैं ⏳\n" +
      "मोबाइल रख और ब्रश करके नाश्ता कर ले! 📱🪥🍽️\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "☀️ It's 8:00 AM now ⏳\n" +
      "Put down the phone, brush and have breakfast! 📱🪥🍽️",
    special: null
  },

  // 9:00 AM
  {
    time: "9:00 AM",
    message:
      "☀️ अब सुबह के 9:00 बजे हैं ⏳\n" +
      "बेबी, नाश्ता किया? 🍳🥞💖\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "☀️ It's 9:00 AM now ⏳\n" +
      "Baby, did you have breakfast? 🍳🥞💖",
    special: null
  },

  // 10:00 AM
  {
    time: "10:00 AM",
    message:
      "☀️ अब सुबह के 10:00 बजे हैं ⏳\n" +
      "किरे भोंडू, आज कॉलेज नहीं गया क्या? 😜📚🙄\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "☀️ It's 10:00 AM now ⏳\n" +
      "Hey lazy, didn't go to college today? 😜📚🙄",
    special: null
  },

  // 11:00 AM
  {
    time: "11:00 AM",
    message:
      "☀️ अब सुबह के 11:00 बजे हैं ⏳\n" +
      "नाटक कम कर प्यारे~ Boss अभी बिज़ी है! 🙄📱💼\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "☀️ It's 11:00 AM now ⏳\n" +
      "Stop the drama dear~ Boss is busy right now! 🙄📱💼",
    special: null
  },

  // 12:00 PM
  {
    time: "12:00 PM",
    message:
      "🌞 अब दोपहर के 12:00 बजे हैं ⏳\n" +
      "गुड आफ़्टरनून! 🌞🙌🌸\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌞 It's 12:00 PM now ⏳\n" +
      "Good Afternoon! 🌞🙌🌸",
    special: null
  },

  // 1:00 PM
  {
    time: "1:00 PM",
    message:
      "🌞 अब दोपहर के 1:00 बजे हैं ⏳\n" +
      "🌸 Jai Shree Ram ❤️🙏\n" +
      "🚩 जय श्री राम 🚩\n" +
      "भोंडू कहीं के, मोबाइल बंद कर और खाना खा ले 😻❣️🥰\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌞 It's 1:00 PM now ⏳\n" +
      "🌸 Jai Shree Ram ❤️🙏\n" +
      "🚩 Jai Shree Ram 🚩\n" +
      "Hey silly, put down the phone and have your lunch 😻❣️🥰",
    special: null
  },

  // 2:00 PM
  {
    time: "2:00 PM",
    message:
      "🌞 अब दोपहर के 2:00 बजे हैं ⏳\n" +
      "भोंडू, मोबाइल रख! नहाकर खाना खा ले 🔪🛁🍽️\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌞 It's 2:00 PM now ⏳\n" +
      "Silly, put the phone down! Take a shower and eat 🔪🛁🍽️",
    special: null
  },

  // 3:00 PM
  {
    time: "3:00 PM",
    message:
      "🌤️ अब दोपहर के 3:00 बजे हैं ⏳\n" +
      "जान, तेरे बिना दोपहर में नींद नहीं आती….! 😴💔🌙\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌤️ It's 3:00 PM now ⏳\n" +
      "Dear, I can't sleep in the afternoon without you….! 😴💔🌙",
    special: null
  },

  // 4:00 PM
  {
    time: "4:00 PM",
    message:
      "🌤️ अब शाम के 4:00 बजे हैं ⏳\n" +
      "🕉️ ॐ नमः शिवाय 🕉️\n" +
      "🔱 हर हर महादेव 🔱\n" +
      "आज बहुत गर्मी पड़ी! 🥵🌞💦\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌤️ It's 4:00 PM now ⏳\n" +
      "🕉️ Om Namah Shivaya 🕉️\n" +
      "🔱 Har Har Mahadev 🔱\n" +
      "It was very hot today! 🥵🌞💦",
    special: null
  },

  // 5:00 PM
  {
    time: "5:00 PM",
    message:
      "🌤️ अब शाम के 5:00 बजे हैं ⏳\n" +
      "हालात जैसे भी हों, हर वक़्त मुस्कुराना ज़रूरी है! 😅🕒🙂\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌤️ It's 5:00 PM now ⏳\n" +
      "Whatever the situation, always keep smiling! 😅🕒🙂",
    special: null
  },

  // 6:00 PM
  {
    time: "6:00 PM",
    message:
      "🌆 अब शाम के 6:00 बजे हैं ⏳\n" +
      "~*- 🦚🥀 ꯭꧊ꝛᴀᴅʜᴇ ❤️ ᴋʀɪꜱʜɴᴀ 💗 💘 -*~\n" +
      "🌸 Jai Shree Krishna ❤️🙏\n" +
      "गुड ईवनिंग सबको! हाथ-मुँह धो लो! 🌆👐💦\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌆 It's 6:00 PM now ⏳\n" +
      "🦚 Radhe Krishna ❤️🙏\n" +
      "🌸 Jai Shree Krishna ❤️🙏\n" +
      "Good Evening everyone! Wash your hands and face! 🌆👐💦",
    special: null
  },

  // 7:00 PM
  {
    time: "7:00 PM",
    message:
      "🌆 अब शाम के 7:00 बजे हैं ⏳\n" +
      "किरे भोंडू, आज पढ़ने बैठा था क्या? 😏📚🤔\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌆 It's 7:00 PM now ⏳\n" +
      "Hey silly, were you going to study today? 😏📚🤔",
    special: null
  },

  // 8:00 PM
  {
    time: "8:00 PM",
    message:
      "🌃 अब रात के 8:00 बजे हैं ⏳\n" +
      "ओई ओई, इतना bot bot न कर और मेरे Boss RISHIKESH URF RISHU को एक GF दिला दे...! 🫰😎🔥\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌃 It's 8:00 PM now ⏳\n" +
      "Hey hey, stop bot bot and get my Boss RISHIKESH URF RISHU a girlfriend...! 🫰😎🔥",
    special: null
  },

  // 9:00 PM
  {
    time: "9:00 PM",
    message:
      "🌃 अब रात के 9:00 बजे हैं ⏳\n" +
      "मेरे cute बेबी ने खाना खाया...! 😘🍽️❤️\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌃 It's 9:00 PM now ⏳\n" +
      "Did my cute baby have dinner...! 😘🍽️❤️",
    special: null
  },

  // 10:00 PM
  {
    time: "10:00 PM",
    message:
      "🌃 अब रात के 10:00 बजे हैं ⏳\n" +
      "किरे भोंडू, खाएगा कब? सारा दिन मोबाइल टिपता रहा..! 😜📱😾\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌃 It's 10:00 PM now ⏳\n" +
      "Hey silly, when will you eat? You've been on the phone all day..! 😜📱😾",
    special: null
  },

  // 11:00 PM
  {
    time: "11:00 PM",
    message:
      "🌃 अब रात के 11:00 बजे हैं ⏳\n" +
      "🕉️🔱❤️ हर हर महादेव ❤️🔱🕉️\n" +
      "🔱 जय श्री राम 🔱\n" +
      "जो छोड़ गया 😔 उसे भूल जा 🙂 मेरे Boss RISHIKESH URF RISHU से प्यार करके उसे दिखा दे...! 🙈🐸🤗\n" +
      "━━━━━━━━━━━━━━━━━\n" +
      "🌃 It's 11:00 PM now ⏳\n" +
      "🕉️ Har Har Mahadev 🔱🕉️\n" +
      "🔱 Jai Shree Ram 🔱\n" +
      "Forget the one who left you 😔 Love my Boss RISHIKESH URF RISHU and show them...! 🙈🐸🤗",
    special: null
  }
];

module.exports.onLoad = ({ api }) => {
  if (global.config?.autoSent === false) return;

  messages.forEach(({ time, message }) => {
    if (!time || !message) return;

    const [hour, minute, period] = time.split(/[: ]/);

    let hour24 = parseInt(hour, 10);

    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    }

    if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    const rule = new schedule.RecurrenceRule();

    // ✅ FIXED: Changed from Asia/Dhaka to Asia/Kolkata (India Time)
    rule.tz = "Asia/Kolkata";
    rule.hour = hour24;
    rule.minute = parseInt(minute, 10);

    schedule.scheduleJob(rule, () => {
      if (global.config?.autoSent === false) return;

      const threadIDs = global.data?.allThreadID;

      if (!Array.isArray(threadIDs)) return;

      threadIDs.forEach((threadID, index) => {
        setTimeout(() => {
          api.sendMessage(message, threadID, (err) => {
            if (err) {
              console.log(`[AUTOSENT] Failed to send to ${threadID}:`, err.message);
            }
          });
          // ✅ FIXED: Increased delay from 2000 (2s) to 5000 (5s) to prevent spam ban
        }, index * 5000); 
      });
    });
  });

  console.log("[AUTOSENT] Scheduler started - RISHIKESH URF RISHU version ready!");
};

module.exports.run = () => {};