const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// गूगल ट्रांसलेटर पैकेज को लोड करना (यह आपकी package.json में पहले से मौजूद है)
const translate = require("translate-google");

const packageInfo = require("./package.json");
const MAIN_FILE = path.join(__dirname, "Main.js");

console.log("Starting Main.js...");
console.log(`botName: ${packageInfo.name}`);
console.log(`version: ${packageInfo.version}`);

let bot = null;
let shuttingDown = false;
let reloadTimeout = null;

// बंगाली अक्षरों को पहचानने के लिए Regex पैटर्न
const bengaliRegex = /[\u0980-\u09FF]/;

function startBot() {
  bot = spawn(process.execPath, ["--trace-warnings", "--async-stack-traces", MAIN_FILE], {
    cwd: __dirname,
    stdio: ["pipe", "inherit", "inherit"], // इनपुट पाइप को चालू किया ताकि लॉग्स रीड हो सकें
    env: {
      ...process.env
    }
  });

  bot.on("error", (error) => {
    console.error("Main.js Error:", error.message);
  });

  bot.on("close", (code) => {
    bot = null;
    if (shuttingDown) {
      process.exit(0);
      return;
    }
    if (reloadTimeout) {
      console.log("🔄 [Auto-Reload] बूटस्ट्रैप प्रोसेस रीस्टार्ट हो रहा है...");
    } else {
      console.log("Automatic restart is disabled. Restarting in 5 seconds...");
      setTimeout(startBot, 5000);
    }
  });

  // यह हिस्सा आने वाले मैसेजेस को टर्मिनल लॉग से लाइव रीड करता है
  bot.stdout && bot.stdout.on("data", async (data) => {
    const logString = data.toString();
    
    // अगर लॉग में कोई बंगाली टेक्स्ट डिटेक्ट होता है
    if (bengaliRegex.test(logString)) {
      try {
        // बंगाली मैसेज को निकालकर सीधे हिंदी (hi) में कन्वर्ट करना
        const translatedText = await translate(logString, { to: "hi" });
        console.log(`\n✨ [Auto-Translated to Hindi]: ${translatedText}`);
      } catch (err) {
        // बैकअप के लिए इंग्लिश टू हिंदी अगर कनवर्टर एरर दे
        try {
          const backupTranslate = await translate(logString, { from: "bn", to: "hi" });
          console.log(`\n✨ [Auto-Translated to Hindi]: ${backupTranslate}`);
        } catch (_) {}
      }
    }
  });
}

function reloadBot() {
  if (shuttingDown) return;
  console.log("\n⚡ [Auto-Load] फाइलों में बदलाव मिला! बॉट लाइव अपडेट हो रहा है...");
  if (bot && bot.exitCode === null && bot.signalCode === null) {
    bot.once("close", () => { startBot(); });
    try { bot.kill("SIGTERM"); } catch (_) { startBot(); }
  } else {
    startBot();
  }
}

// 'Script' फ़ोल्डर मॉनिटर वॉचर
const scriptFolder = path.join(__dirname, "Script");
if (fs.existsSync(scriptFolder)) {
  console.log("👀 Auto-Watcher Active: 'Script' फ़ोल्डर पर लाइव नज़र रखी जा रही है...");
  fs.watch(scriptFolder, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
      clearTimeout(reloadTimeout);
      reloadTimeout = setTimeout(() => { reloadBot(); }, 1200);
    }
  });
}

function stopBot(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (bot && bot.exitCode === null && bot.signalCode === null) {
    try { bot.kill(signal); } catch (_) {}
    const forceTimer = setTimeout(() => { try { if (bot) bot.kill("SIGKILL"); } catch (_) {} }, 10000);
    bot.once("close", () => { clearTimeout(forceTimer); process.exit(0); });
    return;
  }
  process.exit(0);
}

process.on("SIGINT", () => stopBot("SIGINT"));
process.on("SIGTERM", () => stopBot("SIGTERM"));
process.on("exit", () => {
  if (bot && bot.exitCode === null && bot.signalCode === null) {
    try { bot.kill("SIGKILL"); } catch (_) {}
  }
});

startBot();
