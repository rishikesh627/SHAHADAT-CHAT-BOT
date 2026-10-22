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
    
    // Custom check: If it stopped for an auto-reload, don't say disabled
    if (reloadTimeout) {
      console.log("Reloading process initiated...");
    } else {
      console.log("Automatic restart is disabled.");
    }
  });
}

// Function to trigger a live hot-reload
function reloadBot() {
  if (shuttingDown) return;
  
  console.log("\n🔄 [Auto-Reload] Changes detected in files! Restarting the bot live...");
  
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

// Watch directory for edited or newly copied files
console.log("👀 Auto-Watcher Active: Monitoring files for copy/edit updates...");
fs.watch(__dirname, { recursive: true }, (eventType, filename) => {
  // Only trigger for javascript file adjustments and ignore node_modules or git caches
  if (filename && filename.endsWith(".js") && !filename.includes("node_modules") && !filename.includes(".git")) {
    
    // Debounce structure to make sure file finishing copying before firing reload
    clearTimeout(reloadTimeout);
    reloadTimeout = setTimeout(() => {
      reloadTimeout = null;
      reloadBot();
    }, 1000); // 1-second delay ensures files copy completely
  }
});

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
