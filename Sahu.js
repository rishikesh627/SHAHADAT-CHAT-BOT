const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const packageInfo = require("./package.json");

const MAIN_FILE = path.join(__dirname, "Main.js");

console.log("Starting Main.js...");
console.log(`botName: ${packageInfo.name}`);
console.log(`version: ${packageInfo.version}`);

let bot = null;
let shuttingDown = false;
let reloadTimeout = null;

function startBot() {
  bot = spawn(process.execPath, ["--trace-warnings", "--async-stack-traces", MAIN_FILE], {
    cwd: __dirname,
    stdio: "inherit",
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

    console.log("Main.js stopped.");
    console.log("Exit Code:", code);
    
    // अगर ऑटो-रीलोड ट्रिगर हुआ है, तो बॉट दोबारा लोड होगा
    if (reloadTimeout) {
      console.log("🔄 [Auto-Reload] बूटस्ट्रैप प्रोसेस रीस्टार्ट हो रहा है...");
    } else {
      console.log("Automatic restart is disabled. Restarting in 5 seconds to keep safe...");
      setTimeout(startBot, 5000); // सुरक्षित रखने के लिए बंद होने पर 5 सेकंड में ऑटो-रीस्टार्ट
    }
  });
}

// लाइव हॉट-रीलोड ट्रिगर करने वाला फंक्शन
function reloadBot() {
  if (shuttingDown) return;
  
  console.log("\n⚡ [Auto-Load] फाइलों में बदलाव या नई स्क्रिप्ट मिली! बॉट लाइव अपडेट हो रहा है...");
  
  if (bot && bot.exitCode === null && bot.signalCode === null) {
    bot.once("close", () => {
      startBot();
    });
    try {
      bot.kill("SIGTERM");
    } catch (_) {
      startBot();
    }
  } else {
    startBot();
  }
}

// सिर्फ 'Script' फ़ोल्डर और उसकी सब-फ़ाइल्स पर नज़र रखने के लिए वॉचर
const scriptFolder = path.join(__dirname, "Script");

if (fs.existsSync(scriptFolder)) {
  console.log("👀 Auto-Watcher Active: 'Script' फ़ोल्डर पर लाइव नज़र रखी जा रही है...");
  fs.watch(scriptFolder, { recursive: true }, (eventType, filename) => {
    // सिर्फ .js फाइलों के बदलाव को डिटेक्ट करेगा
    if (filename && filename.endsWith(".js")) {
      
      // डिबाउंस ताकि फ़ाइल पूरी तरह कॉपी/पेस्ट होने के बाद ही रीलोड हो
      clearTimeout(reloadTimeout);
      reloadTimeout = setTimeout(() => {
        reloadBot();
      }, 1200); // 1.2 सेकंड का सेफ डिले
    }
  });
} else {
  console.log("⚠️ Warning: 'Script' फ़ोल्डर नहीं मिला, पूरे प्रोजेक्ट रूट पर नज़र रखी जा रही है...");
  fs.watch(__dirname, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith(".js") && !filename.includes("node_modules") && !filename.includes(".git")) {
      clearTimeout(reloadTimeout);
      reloadTimeout = setTimeout(() => {
        reloadBot();
      }, 1200);
    }
  });
}

function stopBot(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (bot && bot.exitCode === null && bot.signalCode === null) {
    try {
      bot.kill(signal);
    } catch (_) {}

    const forceTimer = setTimeout(() => {
      try {
        if (bot) bot.kill("SIGKILL");
      } catch (_) {}
    }, 10000);

    bot.once("close", () => {
      clearTimeout(forceTimer);
      process.exit(0);
    });

    return;
  }

  process.exit(0);
}

process.on("SIGINT", () => stopBot("SIGINT"));
process.on("SIGTERM", () => stopBot("SIGTERM"));

process.on("exit", () => {
  if (bot && bot.exitCode === null && bot.signalCode === null) {
    try {
      bot.kill("SIGKILL");
    } catch (_) {}
  }
});

startBot();
