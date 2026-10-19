const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const apiList = "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

const GENDER_FILE = path.join(__dirname, "cache", "gender.json");

/* ---------- Gender File Helpers ---------- */
function loadGender() {
  try {
    return fs.existsSync(GENDER_FILE)
      ? JSON.parse(fs.readFileSync(GENDER_FILE, "utf8"))
      : {};
  } catch {
    return {};
  }
}

function saveGender(data) {
  try {
    fs.ensureDirSync(path.dirname(GENDER_FILE));
    fs.writeFileSync(GENDER_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("[GENDER SAVE]", e.message);
  }
}

const getMainAPI = async () => (await axios.get(apiList)).data.simsimi;

/* ---------- Name-Based Gender Detection ---------- */
const FEMALE_KEYWORDS = [
  "akter", "akhtar", "begum", "bibi", "khatun", "khanam",
  "sultana", "banu", "bano", "parvin", "parveen", "yasmin",
  "nasrin", "nusrat", "sabina", "sabrina", "shirin",
  "priya", "pooja", "puja", "neha", "sneha", "riya",
  "diya", "siya", "kiya", "niya", "jiya", "piya", "tiya",
  "anjali", "anju", "asha", "bharti", "bhavna",
  "chandni", "deepa", "divya", "gita", "geeta", "hema",
  "isha", "jaya", "kavita", "kiran", "komal", "lakshmi",
  "lata", "madhuri", "meena", "mina", "naina", "nisha",
  "pallavi", "payal", "preeti", "preity", "rachana", "radha",
  "rani", "rashmi", "rekha", "renu", "resma", "reshma",
  "sadhana", "sangeeta", "sangita", "sapna", "saroj",
  "shanti", "sharda", "sheela", "shila", "shobha", "shweta",
  "sonal", "sonia", "soniya", "sunita", "sushma", "swati",
  "tara", "tulsi", "uma", "usha", "veena", "vina",
  "vidya", "yashoda", "zara", "zoya", "fatima", "aisha",
  "ayesha", "mariam", "maryam", "sana", "saba", "sara",
  "sarah", "noor", "nur", "laila", "layla", "maya",
  "ritu", "ritika", "kritika", "anita", "amrita", "arpita",
  "aarti", "arti", "jyoti", "jyotsna", "khushi", "khushboo",
  "muskan", "mehak", "mahak", "nazia", "shabnam", "shabana",
  "farhana", "farzana", "ruksana", "rukhsana", "taslima",
  "sharmin", "sharmila", "jannat", "jannatul", "maria",
  "mim", "momo", "mita", "mitu", "tania", "taniya",
  "tisha", "tithi", "urmi", "urmila", "sathi", "shathi",
  "sumi", "sumaiya", "nipa", "nupur", "sraboni",
  "srabanti", "raya", "raisa", "rhea", "ria", "rupa",
  "rupsa", "shipra", "shrabani", "soma", "sonali",
  "sukhi", "sushmita", "swapna", "tanjila", "tanni", "trisha",
  "tuli", "tumpa", "tuya", "urfi", "vabna", "varsha",
  "dipika", "ipsita", "ishita", "jhilik", "jhumur",
  "kakoli", "kali", "kanika", "karishma", "kashish",
  "kavya", "laboni", "lina", "lisa", "liza",
  "madhu", "madhabi", "malati", "maliha", "manisha",
  "meghna", "meher", "mitali", "mohini", "moumita",
  "mousumi", "mukta", "nabanita", "nadira", "nandita",
  "nasima", "nazma", "neelam", "nibedita", "nilima",
  "nirmala", "parul", "papiya", "pratima",
  "prema", "purnima", "ratna", "reba", "rina", "rita",
  "ruma", "sabana", "sabita", "sagarika",
  "sakina", "salma", "samira", "sanjida", "santana",
  "seema", "shima", "shova", "simran", "sohagi",
  "sonam", "suborna", "suchitra", "sudipta",
  "sujata", "sukla", "sunanda", "suparna", "susmita",
  "tanushree", "tripti", "vandana",
  "vidushi", "yashmin", "zarin", "zeba"
];

const MALE_KEYWORDS = [
  "khan", "mia", "miah", "sheikh", "shekh", "sahu", "sahad",
  "shahadat", "shahid", "sajid", "sajib", "sabbir",
  "sohel", "sohail", "sohag", "sohan", "sourav",
  "saurav", "sagar", "sagor", "sakib", "sakin", "salauddin",
  "salim", "selim", "samim", "samin", "samiul", "sanju",
  "saqib", "sarwar", "sayed", "sayeed", "sayem", "shafin",
  "shafiq", "shahin", "shakib", "shamim", "shanto",
  "sharif", "shihab", "shimul", "shipon", "shishir",
  "sojib", "soumitra", "subir", "sudip", "sujon",
  "sumon", "sunny", "surjo", "sushil", "tanvir",
  "tareq", "tarik", "tawhid", "tonmoy", "tuhin",
  "tushar", "utsho", "wahid", "wasim", "yasin",
  "zahid", "zakir", "zaman", "zubair", "zunaid",
  "abir", "adnan", "ahad", "ahmed", "ahsan", "akash",
  "akib", "alam", "alamin", "alif", "amin", "aminul",
  "amir", "anik", "anis", "arafat", "arif",
  "ariful", "arnob", "asad", "asadul", "ashik", "ashraf",
  "asif", "asik", "atif", "ayan", "ayon", "azad",
  "aziz", "badhon", "bijoy", "bikash", "billal",
  "biplob", "bishal", "bishwajit", "chandan", "dipu",
  "dip", "dihan", "emon", "erfan", "farhan", "fahim",
  "faisal", "faiz", "farhad", "farid", "firoz", "foyez",
  "habib", "hasan", "hasib", "hridoy", "imran", "iqbal",
  "irfan", "islam", "ismail", "jahid", "jamal", "jasim",
  "jibon", "joy", "jubayer", "kamal", "kamrul",
  "kawsar", "kazi", "khaled", "liton", "mahadi",
  "mahbub", "mahin", "mahir", "mamun", "masud",
  "mehedi", "miraj", "mizan", "mohammad", "mohsin",
  "monir", "mostafa", "motiur", "mozammel", "mubin",
  "mukul", "munna", "mushfiq", "mustafa", "nadim",
  "naim", "nazmul", "nazim", "nayeem", "nayan",
  "noman", "nurul", "omar", "omur", "osman", "rafi",
  "rafid", "rafiq", "rahim", "rakib", "rakin",
  "rakibul", "ramim", "rana", "rasel", "rashid",
  "rayhan", "razib", "redwan", "rehan", "riad",
  "rifat", "riyad", "robi", "robin", "rony", "roky",
  "rubel", "rumi", "ruhul", "sadat",
  "shahriar", "shahrier", "siam", "sifat", "sihab",
  "tahsin", "tanim", "tanzim", "tonoy",
  "raj", "raju", "ravi", "ravinder",
  "rohit", "rahul", "rajesh", "rakesh", "ramesh",
  "suresh", "mahesh", "ganesh", "mukesh", "naresh",
  "amit", "sumit", "ajit", "ranjit", "sanjay",
  "vijay", "ajay", "arjun", "karan", "varun",
  "tarun", "rohan", "mohan", "ram", "shyam",
  "hari", "krishna", "shiv",
  "kabir", "vivek", "vivekanand", "manish",
  "munish", "harish", "girish", "satish",
  "monoj", "pran", "prabir", "pradip",
  "prasenjit", "pritam", "priyam", "prithvi",
  "prosenjit", "ratul", "sabyasachi", "sajal",
  "sandeep", "sandip", "sanjib", "santanu", "sarthak",
  "saurabh", "shib", "shibam", "shibham",
  "shivam", "shubham", "subham", "sourabh",
  "souvik", "subho", "sudhanshu",
  "sumanta", "suraj", "surojit", "sushant",
  "soumen", "soumya", "soumyajit"
];

function guessGenderFromName(name) {
  if (!name) return "unknown";

  const lower = name.toLowerCase();
  const words = lower.split(/[\s_.-]+/);

  // Pehle exact match
  for (const word of words) {
    if (FEMALE_KEYWORDS.includes(word)) return "female";
    if (MALE_KEYWORDS.includes(word)) return "male";
  }

  // Phir partial match
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

module.exports.config = {
  name: "autoreplybot",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};

/* ---------- Main Event ---------- */
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  /* ----- Gender check with cache ----- */
  const genderDB = loadGender();
  let userGender = genderDB[senderID];

  if (!userGender) {
    try {
      const info = await api.getUserInfo(senderID);
      const name = info[senderID]?.name || "";
      userGender = guessGenderFromName(name);
      genderDB[senderID] = userGender;
      saveGender(genderDB);
    } catch {
      userGender = "unknown";
    }
  }

  const responses = {
    "miss you": {
      male: "किसी और को Miss मत कर भाई, आजा बॉस साहू से मिला दूँ 😎",
      female: "अरे Miss क्यों कर रही हो, सीधे बॉस साहू के इनबॉक्स में मैसेज करो 😘"
    },
    "miss u too": {
      male: "हम्म भाई, हम भी तुझे Miss करते हैं 😄",
      female: "हम भी Miss करते हैं... पर बॉस साहू सबसे ज़्यादा 😏💖"
    },
    "kiss de": {
      male: "भाई किस किस करता है, मुँह धो पहले 🤬",
      female: "किस देना? पहले ब्रश कर लो, कितने दिन से नहीं किया 🤬"
    },
    "hi": {
      male: "हेलो भाई, कैसा है..!😜🫵",
      female: "इतना हाय-हेलो क्यों करती हो जानू..!😜💕"
    },
    "bc": {
      male: "अपने मुँह में देख, जो बोला वो तुझे ही लगा 😊",
      female: "मुँह साफ़ रखा करो, अच्छी लगती नहीं 😌"
    },
    "pro": {
      male: "खुद को क्या Legend समझता है 😂",
      female: "खुद को क्या Legend समझती है 😂"
    },
    "good morning": {
      male: "GOOD MORNING भाई, ब्रश करके नाश्ता कर लेना 😚",
      female: "GOOD MORNING जानू, ब्रश करके नाश्ता कर लेना 😚💖"
    },
    "good night": {
      male: "Good night भाई, Sweet Dream 😴",
      female: "Sweet Dream जानू… पर पहले बॉस साहू को GN बोल देना 😏💤"
    },
    "ball": {
      male: "~ अभी तक तेरी बॉल नहीं उठी क्या?? 🤖",
      female: "~ ये सब लड़कियों के लिए नहीं होता जानू 🤭"
    },
    "rishi": {
      male: "वो अभी बिज़ी हैं भाई, कुछ काम है तो बताओ 😎",
      female: "वो अभी बिज़ी हैं जानू, कुछ कहना हो तो मुझे बता सकती हो..!😘"
    },
    "owner": {
      male: "‎[𝐎𝐖𝐍𝐄𝐑:☞ Rishikesh ☜\nFacebook: https://m.me/hello.baby1222\nInstagram: https://www.instagram.com/rishu2328648?rpxt=amtxZ3hpa2czZGJp",
      female: "‎[𝐎𝐖𝐍𝐄𝐑:☞ Rishikesh ☜\nFacebook: https://m.me/hello.baby1222\nInstagaram: +https://www.instagram.com/rishu2328648?rpxt=amtxZ3hpa2czZGJp"
    },
    "admin": {
      male: "वो SHAHADAT SAHU हैं भाई, सब Admin SAHU कहते हैं 😎",
      female: "वो SHAHADAT SAHU हैं जानू, सब Admin SAHU कहते हैं 😘☺️"
    },
    "babi": {
      male: "भाई ये बाबी-शाबी तेरे लिए नहीं 🤣",
      female: "ये तो हसीना है, मेरे दिल की दरकन है, मेरी जान है 😍"
    },
    "chup": {
      male: "तू चुप चुप कर पगले छगले 😏",
      female: "अच्छा अच्छा जानू, चुप हो गया 🤭"
    },
    "assalamualaikum": {
      male: "Walaikumassalam भाई ❤️‍🩹",
      female: "Walaikumassalam जानू ❤️‍🩹"
    },
    "kiss me": {
      male: "भाई तू पोंचा है, तुझे किस नहीं दूँगा 🤭",
      female: "तुम पोंची हो, तुम्हें किस नहीं दूँगा 🤭"
    },
    "thanks": {
      male: "इतना धन्यवाद न दे भाई, अपनी गर्लफ्रेंड दे दे..!🐸🥵",
      female: "धन्यवाद कहने की ज़रूरत नहीं जानू 💖"
    },
    "i love you": {
      male: "भाई-भाई में प्यार नहीं होता, बॉस साहू से मिला दूँ? 😂",
      female: "लड़की हो तो अभी बॉस साहू के इनबॉक्स में मैसेज कर दो 🫢😻"
    },
    "love you": {
      male: "भाई अपनी भाभी को बोल, मुझे क्यों 😏",
      female: "प्यार करना है तो सीधे बॉस साहू को बोल जानू 😘"
    },
    "by": {
      male: "किरे तू कहाँ जा रहा है, किस लड़की के साथ भागेगा..!🌚🌶️",
      female: "कहाँ जा रही हो जानू, थोड़ी देर और बात करो 🥺"
    },
    "ami shahadat": {
      male: "हाँ बॉस, कैसे हो..?☺️",
      female: "हाँ बॉस, कैसी हो..?☺️"
    },
    "bot er baccha": {
      male: "मेरा बच्चा तो तेरी गर्लफ्रेंड के पेट में..!!🌚⛏️",
      female: "ऐसी बात लड़कियों को शोभा नहीं देती जानू 🤭"
    },
    "tor nam ki": {
      male: "MY NAME IS ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭💖",
      female: "MY NAME IS ─꯭─⃝‌‌𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭💖"
    },
    "pic de": {
      male: "यहाँ से हट भाई, दूर जाकर मर 😒",
      female: "अभी नहीं जानू, थोड़ी देर बाद 💕"
    },
    "cudi": {
      male: "इतना चोदा-चुदी क्यों करता है..!🥱🌝🌚",
      female: "ये सब लड़कियों को नहीं बोलना जानू 🙄"
    },
    "heda": {
      male: "भाई इतना गुस्सा शरीर के लिए अच्छा नहीं 🥰",
      female: "जानू इतना गुस्सा अच्छा नहीं लगता 🥰"
    },
    "lol": {
      male: "भाई तू इतना मत हँस..!🌚🤣",
      female: "जानू इतना मत हँसो, शर्म आती है 🤭"
    },
    "kire ki koros": {
      male: "भाई तेरे बारे में सोच रहा हूँ 😄",
      female: "तेरे बारे में सोच रहा हूँ जानू 😚"
    },
    "ki koros": {
      male: "बॉस साहू के साथ काम में बिज़ी हूँ 😏",
      female: "बॉस साहू के साथ प्यार में बिज़ी हूँ 😏💘"
    },
    "kire bot": {
      male: "हाँ भाई, कैसा है..? 😎",
      female: "हाँ जानू, कैसी हो..? 😘😽🙈"
    },
    "valo aso": {
      male: "हाँ भाई, बॉस साहू की दुआ से ठीक हूँ 😌",
      female: "हाँ रे प्यारे, बॉस साहू की दुआ से ठीक हूँ 😌💞"
    },
    "pagol": {
      male: "हाँ पागल हूँ, पर तेरा पागल 😏😂",
      female: "हाँ पागल हूँ, पर तेरा पागल 😏😂"
    },
    "breakup": {
      male: "चिंता मत कर भाई… साहू बॉस तो हैं ही, तुझे नया वाला दिला देंगे 😎🔥",
      female: "चिंता मत कर जानू… साहू बॉस तो हैं ही, तुझे नया वाला दिला देंगे 😎🔥"
    },
    "tui ke": {
      male: "मैं तेरे बॉस साहू का ChatBot हूँ 😏",
      female: "मैं तेरे बॉस साहू का ChatBot हूँ 😏"
    },
    "umm": {
      male: "इतना Umm क्यों भाई… कुछ बोल 😉",
      female: "इतना Umm क्यों जानू… कुछ बोलोगे? 😉"
    },
    "hmm": {
      male: "Hmmm किस बात का हम्म भाई 🥵",
      female: "Hmmm किस बात का हम्म जानू 🥵"
    },
    "lovely": {
      male: "प्यार करना है तो सीधे बॉस साहू को बोल भाई 😻🔥",
      female: "प्यार करना है तो सीधे बॉस साहू को बोल जानू 😻🔥"
    },

    /* ---------- 🆕 New Fun Lines ---------- */
    "single": {
      male: "सिंगल हो? कोई बात नहीं भाई, साहू बॉस भी सिंगल हैं 😂",
      female: "सिंगल हो? चलो बॉस साहू से सेटिंग करा दूँ 😏💘"
    },
    "gf": {
      male: "गर्लफ्रेंड चाहिए? पहले अपना चेहरा तो दिखा भाई 😂",
      female: "तू खुद ही GF बन जा, बॉस साहू खुश हो जाएँगे 😏"
    },
    "bf": {
      male: "बॉयफ्रेंड? पहले मुझे पूछ ले भाई 😎",
      female: "बॉयफ्रेंड चाहिए? साहू बॉस सिंगल हैं जानू 😻"
    },
    "gali": {
      male: "गाली मत दे भाई, मुँह खराब हो जाएगा 🤬",
      female: "जानू गाली अच्छी नहीं लगती 🙄💔"
    },
    "attitude": {
      male: "अटीट्यूड दिखाने से कुछ नहीं मिलेगा भाई 😏",
      female: "अटीट्यूड वाली लड़कियाँ बॉस साहू को पसंद हैं 😏💕"
    },
    "padhai": {
      male: "पढ़ाई कर भाई, वरना बॉस साहू से पीछे रह जाएगा 📚",
      female: "पढ़ाई कर जानू, साहू बॉस टॉपर हैं 📚💖"
    },
    "khana": {
      male: "खाना खा ले भाई, भूखे मत रह 🍚",
      female: "खाना खा ले जानू, तेरी सेहत का ख्याल रख 🍚💖"
    },
    "biryani": {
      male: "बिरयानी खानी है? चल साहू बॉस के साथ चल 🍛",
      female: "बिरयानी खानी है? साहू बॉस की ट्रीट ले ले जानू 🍛💕"
    },
    "chocolate": {
      male: "चॉकलेट चाहिए? पहले प्यार तो बताओ भाई 🍫",
      female: "चॉकलेट चाहिए? बॉस साहू से माँग ले जानू 🍫💖"
    },
    "shadi": {
      male: "शादी की उम्र हो गई भाई? 😂",
      female: "शादी करनी है? साहू बॉस सिंगल हैं जानू 😏💘"
    },
    "pyar": {
      male: "प्यार में पड़ना है? सोच समझ कर भाई 💔",
      female: "प्यार करना है? सीधे बॉस साहू को बोल जानू 😻"
    },
    "dil": {
      male: "दिल दे दिया क्या किसी को? 😏",
      female: "दिल दे दिया क्या साहू बॉस को? 😏💖"
    },
    "ok": {
      male: "ठीक है भाई 👍",
      female: "ठीक है जानू 💕"
    },
    "acha": {
      male: "अच्छा भाई, बताओ और क्या? 😊",
      female: "अच्छा जानू, बताओ और क्या? 😊💖"
    },
    "haan": {
      male: "हाँ भाई, बोल 😎",
      female: "हाँ जानू, बोलो 💕"
    },
    "nahi": {
      male: "नहीं क्यों भाई? कुछ तो बात है 😏",
      female: "नहीं क्यों जानू? कुछ तो बात है 💭"
    }
  };

  const entry = responses[msg];
  if (!entry) return;

  let replyText;

  if (userGender === "male") {
    replyText = entry.male;
  } else if (userGender === "female") {
    replyText = entry.female;
  } else {
    // Gender पता नहीं चला तो दोनों reply भेजो
    replyText = entry.male + "\n\n" + entry.female;
  }

  if (!global.client.handleReply) global.client.handleReply = [];

  return api.sendMessage(
    replyText,
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "sahu"
      });
    },
    messageID
  );
};

/* ---------- Handle Reply ---------- */
module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  try {
    const text = event.body.trim();

    const base = await getMainAPI();
    const link = `${base}/simsimi?text=${encodeURIComponent(text)}`;

    const res = await axios.get(link);

    const reply = Array.isArray(res.data.response)
      ? res.data.response[0]
      : res.data.response;

    if (!global.client.handleReply) global.client.handleReply = [];

    return api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "sahu"
        });
      },
      event.messageID
    );

  } catch {
    return api.sendMessage("🙂 थोड़ी देर बाद फिर बोलो", event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({ api, event });
};