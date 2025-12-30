const { zokou } = require("../framework/zokou");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

zokou({
  nomCom: "ups",
  categorie: "General",
  reaction: "📸"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, msgRepondu, arg } = commandeOptions;

  try {
    // 1. Kama ni PICHA au VIDEO (Reply kwenye media)
    if (msgRepondu && (msgRepondu.imageMessage || msgRepondu.videoMessage)) {
      const type = msgRepondu.imageMessage ? "image" : "video";
      const caption = arg.join(" ") || ""; // Maelezo ya chini kama yapo

      // Download media
      const buffer = await downloadMediaMessage(ms.message.extendedTextMessage.contextInfo.quotedMessage, type, {});

      await zk.sendMessage("status@broadcast", {
        [type]: buffer,
        caption: caption
      });

      return repondre(`Media (${type}) imewekwa kwenye status yako! ✅`);
    } 

    // 2. Kama ni MAANDISHI pekee (Andika baada ya command au reply text)
    let statusText = "";
    if (arg && arg.length > 0) {
      statusText = arg.join(" ");
    } else if (msgRepondu && msgRepondu.conversation) {
      statusText = msgRepondu.conversation;
    }

    if (statusText) {
      await zk.sendMessage("status@broadcast", {
        text: statusText
      });
      return repondre("Ujumbe wa maandishi umewekwa kwenye status! ✅");
    }

    // Kama hakuna kilichopatikana
    repondre("Tafadhali andika ujumbe au reply picha/video kwa kutumia amri hii.");

  } catch (e) {
    console.log(e);
    repondre("Hitilafu imetokea wakati wa kuweka status.");
  }
});
