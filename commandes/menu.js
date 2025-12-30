const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

zokou({ nomCom: "menu", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    var coms = {};
    var mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('EAT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg =  `
╭──────────────────✰
┊✰───*𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2*────✰
┊✍︎┊ *𝙐𝙎𝙀𝙍* : ${s.OWNER_NAME}
┊✍︎┊ *𝙈𝙊𝘿𝙀* : ${mode}
┊✰───────────────✰
┊✍︎┊ *𝙏𝙄𝙈𝙀* : ${temps}  
┊✍︎┊ *𝙍𝘼𝙈* : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
┊✰───────────────✰
╰──────────────────✰ \n\n`;
 
    let menuMsg=`  
  *ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ2 𝘾𝙊𝙈𝙈𝘼𝙉𝘿𝙎*
${readmore}`;

    for (const cat in coms) {
        menuMsg += `*╭────✰* *${cat}* *☯*`;
        for (const cmd of coms[cat]) {
            menuMsg += `  
*┊✞︎* ${cmd}`;
        }
        menuMsg += `
*╰══════ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ2═══════✰* \n`
    }

    menuMsg += `
         ◇           ◇
*————ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ2—————*

  *𝚻𝚰𝚳𝚴𝚫𝐒𝚫 𝚻𝚳𝐃2* *╰═════════════✰*
`;

   var lien = mybotpic();

   // Kutuma Muziki kwanza (Background Music)
   await zk.sendMessage(dest, { 
       audio: { url: "https://files.catbox.moe/e4c48n.mp3" }, 
       mimetype: 'audio/mp4', 
       ptt: true 
   }, { quoted: ms });

   // Kutuma Menu ikiwa na View Channel
   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { 
            video: { url: lien }, 
            caption: infoMsg + menuMsg, 
            footer: "Je suis *ᴛɪᴍɴᴀsᴀ ᴛᴍᴅ2*, développé par timnasa++",
            gifPlayback: true,
            contextInfo: {
                mentionedJid: [dest],
                externalAdReply: {
                    title: "TIMNASA TMD2 CHANNEL",
                    body: "Join our official channel",
                    thumbnailUrl: lien,
                    sourceUrl: "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u",
                    mediaType: 1,
                    renderLargerThumbnail: true
                },
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "TIMNASA TMD2",
                    serverMessageId: 144
                }
            }
        }, { quoted: ms });
    } catch (e) {
        repondre("🥵🥵 Menu erreur " + e);
    }
} else {
    try {
        zk.sendMessage(dest, { 
            image: { url: lien }, 
            caption: infoMsg + menuMsg, 
            footer: "*popkid*",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363413554978773@newsletter",
                    newsletterName: "TIMNASA TMD2 SUPPORT",
                    serverMessageId: 144
                }
            }
        }, { quoted: ms });
    } catch (e) {
        repondre(infoMsg + menuMsg);
    }
}

});
