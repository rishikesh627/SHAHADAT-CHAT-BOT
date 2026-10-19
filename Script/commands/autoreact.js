const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autoreact",
  version: "9.1.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Ultimate Masti Bot v9.1 - Jokes + Shayari + Gender-based React!",
  commandCategory: "FUN",
  usages: "[.masti status]",
  cooldowns: 1,
  usePrefix: true
};

/* ==================== STATS INIT HELPER ==================== */
function initStats() {
  if (!global.mastiStats) {
    global.mastiStats = {
      totalReactions: 0, total: 0,
      majak: 0, masti: 0, flirt: 0, shayri: 0,
      maleReplies: 0, femaleReplies: 0, unknownReplies: 0,
      love: 0, sad: 0, angry: 0, india: 0, greet: 0
    };
  }
  return global.mastiStats;
}

/* ==================== GENDER STORAGE ==================== */
const GENDER_FILE = path.join(__dirname, "cache", "gender.json");

function loadGender() {
  try {
    return fs.existsSync(GENDER_FILE)
      ? JSON.parse(fs.readFileSync(GENDER_FILE, "utf8"))
      : {};
  } catch { return {}; }
}

function saveGender(data) {
  try {
    fs.ensureDirSync(path.dirname(GENDER_FILE));
    fs.writeFileSync(GENDER_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("[GENDER SAVE]", e.message);
  }
}

/* ==================== NAME-BASED GENDER ==================== */
const FEMALE_KEYWORDS = [
  "akter","akhtar","begum","bibi","khatun","khanam","sultana","banu","bano",
  "parvin","parveen","yasmin","nasrin","nusrat","sabina","sabrina","shirin",
  "priya","pooja","puja","neha","sneha","riya","diya","siya","kiya","niya",
  "jiya","piya","tiya","anjali","anju","asha","bharti","bhavna","chandni",
  "deepa","divya","gita","geeta","hema","isha","jaya","kavita","komal",
  "lakshmi","lata","madhuri","meena","mina","naina","nisha","pallavi",
  "payal","preeti","preity","rachana","radha","rani","rashmi","rekha","renu",
  "sadhana","sangeeta","sangita","sapna","saroj","shanti","sharda","sheela",
  "shila","shobha","shweta","sonal","sonia","soniya","sunita","sushma",
  "swati","tara","tulsi","uma","usha","veena","vina","vidya","zara","zoya",
  "fatima","aisha","ayesha","mariam","maryam","sana","saba","sara","sarah",
  "noor","nur","laila","layla","maya","ritu","ritika","kritika","anita",
  "amrita","arpita","aarti","arti","jyoti","khushi","muskan","mehak","mahak",
  "nazia","shabnam","shabana","farhana","farzana","ruksana","taslima",
  "sharmin","jannat","jannatul","maria","mim","momo","mita","mitu","tania",
  "tisha","tithi","urmi","sumi","sumaiya","nipa","nupur","sraboni","raya",
  "raisa","rhea","ria","rupa","rupsa","shipra","soma","sonali","sushmita",
  "swapna","tanjila","tanni","trisha","tuli","tumpa","urfi","varsha",
  "dipika","ipsita","ishita","jhilik","jhumur","kakoli","kanika","karishma",
  "kashish","kavya","laboni","lina","lisa","liza","madhu","madhabi","malati",
  "maliha","manisha","meghna","meher","mitali","mohini","moumita","mousumi",
  "mukta","nabanita","nadira","nandita","nazma","neelam","nibedita","nilima",
  "nirmala","parul","papiya","pratima","prema","purnima","ratna","reba",
  "rina","rita","ruma","sabana","sabita","sagarika","sakina","salma","samira",
  "sanjida","seema","shima","shova","simran","sohagi","sonam","suborna",
  "suchitra","sudipta","sujata","sukla","sunanda","suparna","susmita",
  "tanushree","tripti","vandana","yashmin","zarin","zeba"
];

const MALE_KEYWORDS = [
  "khan","mia","miah","sheikh","shekh","sahu","shahadat","shahid","sajid",
  "sajib","sabbir","sohel","sohail","sohag","sohan","sourav","sagar","sagor",
  "sakib","salauddin","salim","selim","samim","samiul","sanju","sarwar",
  "sayed","sayeed","sayem","shafin","shafiq","shahin","shakib","shamim",
  "shanto","sharif","shihab","shimul","shipon","sojib","subir","sudip",
  "sujon","sumon","sunny","surjo","sushil","tanvir","tareq","tarik",
  "tawhid","tonmoy","tuhin","tushar","wahid","wasim","yasin","zahid",
  "zakir","zaman","zubair","zunaid","abir","adnan","ahad","ahmed","ahsan",
  "akash","akib","alam","alamin","alif","amin","amir","anik","anis","arafat",
  "arif","arnob","asad","asadul","ashik","ashraf","asif","atif","ayan",
  "azad","aziz","badhon","bijoy","bikash","billal","biplob","bishal",
  "chandan","dipu","emon","erfan","farhan","fahim","faisal","farhad","farid",
  "firoz","habib","hasan","hasib","hridoy","imran","iqbal","irfan","islam",
  "ismail","jahid","jamal","jasim","jibon","joy","jubayer","kamal","kamrul",
  "kawsar","kazi","khaled","liton","mahadi","mahbub","mahin","mahir","mamun",
  "masud","mehedi","miraj","mizan","mohammad","mohsin","monir","mostafa",
  "mukul","munna","mushfiq","mustafa","nadim","naim","nazmul","nazim",
  "nayeem","nayan","noman","nurul","omar","osman","rafi","rafid","rafiq",
  "rahim","rakib","rakin","rakibul","rana","rasel","rashid","rayhan","razib",
  "redwan","rehan","riad","rifat","riyad","robi","robin","rony","rubel",
  "rumi","ruhul","sadat","shahriar","siam","sifat","sihab","tahsin","tanim",
  "tanzim","tonoy","raj","raju","ravi","rohit","rahul","rajesh","rakesh",
  "ramesh","suresh","mahesh","ganesh","mukesh","naresh","amit","sumit",
  "ajit","sanjay","vijay","ajay","arjun","karan","varun","tarun","rohan",
  "mohan","ram","shyam","hari","krishna","shiv","kabir","vivek","manish",
  "harish","satish","sandeep","sandip","sanjib","santanu","sarthak",
  "saurabh","shib","shivam","shubham","subham","sourav","souvik","subho",
  "suraj","sushant","soumen","soumya"
];

function guessGenderFromName(name) {
  if (!name) return "unknown";
  const lower = name.toLowerCase();
  const words = lower.split(/[\s_.-]+/);

  for (const word of words) {
    if (FEMALE_KEYWORDS.includes(word)) return "female";
    if (MALE_KEYWORDS.includes(word)) return "male";
  }
  for (const word of words) {
    if (word.length < 3) continue;
    for (const fk of FEMALE_KEYWORDS) {
      if (word.includes(fk) || fk.includes(word)) return "female";
    }
    for (const mk of MALE_KEYWORDS) {
      if (word.includes(mk) || mk.includes(word)) return "male";
    }
  }
  return "unknown";
}

async function getUserGender(api, senderID) {
  const genderDB = loadGender();
  let gender = genderDB[senderID];

  if (!gender || gender === "unknown") {
    try {
      const info = await api.getUserInfo(senderID);
      const name = info[senderID]?.name || "";
      gender = guessGenderFromName(name);
      genderDB[senderID] = gender;
      saveGender(genderDB);
    } catch {
      gender = "unknown";
    }
  }
  return gender;
}

/* ==================== ANTI-LOOP GUARD ==================== */
const loopGuard = {
  settings: {
    rapidGapMs: 3000,
    maxRapidChain: 5,
    windowMs: 30000,
    maxTriggersInWindow: 9,
    muteMs: 10 * 60 * 1000
  },
  threads: new Map(),

  getThread(threadID) {
    let st = this.threads.get(threadID);
    if (!st) {
      st = {
        lastTriggerAt: 0,
        rapidChain: 0,
        triggerTimes: [],
        pausedUntil: 0,
        lastNoticeAt: 0
      };
      this.threads.set(threadID, st);
    }
    return st;
  },

  check(api, event) {
    const now = Date.now();
    const threadID = event.threadID;
    const st = this.getThread(threadID);

    try {
      if (String(event.senderID) === String(api.getCurrentUserID())) return false;
    } catch {}

    if (st.pausedUntil) {
      if (now < st.pausedUntil) return false;
      st.pausedUntil = 0;
      st.rapidChain = 0;
      st.triggerTimes = [];
    }

    const gap = st.lastTriggerAt ? now - st.lastTriggerAt : Infinity;
    st.lastTriggerAt = now;

    if (gap < this.settings.rapidGapMs) {
      st.rapidChain++;
    } else {
      st.rapidChain = 0;
    }

    st.triggerTimes.push(now);
    while (st.triggerTimes.length && now - st.triggerTimes[0] > this.settings.windowMs) {
      st.triggerTimes.shift();
    }

    const loopDetected =
      st.rapidChain >= this.settings.maxRapidChain ||
      st.triggerTimes.length > this.settings.maxTriggersInWindow;

    if (loopDetected) {
      st.pausedUntil = now + this.settings.muteMs;
      st.rapidChain = 0;
      st.triggerTimes = [];

      if (now - st.lastNoticeAt > this.settings.muteMs) {
        st.lastNoticeAt = now;
        const mins = Math.max(1, Math.round(this.settings.muteMs / 60000));
        api.sendMessage(
          `🤖 Bot-to-Bot loop detected!\n` +
          `इस ग्रुप में automated reply chain पकड़ी गई। Masti Bot ${mins} मिनट के लिए बंद कर दिया गया।\n` +
          `(Manual command और बाकी features सामान्य काम करेंगे।)`,
          threadID
        );
      }
      return false;
    }
    return true;
  }
};

/* ==================== JOKES DATABASE ==================== */
const jokesDB = {
  love: [
    "😂 *Love Joke:*\nलड़का: I love you!\nलड़की: Prove it!\nलड़का: तेरा नाम 100 बार लिख दूँगा!\nलड़की: तो लिख!\nलड़का: (सोचता है) 100 बार? अगले जनम में लिखूँगा!",
    "💕 *Love Joke:*\nGirlfriend: तुम मुझे कितना love करते हो?\nBoyfriend: WhatsApp unlimited जितना!\nGirlfriend: मतलब?\nBoyfriend: Limit cross करते ही speed slow हो जाती है!",
    "❤️ *Love Joke:*\nउसने कहा: तुमसे दूर जा रही हूँ!\nमैंने कहा: क्यों?\nबोली: क्योंकि तुम बहुत अच्छे हो!\nमैं: तो अच्छा होना बुराई है?\nबोली: नहीं, पर तुम इतने अच्छे हो कि मैं धोखा नहीं दे सकती!",
    "💖 *Love Joke:*\nपत्नी: तुम मुझे कभी surprise नहीं देते!\nपतिदेव: क्यों नहीं देता?\nपत्नी: कब दिया?\nपतिदेव: कल रात surprise किया!\nपत्नी: कैसे?\nपतिदेव: सोचते-सोचते सो गया!",
    "💘 *Love Joke:*\nTeacher: तुम दोनों एक bench पे क्यों बैठे हो?\nलड़का: Ma'am, ये मेरी girlfriend है!\nTeacher: तो इसका क्या?\nलड़का: एक bench पे बैठेंगे तो एक किताब का खर्चा बचेगा!"
  ],
  sad: [
    "😢 *Sad Joke:*\nDoctor: आप परेशान क्यों हैं?\nमरीज़: मेरी बीवी ने मुझे छोड़ दिया!\nDoctor: कब?\nमरीज़: 5 साल पहले!\nDoctor: अभी भी याद आता है?\nमरीज़: नहीं, पर आज उसकी शादी है!",
    "😭 *Sad Joke:*\nसंता: बंता, क्यों रो रहा है?\nबंता: मेरी बीवी मुझे छोड़कर चली गई!\nसंता: तो रोने की क्या बात है?\nबंता: वो मेरा fridge भी साथ ले गई!",
    "😥 *Sad Joke:*\nलड़का: मुझे कोई नहीं चाहता!\nदोस्त: मैं हूँ ना!\nलड़का: तुम तो दोस्त हो!\nदोस्त: तो?\nलड़का: दोस्त तो सब चाहते हैं, girlfriend नहीं चाहती!",
    "😔 *Sad Joke:*\nपत्नी: तुमने मेरा birthday क्यों नहीं मनाया?\nपतिदेव: मनाया तो था!\nपत्नी: कब?\nपतिदेव: सपने में!",
    "😞 *Sad Joke:*\nBoss: तुम इतने late क्यों आए?\nEmployee: Sir, मेरा alarm नहीं बजा!\nBoss: तो नया alarm ले लो!\nEmployee: लेकिन उसके लिए पैसे नहीं!\nBoss: तो उठने का time ही बदल लो!"
  ],
  fun: [
    "😂 *Fun Joke:*\nTeacher: तुम school क्यों नहीं आए कल?\nStudent: मम्मी बीमार थीं!\nTeacher: तो तुम क्यों नहीं आए?\nStudent: मम्मी ने कहा था school मत जाओ!\nTeacher: क्यों?\nStudent: उन्हें अकेले रहना पसंद नहीं!",
    "🤣 *Fun Joke:*\nसंता: बंता, तुम तो बहुत खुश दिख रहे हो!\nबंता: हाँ, कल मेरी शादी है!\nसंता: मुबारक हो! दुल्हन कौन सी है?\nबंता: पता नहीं, पापा ने fix की है!",
    "😆 *Fun Joke:*\nDoctor: आपको क्या problem है?\nमरीज़: सर दर्द!\nDoctor: कब से?\nमरीज़: जब से आपका clinic खुला है!\nDoctor: तो अब तक क्यों नहीं आए?\nमरीज़: दर्द ही नहीं था!",
    "😅 *Fun Joke:*\nपापा: बेटा, exam में कितने number आए?\nबेटा: 100!\nपापा: वाह!\nबेटा: 100 में से 100!\nपापा: तो?\nबेटा: 100 number कम!",
    "😁 *Fun Joke:*\nInterviewer: आपकी qualifications?\nCandidate: मैं बहुत honest हूँ!\nInterviewer: और?\nCandidate: इतनी honest कि नौकरी ही नहीं मिलती!"
  ],
  angry: [
    "😡 *Angry Joke:*\nपत्नी: तुम मुझसे बात क्यों नहीं करते?\nपतिदेव: तुम ही तो करती नहीं!\nपत्नी: मैं क्यों करूँ?\nपतिदेव: मैं क्यों करूँ?\nपत्नी: पहले तुम करो!\nपतिदेव: पहले तुम करो!",
    "🤬 *Angry Joke:*\nBoss: तुम्हें निकाल रहा हूँ!\nEmployee: क्यों?\nBoss: तुम काम नहीं करते!\nEmployee: काम करना मेरे nature में नहीं!\nBoss: तो क्या करते हो?\nEmployee: आपको गुस्सा दिलाता हूँ!",
    "😠 *Angry Joke:*\nTeacher: तुम homework क्यों नहीं लाए?\nStudent: कुत्ता खा गया!\nTeacher: तेरे पास कुत्ता है?\nStudent: नहीं, पर कल रात नींद में कुत्ता आया था!"
  ],
  india: [
    "🇮🇳 *India Joke:*\nसंता: बंता, India का national animal क्या है?\nबंता: Tiger!\nसंता: National bird?\nबंता: Peacock!\nसंता: National fruit?\nबंता: Mango!\nसंता: National food?\nबंता: माँ के हाथ का खाना!",
    "🇮🇳 *India Joke:*\nTeacher: India की capital क्या है?\nStudent: Delhi!\nTeacher: Mumbai क्या है?\nStudent: Financial capital!\nTeacher: Bangalore क्या है?\nStudent: IT capital!\nTeacher: Patna क्या है?\nStudent: Litti Chokha capital!"
  ],
  general: [
    "😂 *General Joke:*\nTeacher: तुम्हें 1 से 10 तक गिनती आती है?\nStudent: हाँ!\nTeacher: तो बताओ.\nStudent: 1,2,3,4,5,6,7,8,9,10, JACK, QUEEN, KING!",
    "😅 *General Joke:*\nसंता: बंता, तेरी बीवी ने तुझे कभी परेशान किया?\nबंता: कभी नहीं.\nसंता: इतना confident?\nबंता: हाँ, मैंने अभी तक शादी नहीं की!",
    "😆 *General Joke:*\nDoctor: आपको किस चीज़ की allergy है?\nPatient: काम से!",
    "🤣 *General Joke:*\nपत्नी: मेरा weight 60kg है, कितना होना चाहिए?\nपतिदेव: 20-25 kg काफी है!\nपत्नी: पागल हो गया?\nपतिदेव: नहीं, laptop का weight 2-3 kg होता है!"
  ]
};

/* ==================== SHAYARI DATABASE ==================== */
const shayariDB = {
  love: [
    "❤️ *Love Shayari:*\nतेरे बिना ये दिल लगता नहीं,\nतेरे बिना ये पल भी ढलता नहीं,\nतू दूर है तो क्या हुआ,\nतेरी यादें ही काफी हैं!",
    "💕 *Love Shayari:*\nमिलते हैं तो यूं लगता है,\nजैसे सदियों से जानते हैं,\nबिछड़ते हैं तो यूं लगता है,\nजैसे अब भी साथ रहते हैं!",
    "💖 *Love Shayari:*\nचेहरे पे मुस्कान हो तुम,\nदिल की धड़कन हो तुम,\nदूर रहकर भी पास हो तुम,\nमेरी जान हो तुम!",
    "💗 *Love Shayari:*\nतुमसे मिलकर लगा,\nकुछ कमी थी जीवन में,\nवो कमी तुमने पूरी कर दी,\nशायद इसी को कहते हैं मोहब्बत!"
  ],
  sad: [
    "😢 *Sad Shayari:*\nहम उनकी मोहब्बत में,\nखो से गए,\nउनकी एक मुस्कान के लिए,\nहम रो से गए!",
    "😭 *Sad Shayari:*\nवो मेरा नहीं तो क्या हुआ,\nमेरी चाहत तो है,\nवो किसी और का हो गया,\nमेरी मोहब्बत तो है!",
    "😥 *Sad Shayari:*\nरात के अंधेरे में,\nयाद तेरी आती है,\nतन्हाई में जलते हैं,\nआँखों से बरसात होती है!"
  ],
  fun: [
    "😂 *Fun Shayari:*\nज़िंदगी में मस्ती हो,\nदिल में खुशियों की बस्ती हो,\nहंसते रहो यूं ही हर पल,\nहर दिन ऐसी ही फ़िज़ा हो!",
    "🤣 *Fun Shayari:*\nदोस्तों के संग गुजरे पल,\nहर पल है खास,\nसाथ हो दोस्तों का तो,\nहर मुश्किल है आसान!",
    "😆 *Fun Shayari:*\nचाय की प्याली हो,\nबिस्कुट की टुकड़ी हो,\nदोस्त का साथ हो,\nतो क्या कमी हो!"
  ],
  angry: [
    "😡 *Angry Shayari:*\nगुस्सा भी तेरा प्यारा लगे,\nहर अदा तेरी न्यारी लगे,\nतू रूठे तो भी अच्छा लगे,\nतू माने तो दिल हारा लगे!",
    "🤬 *Angry Shayari:*\nतेरे गुस्से का भी,\nअलग ही अंदाज़ है,\nतू जब रूठती है,\nतो भी खास है!",
    "😠 *Angry Shayari:*\nगुस्सा तू कर ले,\nमैं तुझसे प्यार करूंगा,\nतू रूठ के देख,\nमैं मना लूंगा!"
  ]
};

/* ==================== GENDER PREFIX (FIXED) ==================== */
function addGenderPrefix(text, gender, firstName) {
  const name = (!firstName || firstName === "Unknown") ? "" : firstName;

  if (gender === "female") {
    return `👩 *${name || "जानू"}*,\n\n${text}`;
  } else if (gender === "male") {
    return `👨 *${name || "भाई"}*,\n\n${text}`;
  }
  return text;
}

/* ==================== EMOJI MAP ==================== */
const emojiMap = {
  '😂': 'fun', '🤣': 'fun', '😆': 'fun', '😁': 'fun', '😅': 'fun', '😹': 'fun',
  '❤️': 'love', '💕': 'love', '💗': 'love', '💓': 'love', '💖': 'love', '💘': 'love',
  '💞': 'love', '💝': 'love', '💟': 'love', '🥰': 'love', '😍': 'love', '😘': 'love',
  '😢': 'sad', '😭': 'sad', '🥺': 'sad', '😔': 'sad', '😞': 'sad', '😟': 'sad',
  '😡': 'angry', '🤬': 'angry', '👿': 'angry', '💢': 'angry', '😠': 'angry',
  '🔥': 'fun', '💯': 'fun', '⚡': 'fun', '💪': 'fun',
  '👍': 'like', '👎': 'like', '👌': 'like',
  '😎': 'cool', '🕶️': 'cool',
  '🤪': 'fun', '😜': 'fun', '😝': 'fun',
  '😪': 'sad', '😴': 'sad',
  '🙏': 'greet', '🤲': 'greet',
  '👋': 'greet', '✋': 'greet',
  '🎂': 'party', '🥳': 'party', '🎉': 'party',
  '🍕': 'food', '🍔': 'food', '🌭': 'food',
  '🥤': 'drink', '🍺': 'drink', '☕': 'tea',
  '🎮': 'game', '🕹️': 'game',
  '🐶': 'animal', '🐱': 'animal', '🐼': 'animal',
  '🌹': 'rose', '🌸': 'flower', '🌈': 'rainbow',
  '👻': 'fun', '💀': 'fun',
  '🎁': 'gift', '🎀': 'gift',
  '⚽': 'sports', '🏀': 'sports',
  '💃': 'dance', '🕺': 'dance',
  '📚': 'study', '📖': 'study',
  '🚀': 'fun', '✈️': 'fun',
  '👀': 'look', '👁️': 'look',
  '🤔': 'think', '🧐': 'think'
};

/* ==================== RUN (Status Command) ==================== */
module.exports.run = function ({ api, event }) {
  const { threadID } = event;
  const stats = initStats();

  const statusMsg =
    `🎉 *ULTIMATE MASTI BOT v9.1* 🎉\n\n` +
    `✅ *Status:* हमेशा ON\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📊 *TOTAL STATS:*\n` +
    `• Total Reactions: ${stats.totalReactions}\n` +
    `• Total Replies: ${stats.total}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `🎭 *REPLY TYPES:*\n` +
    `😂 Majak: ${stats.majak}\n` +
    `🥳 Masti: ${stats.masti}\n` +
    `😘 Flirt: ${stats.flirt}\n` +
    `💫 Shayri: ${stats.shayri}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👥 *GENDER STATS:*\n` +
    `👨 Male: ${stats.maleReplies}\n` +
    `👩 Female: ${stats.femaleReplies}\n` +
    `🤖 Unknown: ${stats.unknownReplies}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📝 *CATEGORY STATS:*\n` +
    `❤️ Love: ${stats.love}\n` +
    `😢 Sad: ${stats.sad}\n` +
    `😡 Angry: ${stats.angry}\n` +
    `🇮🇳 India: ${stats.india}\n` +
    `🌅 Greet: ${stats.greet}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `👑 *Credit:* SHAHADAT SAHU`;

  return api.sendMessage(statusMsg, threadID);
};

/* ==================== HANDLE EVENT ==================== */
module.exports.handleEvent = async function ({ api, event, Users }) {
  if (event.type !== "message") return;
  if (event.senderID === api.getCurrentUserID()) return;

  const msg = event.body || "";
  const threadID = event.threadID;
  const senderID = event.senderID;
  const msgLower = msg.toLowerCase();

  // Anti-loop check
  if (!loopGuard.check(api, event)) return;

  try {
    const stats = initStats();

    /* ----- Gender पहचानो ----- */
    const gender = await getUserGender(api, senderID);

    let userName = "Unknown";
    let firstName = "";
    try {
      if (Users?.getNameUser) {
        userName = await Users.getNameUser(senderID);
      } else {
        const info = await api.getUserInfo(senderID);
        userName = info[senderID]?.name || "Unknown";
      }
      firstName = (userName || "").split(" ")[0] || "";
    } catch {}

    if (gender === "female") stats.femaleReplies++;
    else if (gender === "male") stats.maleReplies++;
    else stats.unknownReplies++;

    /* ----- Category detect ----- */
    let detectedCategory = null;
    let reactionEmoji = null;

    const loveWords = ["love", "ilove", "labyu", "baby", "babe", "crush", "romantic", "प्यार", "मोहब्बत"];
    for (const word of loveWords) {
      if (msgLower.includes(word)) {
        detectedCategory = "love";
        reactionEmoji = "❤️";
        stats.love++;
        break;
      }
    }

    if (!detectedCategory) {
      const sadWords = ["sad", "sakit", "pain", "depress", "stress", "cry", "उदास", "दुख"];
      for (const word of sadWords) {
        if (msgLower.includes(word)) {
          detectedCategory = "sad";
          reactionEmoji = "😢";
          stats.sad++;
          break;
        }
      }
    }

    if (!detectedCategory) {
      const angryWords = ["fuck", "sex", "porn", "horn", "गुस्सा", "गाली"];
      for (const word of angryWords) {
        if (msgLower.includes(word)) {
          detectedCategory = "angry";
          reactionEmoji = "😡";
          stats.angry++;
          break;
        }
      }
    }

    if (!detectedCategory) {
      const indiaWords = ["india", "bharat", "hindustan", "भारत"];
      for (const word of indiaWords) {
        if (msgLower.includes(word) || msg.includes("🇮🇳")) {
          detectedCategory = "india";
          reactionEmoji = "🇮🇳";
          stats.india++;
          break;
        }
      }
    }

    if (!detectedCategory) {
      const greetWords = ["morning", "afternoon", "evening", "night", "good", "सुप्रभात"];
      for (const word of greetWords) {
        if (msgLower.includes(word)) {
          detectedCategory = "greet";
          reactionEmoji = "🌅";
          stats.greet++;
          break;
        }
      }
    }

    if (!detectedCategory) {
      const funWords = ["wow", "awesome", "robot", "fun", "joke", "मज़ाक"];
      for (const word of funWords) {
        if (msgLower.includes(word)) {
          detectedCategory = "fun";
          reactionEmoji = "😂";
          stats.masti++;
          break;
        }
      }
    }

    // Emoji से detect
    if (!detectedCategory) {
      for (const emoji in emojiMap) {
        if (msg.includes(emoji)) {
          detectedCategory = emojiMap[emoji];
          reactionEmoji = emoji;
          break;
        }
      }
    }

    // Reaction भेजो
    if (detectedCategory && reactionEmoji) {
      try {
        await api.setMessageReaction(reactionEmoji, event.messageID);
        stats.totalReactions++;
      } catch {}
    }

    // 50% chance reply (spam कम करने के लिए)
    if (detectedCategory && Math.random() < 0.5) {
      let replyMessage = "";
      let replyType = "masti";

      const useJoke = Math.random() < 0.7;
      const pool = useJoke ? jokesDB : shayariDB;

      replyMessage = pool[detectedCategory]?.[Math.floor(Math.random() * pool[detectedCategory].length)]
                   || jokesDB.general[Math.floor(Math.random() * jokesDB.general.length)];

      if (useJoke) {
        if (detectedCategory === "love") replyType = "flirt";
        else if (detectedCategory === "sad") replyType = "sad";
        else if (detectedCategory === "angry") replyType = "majak";
        else if (detectedCategory === "fun") replyType = "masti";
      } else {
        replyType = "shayri";
      }

      // Gender-based prefix
      replyMessage = addGenderPrefix(replyMessage, gender, firstName);

      if (replyType === "majak") stats.majak++;
      else if (replyType === "masti") stats.masti++;
      else if (replyType === "flirt") stats.flirt++;
      else if (replyType === "shayri") stats.shayri++;

      stats.total++;

      // Random delay 1.5 - 4 sec (bot जैसा न लगे)
      const delay = 1500 + Math.random() * 2500;
      setTimeout(() => {
        api.sendMessage(replyMessage, threadID).catch(() => {});
      }, delay);
    }

  } catch (error) {
    console.log("[MASTI v9.1] Error:", error.message);
  }
};