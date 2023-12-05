const fs = require("fs");
const config = require("../config.js");
const prefix = config.prefix;

module.exports = {
  name: 'alive',
  alias: ['bot'],
  description: 'To check the bot alive or off',
  category: 'Mics',
  async client(vorterx, m, { text, connect}) {
    await connect('🧘');

    const image = {
      url: "https://i.ibb.co/BsYCSRV/Screenshot-20230918-093130.jpg",
      mimetype: "image/jpeg",
    };

    let aliveMsg = ` 
╭––『 *CHAT ON* 』 
┆ ${m.pushName}
╰–❖ __
╭–––––––––––––––༓ 
┆✑  Alive now🌷
╰–––––––––––––––༓ 
╭–– 『 *Bot Status* 』      
┆ *Name* : ${process.env.BOTNAME}
┆ *Owner* : ${process.env.OWNER_NAME}
┆ *Prefix* :  ${prefix}
┆ *Uptime* : *0h 17m 11s*
╰–––––––––––––––༓ 
`;
    const messageOptions = {
      image: image,
      caption: aliveMsg,
      contextInfo: {
        externalAdReply: {
          title: "vorterx",
          body: "vorterx",
          thumbnail: image,
          mediaType: 1,
          mediaUrl: "",
          sourceUrl: "",
          ShowAdAttribution: true,
        },
      },
    };

    await vorterx.sendMessage(m.from, messageOptions, { quoted: m });
  }
}
