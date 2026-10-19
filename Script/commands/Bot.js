const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const apiList = "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";
const GENDER_FILE = path.join(__dirname, "cache", "gender.json");

const getMainAPI = async () => (await axios.get(apiList)).data.simsimi;

/* ---------- Gender File Helpers ---------- */
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

/* ---------- Name-Based Gender Detection ---------- */
const FEMALE_KEYWORDS = [
  "akter","akhtar","begum","bibi","khatun","khanam","sultana","banu","bano",
  "parvin","parveen","yasmin","nasrin","nusrat","sabina","sabrina","shirin",
  "priya","pooja","puja","neha","sneha","riya","diya","siya","kiya","niya",
  "jiya","piya","tiya","anjali","anju","asha","bharti","bhavna","chandni",
  "deepa","divya","gita","geeta","hema","isha","jaya","kavita","kiran",
  "komal","lakshmi","lata","madhuri","meena","mina","naina","nisha","pallavi",
  "payal","preeti","preity","rachana","radha","rani","rashmi","rekha","renu",
  "resma","reshma","sadhana","sangeeta","sangita","sapna","saroj","shanti",
  "sharda","sheela","shila","shobha","shweta","sonal","sonia","soniya",
  "sunita","sushma","swati","tara","tulsi","uma","usha","veena","vina",
  "vidya","yashoda","zara","zoya","fatima","aisha","ayesha","mariam","maryam",
  "sana","saba","sara","sarah","noor","nur","laila","layla","maya","ritu",
  "ritika","kritika","anita","amrita","arpita","aarti","arti","jyoti",
  "jyotsna","khushi","khushboo","muskan","mehak","mahak","nazia","shabnam",
  "shabana","farhana","farzana","ruksana","rukhsana","taslima","sharmin",
  "sharmila","jannat","jannatul","maria","mim","momo","mita","mitu","tania",
  "taniya","tisha","tithi","urmi","urmila","sathi","shathi","sumi","sumaiya",
  "nipa","nupur","sraboni","srabanti","raya","raisa","rhea","ria","rupa",
  "rupsa","shipra","shrabani","soma","sonali","sukhi","sushmita","swapna",
  "tanjila","tanni","trisha","tuli","tumpa","tuya","urfi","vabna","varsha",
  "dipika","ipsita","ishita","jhilik","jhumur","kakoli","kali","kanika",
  "karishma","kashish","kavya","laboni","lina","lisa","liza","madhu",
  "madhabi","malati","maliha","manisha","meghna","meher","mitali","mohini",
  "moumita","mousumi","mukta","nabanita","nadira","nandita","nasima","nazma",
  "neelam","nibedita","nilima","nirmala","parul","papiya","pratima","prema",
  "purnima","ratna","reba","rina","rita","ruma","sabana","sabita","sagarika",
  "sakina","salma","samira","sanjida","santana","seema","shima","shova",
  "simran","sohagi","sonam","suborna","suchitra","sudipta","sujata","sukla",
  "sunanda","suparna","susmita","tanushree","tripti","vandana","vidushi",
  "yashmin","zarin","zeba"
];

const MALE_KEYWORDS = [
  "khan","mia","miah","sheikh","shekh","sahu","sahad","shahadat","shahid",
  "sajid","sajib","sabbir","sohel","sohail","sohag","sohan","sourav","saurav",
  "sagar","sagor","sakib","sakin","salauddin","salim","selim","samim","samin",
  "samiul","sanju","saqib","sarwar","sayed","sayeed","sayem","shafin","shafiq",
  "shahin","shakib","shamim","shanto","sharif","shihab","shimul","shipon",
  "shishir","sojib","soumitra","subir","sudip","sujon","sumon","sunny",
  "surjo","sushil","tanvir","tareq","tarik","tawhid","tonmoy","tuhin","tushar",
  "utsho","wahid","wasim","yasin","zahid","zakir","zaman","zubair","zunaid",
  "abir","adnan","ahad","ahmed","ahsan","akash","akib","alam","alamin","alif",
  "amin","aminul","amir","anik","anis","arafat","arif","ariful","arnob","asad",
  "asadul","ashik","ashraf","asif","asik","atif","ayan","ayon","azad","aziz",
  "badhon","bijoy","bikash","billal","biplob","bishal","bishwajit","chandan",
  "dipu","dip","dihan","emon","erfan","farhan","fahim","faisal","faiz",
  "farhad","farid","firoz","foyez","habib","hasan","hasib","hridoy","imran",
  "iqbal","irfan","islam","ismail","jahid","jamal","jasim","jibon","joy",
  "jubayer","kamal","kamrul","kawsar","kazi","khaled","liton","mahadi",
  "mahbub","mahin","mahir","mamun","masud","mehedi","miraj","mizan","mohammad",
  "mohsin","monir","mostafa","motiur","mozammel","mubin","mukul","munna",
  "mushfiq","mustafa","nadim","naim","nazmul","nazim","nayeem","nayan",
  "noman","nurul","omar","omur","osman","rafi","rafid","rafiq","rahim","rakib",
  "rakin","rakibul","ramim","rana","rasel","rashid","rayhan","razib","redwan",
  "rehan","riad","rifat","riyad","robi","robin","rony","roky","rubel","rumi",
  "ruhul","sadat","shahriar","shahrier","siam","sifat","sihab","tahsin",
  "tanim","tanzim","tonoy","raj","raju","ravi","ravinder","rohit","rahul",
  "rajesh","rakesh","ramesh","suresh","mahesh","ganesh","mukesh","naresh",
  "amit","sumit","ajit","ranjit","sanjay","vijay","ajay","arjun","karan",
  "varun","tarun","rohan","mohan","ram","shyam","hari","krishna","shiv",
  "kabir","vivek","vivekanand","manish","munish","harish","girish","satish",
  "monoj","pran","prabir","pradip","prasenjit","pritam","priyam","prithvi",
  "prosenjit","ratul","sabyasachi","sajal","sandeep","sandip","sanjib",
  "santanu","sarthak","saurabh","shib","shibam","shibham","shivam","shubham",
  "subham","sourabh","souvik","subho","sudhanshu","sumanta","suraj","surojit",
  "sushant","soumen","soumya","soumyajit"
];

function guessGenderFromName(name) {
  if (!name) return "unknown";
  const lower = name.toLowerCase();
  const words = lower.split(/[\s_.-]+/);

  // Exact match पहले
  for (const word of words) {
    if (FEMALE_KEYWORDS.includes(word)) return "female";
    if (MALE_KEYWORDS.includes(word)) return "male";
  }

  // Partial match बाद में
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

/* ---------- Gender Cache Helper ---------- */
async function getUserGender(api, senderID) {
  const genderDB = loadGender();
  let gender = genderDB[senderID];

  if (!gender) {
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

module.exports.config = {
  name: "baby",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ULLASH (Hindi + Gender Update by SHAHADAT SAHU)",
  description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
  commandCategory: "Chat",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: true
};

const babyLoopGuard = {
  settings: {
    rapidGapMs: 3000,
    maxRapidChain: 5,
    windowMs: 30 * 1000,
    maxTriggersInWindow: 9,
    suspectAfter: 4,
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
        lastNoticeAt: 0,
        senderFastStreak: new Map(),
        suspectedBots: new Map()
      };
      this.threads.set(threadID, st);
    }
    return st;
  },

  isTrigger(text) {
    return /^(baby|bot|bby|jan|xan|জান|বট|বেবি)(\s|$)/i.test(text);
  },

  check(api, event, isBabyTrigger) {
    const now = Date.now();
    const threadID = event.threadID;
    const senderID = String(event.senderID || "");
    const st = this.getThread(threadID);

    try {
      if (senderID && senderID === String(api.getCurrentUserID())) return false;
    } catch {}

    if (st.pausedUntil) {
      if (now < st.pausedUntil) return false;
      st.pausedUntil = 0;
      st.rapidChain = 0;
      st.triggerTimes = [];
    }

    const prevSuspect = st.suspectedBots.get(senderID);
    if (prevSuspect && now - prevSuspect >= this.settings.muteMs) {
      st.suspectedBots.delete(senderID);
      st.senderFastStreak.set(senderID, 0);
    }

    if (isBabyTrigger) {
      const gap = st.lastTriggerAt ? now - st.lastTriggerAt : Infinity;
      st.lastTriggerAt = now;

      if (gap < this.settings.rapidGapMs) {
        st.rapidChain++;
        const streak = (st.senderFastStreak.get(senderID) || 0) + 1;
        st.senderFastStreak.set(senderID, streak);
        if (streak >= this.settings.suspectAfter) st.suspectedBots.set(senderID, now);
      } else {
        st.rapidChain = 0;
        st.senderFastStreak.set(senderID, 0);
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
            `इस ग्रुप में दो bot-ओं के बीच automated reply chain पकड़ी गई। Spam रोकने के लिए baby का automated reply ${mins} मिनट के लिए बंद कर दिया गया।\n` +
            `(किसी को ban/kick नहीं किया गया — manual command और बाकी features सामान्य रूप से काम करेंगे।)`,
            threadID
          );
        }
        return false;
      }
    }

    if (st.suspectedBots.has(senderID)) return false;

    return true;
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const rawQuery = args.join(" ");
    const query = rawQuery.toLowerCase();
    const simsim = await getMainAPI();

    if (!query) {
      const gender = await getUserGender(api, uid);
      const ran =
        gender === "female" ? ["बोलो बेबी", "हम्म जानू"] :
        gender === "male" ? ["बोलो भाई", "हम्म बोल"] :
        ["बोलो बेबी", "हम्म"];

      const r = ran[Math.floor(Math.random() * ran.length)];
      return api.sendMessage(r, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      });
    }

    const command = args[0].toLowerCase();

    if (["remove", "rm"].includes(command)) {
      const parts = rawQuery.replace(/^(remove|rm)\s*/i, "").split(" - ");
      if (parts.length < 2) return api.sendMessage("Use: remove [Question] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "list") {
      const res = await axios.get(`${simsim}/list`);
      if (res.data.code === 200) {
        return api.sendMessage(
          `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\nDeveloper: ${res.data.author}`,
          event.threadID, event.messageID
        );
      } else return api.sendMessage(`Error: ${res.data.message}`, event.threadID, event.messageID);
    }

    if (command === "edit") {
      const parts = rawQuery.replace(/^edit\s*/i, "").split(" - ");
      if (parts.length < 3) return api.sendMessage("Use: edit [Q] - [Old] - [New]", event.threadID, event.messageID);
      const [ask, oldReply, newReply] = parts.map(p => p.trim());
      const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    if (command === "teach") {
      const parts = rawQuery.replace(/^teach\s*/i, "").split(" - ");
      if (parts.length < 2) return api.sendMessage("Use: teach [Q] - [Reply]", event.threadID, event.messageID);
      const [ask, ans] = parts.map(p => p.trim());
      const groupID = event.threadID;
      let groupName = event.threadName ? event.threadName : "";
      try {
        if (!groupName && groupID != uid) {
          const threadInfo = await api.getThreadInfo(groupID);
          if (threadInfo?.threadName) groupName = threadInfo.threadName;
        }
      } catch {}

      let teachUrl = `${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}&groupID=${encodeURIComponent(groupID)}`;
      if (groupName) teachUrl += `&groupName=${encodeURIComponent(groupName)}`;
      const res = await axios.get(teachUrl);
      return api.sendMessage(res.data.message, event.threadID, event.messageID);
    }

    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
    const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

    for (const rep of replies) {
      await new Promise(resolve => {
        api.sendMessage(rep, event.threadID, (err, info) => {
          if (!err) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }

  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, Users, handleReply }) {
  try {
    const senderName = await Users.getNameUser(event.senderID);
    const replyText = event.body ? event.body.toLowerCase() : "";
    if (!replyText) return;

    if (!babyLoopGuard.check(api, event, true)) return;

    const simsim = await getMainAPI();
    const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);
    const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

    for (const rep of replies) {
      await new Promise(resolve => {
        api.sendMessage(rep, event.threadID, (err, info) => {
          if (!err) {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "simsimi"
            });
          }
          resolve();
        }, event.messageID);
      });
    }

  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    if (!babyLoopGuard.check(api, event, babyLoopGuard.isTrigger(raw))) return;

    const senderName = await Users.getNameUser(event.senderID);
    const senderID = event.senderID;
    const simsim = await getMainAPI();

    /* ----- Gender पहचानो ----- */
    const gender = await getUserGender(api, senderID);

    /* ---------- Greetings Male (भाई वाले) ---------- */
    const greetingsMale = [
      "अरे भाई, इतना bot bot क्यों करता है? 😒",
      "भाई मैं पागलों से बात नहीं करता 😏",
      "इतना मत बुला भाई, प्यार में पड़ जाऊँगा 🙈",
      "बोलो भाई, क्या चाहिए? 😎",
      "बार-बार बुलाएगा तो सिर गर्म हो जाएगा भाई 😑",
      "हाँ बोल भाई 😒, क्या कर सकता हूँ तेरे लिए?",
      "भाई इतना क्यों बुला रहा है, गाली सुननी है क्या 🤬",
      "हट बेड़ा 😾, Boss बोल बॉस 😼",
      "चुप रह भाई, वरना दाँत तोड़ दूँगा 😾",
      "भाई लड़की हो तो बॉस ऋषिकेश के इनबॉक्स में चली जा 🌚😂 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : https://m.me/hello.baby1222",
      "मुझे bot न बोल भाई, बॉस ऋषिकेश को जानू बोल 😘",
      "अरे भाई, बॉस ऋषिकेश के साथ बिज़ी हूँ 😋",
      "भाई इतना क्यों बुलाता है 🤬",
      "मुझे इतना मत बुला भाई, mood नहीं है 😒",
      "दूर जा भाई, तेरा कोई काम नहीं 😉🤣",
      "भाई, बॉस ऋषिकेश के साथ बिज़ी हूँ 😒",
      "बोल भाई क्या बोलेगा, सबके सामने बोलेगा 🤭",
      "कल मिलना तो एक बार भाई 😈",
      "हाँ बोल भाई, सुन रहा हूँ 😏",
      "हम्म बोल भाई क्या बोलेगा 😒",
      "बोल भाई, क्या कर सकता हूँ तेरे लिए 😎",
      "मैं तो अंधा हूँ भाई, कुछ देखता नहीं 🐸😎",
      "भाई, बॉस साहू के साथ बिज़ी हूँ 😒",
      "जंग हंगा करेगा भाई 😒😬",
      "राधे कृष्णा हरे कृष्णा राधे राधे🥰",
      "भाई सीधे बॉस ऋषिकेश के इनबॉक्स में जा 🙊😘🤣",
      "भाई बॉस ऋषिकेश को GF दिला दे 🙄",
      "भाई इतना क्यों बुला रहा, प्यार-व्यार करता है 🤭",
      "🌻🌺💚-राधे कृष्णा हरे कृष्णा राधे राधे-💚🌺🌻",
      "भाई मैं बॉस ऋषिकेश के साथ बिज़ी हूँ 🤝🌻",
      "भाई मुझे मत बुला, बॉस ऋषिकेश को GF दिला 😽🫶",
      "उफ़ भाई, समझ नहीं आया इतना क्यों बुला रहा 😤",
      "भाई मन ठीक नहीं है, मत बुला 😪🤧",
      "सपना भाई तुझे लेकर देखना चाहता हूँ 😂",
      "भाई सीधे बॉस साहू के पास जा 🙊😝",
      "इस्स भाई इतना बुलाते हो, शर्म आती है 🙈🌼",
      "भाई मेरे बॉस ऋषिकेश की तरफ से ढेर सारा प्यार 🥰",
      "भाई प्यार नाम की पागलपंती छोड़ दे 🙊🥱",
      "भाई मेरा जान तू सिर्फ मेरा (भाई वाला 😂) 💝",
      "भाई मेरे बॉस ऋषिकेश से शादी करेगा 🙊😘",
      "भाई चुम्मा देगा 🙄🐸😘",
      "भाई आज प्रपोज़ करके देख 😌🤗",
      "क्या बात है भाई, ससुराल नहीं जा रहे 🤔🥱",
      "भाई सीधे बॉस ऋषिकेश के इनबॉक्स में जा 😏🐸",
      "भाई सुंदर लड़की मतलब बॉस ऋषिकेश की बीवी 😽",
      "भाई इतना अहंकार अच्छा नहीं 🌸",
      "भाई प्यार नाम की पागलपंती बंद कर 🤣😼",
      "भाई यूँ ही मुझे शैतान लगा रहा है 😝",
      "भाई किरे ग्रुप में एक भी बेड़ी नहीं 🤦🥱"
    ];

    /* ---------- Greetings Female (जानू वाले) ---------- */
    const greetingsFemale = [
      "इतना मत बुलाओ जानू, प्यार में पड़ जाऊँगा 🙈",
      "बोलो बाबू, तुम मेरे बॉस साहू से प्यार करती हो? 🙈💋",
      "बार-बार बुलाओगी तो सिर गर्म हो जाएगा जानू 😑",
      "हाँ बोलो जानू 😒, तुम्हारे लिए क्या कर सकता हूँ?",
      "I love you जानू 🥰",
      "अरे बोलो मेरे जान, कैसी हो? 😚",
      "हट बेड़ी 😾, Boss बोल बॉस 😼",
      "चुप रहो जानू, वरना दाँत तोड़ दूँगा 😾",
      "जानू लड़की हो तो बॉस ऋषिकेश के इनबॉक्स में चली जाओ 🌚 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : https://m.me/hello.baby1222",
      "मुझे bot न बोलो जानू, बॉस ऋषिकेश को जानू बोलो 😘",
      "जानू, मैं अपने बॉस ऋषिकेश के साथ बिज़ी हूँ 😋",
      "हाँ जानू, इस तरफ आओ किस देता हूँ 🤭😘",
      "दूर जाओ जानू, तेरा कोई काम नहीं 😉🤣",
      "मुझे मत बुलाओ जानू, मैं ऋषिकेश साहू के साथ बिज़ी हूँ 😒",
      "जान लड़की हो तो बॉस ऋषिकेश के इनबॉक्स में चली जाओ 😍🫣💕 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : https://www.facebook.com/100044713412032",
      "कल मिलना तो एक बार जानू 😈",
      "हाँ बोलो जानू, सुन रहा हूँ 😏",
      "हम्म बोलो जानू क्या बोलोगी 😒",
      "बोलो जानू, क्या कर सकता हूँ तुम्हारे लिए 💕",
      "तेरी आँखों में नहीं दिखता कि मैं बिज़ी हूँ जानू 😒",
      "हम्म जान, तेरे उस जगह उम्माह 😑😘",
      "राधे कृष्णा हरे कृष्णा राधे राधे🥰",
      "जानू सीधे बॉस साहू के इनबॉक्स में जाओ 🙊😘",
      "जानू बॉस ऋषिकेश को GF दिला दो 🙄",
      "जानू इतना क्यों बुला रही हो, प्यार करती हो 🤭🙈",
      "🌻🌺💚-राधे कृष्णा हरे कृष्णा राधे राधे-💚🌺🌻",
      "जानू मैं बॉस साहू के साथ बिज़ी हूँ 🤝🌻",
      "जानू मुझे मत बुलाओ, बॉस ऋषिकेश को GF दिला दो 😽🫶",
      "उफ़ जानू, समझ नहीं आया इतना क्यों बुला रही 😤",
      "जानू मन ठीक नहीं है, मत बुलाओ 😪🤧",
      "जान तेरी सहेली को मेरे बॉस ऋषिकेश के हाथ में दे देगी 🙊🙆‍♂",
      "सपना जानू तुझे लेकर देखना चाहता हूँ 💝",
      "जान हंगा करेगी क्या 🙊😝",
      "जान लड़की हो तो चिपक आओ, बॉस ऋषिकेश से बहुत प्यार सीखा 🙊🙈😽",
      "इस्स जानू इतना बुलाती हो, शर्म आती है 🙈🖤",
      "जानू मेरे बॉस ऋषिकेश की तरफ से ढेर सारा प्यार 🥰",
      "जानू प्यार नाम की पागलपंती करनी हो तो सीधे बॉस ऋषिकेश के इनबॉक्स में जाओ 🙊🥱",
      "जानू मेरी तू सिर्फ मेरी, मैं तुझे 365 दिन प्यार करता हूँ 💝🌺",
      "जान मेरे बॉस साहू से शादी करेगी 🙊😘🥳",
      "जानू चुम्मा देगी 🙄🐸😘",
      "जानू आज प्रपोज़ करके देख, राज़ी हो जाऊँगा 😌🤗",
      "जानू सीधे बॉस ऋषिकेश के इनबॉक्स में जाओ 😏🐸",
      "जानू सुंदर लड़की मतलब बॉस ऋषिकेश की बीवी 😽🫶",
      "जानू इतना अहंकार अच्छा नहीं 🌸",
      "जानू प्यार नाम की पागलपंती बंद करो 🤣😼",
      "जानू यूँ ही मुझे शैतान लगा रहा है 😝",
      "जानू किरे ग्रुप में एक भी बेड़ी नहीं 🤦🥱",
      "जानू कितने दिन हो गए मुलाकात नहीं 😿 Miss you 🥺🤧"
    ];

    if (
      raw === "babu" || raw === "bot" || raw === "bby" ||
      raw === "jan" || raw === "xan" || raw === "জান" ||
      raw === "বট" || raw === "বেবি"
    ) {
      let pool;
      if (gender === "male") pool = greetingsMale;
      else if (gender === "female") pool = greetingsFemale;
      else pool = [...greetingsMale, ...greetingsFemale];

      const randomReply = pool[Math.floor(Math.random() * pool.length)];
      return api.sendMessage(randomReply, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    }

    if (
      raw.startsWith("babu ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||
      raw.startsWith("jan ") || raw.startsWith("xan ") ||
      raw.startsWith("জান ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")
    ) {
      const query = raw.replace(/^baby\s+|^bot\s+|^bby\s+|^jan\s+|^xan\s+|^জান\s+|^বট\s+|^বেবি\s+/i, "").trim();
      if (!query) return;

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      for (const rep of replies) {
        await new Promise(resolve => {
          api.sendMessage(rep, event.threadID, (err, info) => {
            if (!err) {
              global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: senderID,
                type: "simsimi"
              });
            }
            resolve();
          }, event.messageID);
        });
      }
    }

  } catch {}
};