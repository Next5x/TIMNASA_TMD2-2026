const fs = require('fs');
const path = './database/antistatus.js';

// Kazi ya kusoma settings toka kwenye file
function getSettings() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
}

// Kazi ya kuhifadhi settings
function saveSettings(groupId, data) {
    const settings = getSettings();
    settings[groupId] = { ...settings[groupId], ...data };
    fs.writeFileSync(path, JSON.stringify(settings, null, 2));
}

// Hii ndio function yako uliyoitengeneza nimeiboresha iunganishe DB
async function detectAndHandleStatusMention(zk, m, isBotAdmin, isGroupAdmin, isSuperAdmin) {
    try {
        const from = m.key.remoteJid;
        if (!from.endsWith('@g.us')) return;

        const settings = getSettings()[from] || { status: 'off', action: 'delete' };
        
        if (settings.status === 'off') return; // Kama imezimwa, usifanye kitu
        if (m.key.fromMe || isGroupAdmin || isSuperAdmin) return;

        const isStatusMention = !!(m.message?.groupStatusMentionMessage);
        if (!isStatusMention) return;

        // 1. Futa meseji kwanza (Lazima uwe Admin)
        if (isBotAdmin) {
            await zk.sendMessage(from, { delete: m.key });
        } else {
            return await zk.sendMessage(from, { text: "⚠️ Nimeona Status Mention! Nifanye admin ili nichukue hatua." });
        }

        // 2. Chukua Hatua (Action)
        const sender = m.key.participant || from;
        if (settings.action === 'remove') {
            await zk.groupParticipantsUpdate(from, [sender], 'remove');
            await zk.sendMessage(from, { text: `🚫 @${sender.split('@')[0]} ameondolewa kwa kutumia Status Mention!`, mentions: [sender] });
        } else if (settings.action === 'warn') {
            await zk.sendMessage(from, { text: `⚠️ Onyo @${sender.split('@')[0]}! Status mention hairuhusiwi hapa.`, mentions: [sender] });
        } else {
            await zk.sendMessage(from, { text: `🗑️ Meseji ya @${sender.split('@')[0]} imefutwa (Status Mention).`, mentions: [sender] });
        }
    } catch (e) {
        console.error("Anti-Status Error:", e);
    }
}
