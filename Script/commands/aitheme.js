module.exports.config = {
    name: "aitheme",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "SHAHADAT SAHU",
    description: "Generate an AI chat theme and apply it with confirmation",
    commandCategory: "Group",
    usages: "[prompt]",
    cooldowns: 10,
    usePrefix: true
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const prompt = args.join(" ").trim();

        if (!prompt) {
            return api.sendMessage(
                "🎨 Please provide a prompt to generate an AI theme!",
                event.threadID,
                event.messageID
            );
        }

        if (
            typeof api.metaTheme !== "function" ||
            typeof api.setThreadTheme !== "function"
        ) {
            return api.sendMessage(
                "❌ AI Theme support is not available in your FCA version!",
                event.threadID,
                event.messageID
            );
        }

        const waitMsg = await new Promise(resolve => {
            api.sendMessage(
                `⏳ Generating theme for "${prompt}" using AI...`,
                event.threadID,
                (err, info) => resolve(info || null)
            );
        });

        const themeResult = await new Promise((resolve, reject) => {
            api.metaTheme(
                prompt,
                { numThemes: 1 },
                (err, data) => {
                    if (err) return reject(err);
                    resolve(data);
                }
            );
        });

        if (
            waitMsg &&
            waitMsg.messageID &&
            typeof api.unsendMessage === "function"
        ) {
            api.unsendMessage(waitMsg.messageID, () => {});
        }

        if (!themeResult || !themeResult.themeId) {
            return api.sendMessage(
                "❌ Could not generate AI theme! Try with a different prompt.",
                event.threadID,
                event.messageID
            );
        }

        const themeName = themeResult.name || prompt;

        const confirmMessage = await new Promise(resolve => {
            api.sendMessage(
                "🎨 AI Theme Generated\n\n" +
                `Theme: ${themeName}\n\n` +
                "👍 React to this message to apply it.",
                event.threadID,
                (err, info) => resolve(info || null)
            );
        });

        if (!confirmMessage || !confirmMessage.messageID) {
            return;
        }

        global.client.aiThemePending =
            global.client.aiThemePending || new Map();

        global.client.aiThemePending.set(
            confirmMessage.messageID,
            {
                author: event.senderID,
                threadID: event.threadID,
                themeId: themeResult.themeId,
                themeName: themeName,
                createdAt: Date.now()
            }
        );

        setTimeout(() => {
            if (global.client.aiThemePending) {
                global.client.aiThemePending.delete(
                    confirmMessage.messageID
                );
            }
        }, 120000);

    } catch (error) {
        console.error("[AITHEME ERROR]:", error);

        return api.sendMessage(
            `❌ There was a problem generating the AI theme: ${
                error.message || error
            }`,
            event.threadID,
            event.messageID
        );
    }
};