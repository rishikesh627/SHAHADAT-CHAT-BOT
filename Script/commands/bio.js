module.exports.config = {
    name: "bio",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "SHAHADAT SAHU",
    description: "Change the bot's Facebook profile bio",
    commandCategory: "Admin",
    usages: "[new bio / clear]",
    cooldowns: 0,
    usePrefix: true
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const newBio = args.join(" ").trim();

        if (typeof api.changeBio !== "function") {
            return api.sendMessage(
                "❌ The `changeBio` function is not available in your FCA version!",
                event.threadID,
                event.messageID
            );
        }

        if (!newBio) {
            return api.sendMessage(
                "📝 Provide new bio text to change the bot's Facebook bio!\n\n" +
                "💡 To remove bio:\n" +
                "/bio clear",
                event.threadID,
                event.messageID
            );
        }

        const bioToSet =
            newBio.toLowerCase() === "clear"
                ? ""
                : newBio;

        const waitMsg = await new Promise(resolve => {
            api.sendMessage(
                "⏳ Updating the bot's Facebook bio...",
                event.threadID,
                (err, info) => resolve(info || null)
            );
        });

        await new Promise((resolve, reject) => {
            api.changeBio(
                bioToSet,
                false,
                err => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        if (
            waitMsg &&
            waitMsg.messageID &&
            typeof api.unsendMessage === "function"
        ) {
            api.unsendMessage(
                waitMsg.messageID,
                () => {}
            );
        }

        if (bioToSet === "") {
            return api.sendMessage(
                "🗑️ The bot's Facebook bio has been cleared successfully!",
                event.threadID,
                event.messageID
            );
        }

        return api.sendMessage(
            "✅ The bot's Facebook bio has been updated successfully!\n\n" +
            `📝 New Bio:\n${bioToSet}`,
            event.threadID,
            event.messageID
        );

    } catch (error) {
        console.error("[BIO ERROR]:", error);

        return api.sendMessage(
            `❌ There was a problem updating the bio: ${
                error.message || error
            }`,
            event.threadID,
            event.messageID
        );
    }
};