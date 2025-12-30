const axios = require('axios');
const { zokou } = require("../framework/zokou");
const fs = require("fs-extra");
const child_process = require('child_process');
const { unlink } = require('fs').promises;

// --- MFUMO WA KUTUMA NEWSLETTER NA MZIKI (TIMNASA TMD) ---
const sendTimnasaExtras = async (zk, dest, ms) => {
    try {
        // 1. Kutuma View Channel (Newsletter)
        await zk.sendMessage(dest, {
            newsletterJid: "120363413554978773@newsletter",
            newsletterName: "ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ CHANNEL",
            serverMessageId: 1
        }, { quoted: ms });

        // 2. Kutuma Mziki (Audio)
        await zk.sendMessage(dest, {
            audio: { url: "https://files.catbox.moe/lqx6sp.mp3" },
            mimetype: 'audio/mp4',
            ptt: false 
        }, { quoted: ms });
    } catch (e) { console.log("Extras Error: " + e); }
};

const sleep = (ms) => {
    return new Promise((resolve) => { setTimeout(resolve, ms) })
}

// Fonction pour la conversion de GIF en vidéo
const GIFBufferToVideoBuffer = async (image) => {
    const filename = `${Math.random().toString(36)}`;
    await fs.writeFileSync(`./${filename}.gif`, image);
    
    // Utekelezaji wa ffmpeg kubadili GIF kwenda MP4
    const cmd = `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./${filename}.mp4`;
    
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, async (error) => {
            if (error) {
                reject(error);
            } else {
                await sleep(4000);
                const buffer = fs.readFileSync(`./${filename}.mp4`);
                await Promise.all([unlink(`./${filename}.mp4`), unlink(`./${filename}.gif`)]);
                resolve(buffer);
            }
        });
    });
};

const generateReactionCommand = (reactionName, reactionEmoji) => {
    zokou({
        nomCom: reactionName,
        categorie: "Reaction",
        reaction: reactionEmoji,
    },
    async (origineMessage, zk, commandeOptions) => {
        const { auteurMessage, auteurMsgRepondu, repondre, ms, msgRepondu } = commandeOptions;

        const url = `https://api.waifu.pics/sfw/${reactionName}`;
        try {
            const response = await axios.get(url);
            const imageUrl = response.data.url;

            const gifBufferResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const gifBuffer = await gifBufferResponse.data;

            const videoBuffer = await GIFBufferToVideoBuffer(gifBuffer);

            if (msgRepondu) { 
                var txt = `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ʀᴇᴀᴄᴛɪᴏɴ*\n\n🌟 @${auteurMessage.split("@")[0]} ${reactionName} @${auteurMsgRepondu.split("@")[0]}`;
                await zk.sendMessage(origineMessage, { 
                    video: videoBuffer, 
                    gifPlayback: true, 
                    caption: txt, 
                    mentions: [auteurMessage, auteurMsgRepondu] 
                }, { quoted: ms });
            } else {
                const videoMessage = {
                    video: videoBuffer,
                    gifPlayback: true,
                    caption: `*ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ ʀᴇᴀᴄᴛɪᴏɴ*\n\n🌟 @${auteurMessage.split("@")[0]} ${reactionName} everyone`,
                    mentions: [auteurMessage]
                };
                await zk.sendMessage(origineMessage, videoMessage, { quoted: ms });
            }

            // Tuma Newsletter na Mziki baada ya Reaction
            await sendTimnasaExtras(zk, origineMessage, ms);

        } catch (error) {
            repondre('Error occurred while retrieving the data: ' + error);
        }
    });
};

// Matumizi ya function kwa amri zote za Reaction
generateReactionCommand("bully", "👊");
generateReactionCommand("cuddle", "🤗");
generateReactionCommand("cry", "😢");
generateReactionCommand("hug", "😊");
generateReactionCommand("awoo", "🐺");
generateReactionCommand("kiss", "😘");
generateReactionCommand("lick", "👅");
generateReactionCommand("pat", "👋");
generateReactionCommand("smug", "😏");
generateReactionCommand("bonk", "🔨");
generateReactionCommand("yeet", "🚀");
generateReactionCommand("blush", "😊");
generateReactionCommand("smile", "😄");
generateReactionCommand("wave", "👋");
generateReactionCommand("highfive", "✋");
generateReactionCommand("handhold", "🤝");
generateReactionCommand("nom", "👅");
generateReactionCommand("bite", "🦷");
generateReactionCommand("glomp", "🤗");
generateReactionCommand("slap", "👋");
generateReactionCommand("kill", "💀");
generateReactionCommand("kick", "🦵");
generateReactionCommand("happy", "😄");
generateReactionCommand("wink", "😉");
generateReactionCommand("poke", "👉");
generateReactionCommand("dance", "💃");
generateReactionCommand("cringe", "😬");
