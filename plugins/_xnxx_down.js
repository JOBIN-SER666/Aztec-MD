//==DN DOWNLOAD 

//=======AZTEC-MD

module.exports = {
  name: "xnxxdn",
  description: "Download XNXX videos",
  category: "Download",
  async xstart(vorterx, m, { xReact, text, args }) {
    const axios = require("axios");

    if (!text) {
      await xReact("⛔");
      m.reply("*Missing XNXX link, please provide one.*");
      return;
    }

    let urlYt = text;
    if (!urlYt.startsWith("https")) {
      await xReact("⛔");
      m.reply("*😏 Provide me with an XNXXVD link.*");
      return;
    }

    await xReact("🍑");

    const res = await axios(`https://raganork-network.vercel.app/api/xvideos/download?url=${text}`);
    const video = res.data;

    let ca_pe = `
🎬 *XNXX VIDEO DOWNLOAD*
🍑 *Title:* XNXX
📟 *Bot Name:* ${process.env.BOTNAME}
📤 *Download Link:* [${video}]
`;

    let buttonMessage = {
      video: video,
      mimetype: "video/mp4",
      fileName: `vorterx.mp4`,
      caption: ca_pe,
      gifPlayback: false,
      height: 496,
      width: 640,
      headerType: 1,
      messageOptions: {
        textColor: "#ffffff", 
        backgroundColor: "#000000", 
        footerTextColor: "#ffffff",
        footerBackgroundColor: "#333333",  
      },
    };

    return await vorterx.sendMessage(m.from, buttonMessage, { quoted: m });
  },
};
