const { zokou } = require("../framework/zokou");
const axios = require("axios");

// Function ya kubadilisha muda kwenda masaa/dakika
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " siku, " : " siku, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " saa, " : " saa, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " dk, " : " dk, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sek" : " sek") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

zokou({
  nomCom: "speed",
  desc: "Kuangalia speed, picha na kupata links.",
  categorie: "General",
  reaction: "📡"
}, async (dest, zk, reponse) => {
  const start = new Date().getTime();
  
  // --- SEHEMU YA KUWEKA LINKS ZAKO ---
  const viewerChannel = "https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u"; 
  const jidChannel = "120363413554978773@newsletter";
  const musicUrl = "https://files.catbox.moe/e4c48n.mp3"; // Weka link ya direct mp3 hapa
  // ------------------------------------

  try {
    // Kupata picha inayobadilika (Catboy)
    const response = await axios.get("https://files.catbox.moe/zm113g.jpg");
    const imageUrl = response.data.url;

    const end = new Date().getTime();
    const ping = end - start;
    const uptime = runtime(process.uptime());

    const msg = `*🚀 ZOKOU-MD PING STATUS 🚀*

*⚡ Speed:* ${ping} ms
*⏱️ Uptime:* ${uptime}
*📸 Image:* Catboy.moe

*🔗 VIEWER CHANNEL:* ${viewerChannel}

*🔗 JID CHANNEL:* ${jidChannel}

*🎵 SIKILIZA MUZIKI:* ${musicUrl}

> Powered by Zokou Framework`;

    // 1. Kutuma Picha na Maelezo
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: msg
    }, { quoted: reponse.ms });

    // 2. Kutuma Audio (Muziki) - Itajicheza yenyewe (PTT: false)
    await zk.sendMessage(dest, {
      audio: { url: musicUrl },
      mimetype: 'audio/mp4',
      ptt: false 
    }, { quoted: reponse.ms });

  } catch (error) {
    console.log(error);
    reponse.reply("Hitilafu imetokea, jaribu tena baadae.");
  }
});
