const { zokou } = require("../framework/zokou");
const conf = require(__dirname + '/../set');
const moment = require("moment-timezone");
const os = require("os");

// Helper: format seconds into “X d, Y h, Z m, S s”
function formatDuration(sec) {
  sec = Number(sec);
  const days = Math.floor(sec / 86400);
  sec %= 86400;
  const hrs = Math.floor(sec / 3600);
  sec %= 3600;
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hrs) parts.push(`${hrs}h`);
  if (mins) parts.push(`${mins}m`);
  if (secs) parts.push(`${secs}s`);
  return parts.join(", ");
}

zokou(
  {
    nomCom: "ping",
    desc: "speed ping",
    categorie: "General",
    reaction: "⚡",
  },
  async (dest, zk, opts) => {
    const { ms } = opts;
    
    // Anza kuhesabu muda
    const start = Date.now();
    
    // Muda wa Afrika/Nairobi au Dar es Salaam
    const time = moment().tz("Africa/Dodoma").format("HH:mm:ss");
    const date = moment().tz("Africa/Dodoma").format("DD/MM/YYYY");
    
    // Malizia kuhesabu (Real Latency)
    const end = Date.now();
    const ping = end - start;

    const uptime = formatDuration(process.uptime());

    const pingMsg = `*Ƶ𝓞ｋØ𝓊-𝓜𝓓 ᴘɪɴɢ* ⚡

📡 *speed ping:* ${ping} ms
⏱️ *time:* ${time}
📅 *date:* ${date}
⏳ *Uptime:* ${uptime}
🟢 *situation : * I am healthy. (Alive)
🌍 *nation country:* ${country}

📢  https://whatsapp.com/channel/0029Vb9kKuVCMY0F5rmX2j1u

> *Powered by ᯤ ᴛɪᴍɴᴀsᴀ-ᴍᴅ *`;

    try {
      // Picha ya random kutoka kwenye list yako
      const math = [
        "https://files.catbox.moe/mhhku3.jpeg",
        "https://files.catbox.moe/t5v7hj.jpg",
        "https://files.catbox.moe/x0zjpf.jpg",
        "https://files.catbox.moe/bnb3vx.jpg"
      ];
      const randomImg = math[Math.floor(Math.random() * math.length)];

      await zk.sendMessage(dest, { 
        image: { url: randomImg }, 
        caption: pingMsg 
      }, { quoted: ms });

    } catch (error) {
      console.log("Ping Error: " + error);
    }
  }
);
