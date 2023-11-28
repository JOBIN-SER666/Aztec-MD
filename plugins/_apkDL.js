const { search, download } = require('aptoide-scraper');

module.exports = {
  name: 'apk',
  alias: ['app', 'getpack'],
  description: 'To download apk',
  category: 'Downloads',
  async xstart(vorterx, m, { text, args, xReact, quoted }) {
 
    if (!text) {
      await xReact('❌');
      return m.reply('*_Please provide the name of the app you want to download._*');
    }

    await xReact('📤');
    try {   
      const results = await search(text);
        if (results.length === 0) {
       return m.reply('*No results found for the app you searched.*');
      }

      await xReact('📤');
      const app = results[0];      
      const apkUrl = await download(app);
      const caption = `*📚 App Name*: ${app.title}\n*📦 Developer*: ${app.developer}\n*⬆️ Last update*: ${app.lastUpdate}\n*📥 Size*: ${app.size}\n*🤖 BotName*: ${process.env.BOTNAME}\n\n\n*_BY WhatsApp CHATBOT_*`;

      await vorterx.sendMessage(m.from, {
        url: apkUrl,
        caption,
        thumbnail: { url: app.icon },
      }, 'documentMessage', {
        mimetype: 'application/vnd.android.package-archive',
        filename: 'app.apk',
        quoted: m,
      });

     } catch (error) {
      console.error(error);
      m.reply('_Error occurred while downloading the app._');
    }
  },
};