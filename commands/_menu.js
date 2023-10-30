const path = require("path");
const os = require('os');
const { aztec_images, cou_ntry } = require('../mangoes/encryptFunc.js');
const { tiny } = require("@viper-x/fancytext");
const moment = require("moment-timezone");
const fs = require("fs");

module.exports = {
  name: 'menu',
  alias: ['help'],
  category: 'General',
  description: 'Gives the full command list of the bot',
  async xstart(vorterx, m, { args, xReact, text }) {
    const BotName = process.env.BOTNAME;
    const userName = m.pushName;
    const PREFIX = process.env.PREFIX;

    await xReact('Ⓜ️');
    let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Africa/Johannesburg" })
        .split(",");
    try {
      await vorterx.sendPresenceUpdate("composing", m.from);
      const id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat;

      const getUniquecommands = (dirPath) => {
        const uniquecommands = [];
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            uniquecommands.push(...getUniquecommands(filePath));
          } else if (stat.isFile() && file.endsWith(".js")) {
            const { alias = [] } = require(filePath);
            uniquecommands.push([file, ...alias]);
          }
        }

        return uniquecommands;
      };

      const formatcommandList = (commands) => {
        let formatted = "";

        for (const [file, ...aliases] of commands) {
          var up_up, up_mid, up_btm, ctgry_L, ctgry_R, cmd_L, ctgry_end;
          let random_menu = 0;
          if (!process.env.MENU) {
            random_menu = Math.floor(Math.random() * 2) + 1; // Replace '2' with the exact number of styles you have added
          }

          if (
            random_menu === 1 ||
            process.env.MENU.trim().startsWith("1") ||
            process.env.MENU.toLowerCase().includes("suhail-md")
          ) {
            up_up = `╭────《  *${tiny(BotName)}*  》────⊷\n│ ╭──────✧❁✧──────◆`;
            up_mid = `│`;
            up_btm = `│ ╰──────✧❁✧──────◆\n╰══════════════════⊷`;
            ctgry_L = `╭────❏`;
            ctgry_R = `❏ \n`;
            cmd_L = `│`;
            ctgry_end = `\n╰━━━━━━━━━━━━━━──⊷`;
          } else {
            up_up = `┏━━⟪ *${tiny(BotName)}* ⟫━━⦿`;
            up_mid = `┃ ✗`;
            up_btm = `┗━━━━━━━━━━━━━━⦿`;
            ctgry_L = `\n┌──『`;
            ctgry_R = `』──❖\n\n`;
            cmd_L = ` | `;
            ctgry_end = `\n\n└─────────◉\n`;
          }

          const capitalizedFile =
            file.replace(".js", "").charAt(0).toUpperCase() +
            file.replace(".js", "").slice(1);
          const aliasesList = aliases
            .map((cmd) => `${cmd_L} ${PREFIX}${cmd}`)
            .join("\n");

          formatted += `${ctgry_L} *${capitalizedFile}* ${ctgry_R}\n\n`;
          formatted += `\`\`\`${aliasesList}\`\`\`${ctgry_end}\n`;
        }

        return formatted.trim();
      };

      const pluginsDir = path.join(process.cwd(), "commands");
      const uniquecommands = getUniquecommands(pluginsDir);
      const formattedcommandList = formatcommandList(uniquecommands);

      let vorterxInstant = `${up_up}
${up_mid} User: ${tiny(userName)}
${up_mid} BotName: ${tiny(BotName)}
${up_mid} Images: ${tiny(cou_ntry().title)}
${up_mid} Prefix: ${tiny(PREFIX)}
${up_mid} Runtime: ${tiny(runtime(process.uptime()))}
${up_mid} Time: ${tiny(time)}
${up_mid} Date: ${tiny(date)}
${up_btm}\n${formattedcommandList}`;

      vorterxInstant += `_📔Send ${PREFIX}menu <command name> to get detailed information of a specific command_`;

      await vorterx.sendMessage(m.from, { image: { url:  await aztec_images() }, caption: vorterxInstant }, { quoted: m });
    } catch (err) {
      m.reply("👮‍♂️Oops! Something went wrong. Please try again later.");
      console.log(err, 'red');
    }
  }
};        
