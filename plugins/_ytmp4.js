const ytdl = require('ytdl-core');

function isUrl(string) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(string);
}

module.exports = {
  name: 'ytmp4',
  alias: ['ytvid'],
  category: 'Downloads',
  async client(vorterx, m, { text, args, connect }) {
    if (args.length < 1 || !isUrl(text) || !ytdl.validateURL(text)) {
      await connect('❌');
      return m.reply(`*Please provide a valid YouTube link that I can download.*`);
    }

    await connect('📤');
    try {
      const videoInfo = await ytdl.getInfo(text);

      // Check if videoInfo.videoDetails.video_url exists before using it
      if (videoInfo.videoDetails.video_url && (videoInfo.videoDetails.video_url.startsWith('http://') || videoInfo.videoDetails.video_url.startsWith('https://'))) {
        const videoStream = ytdl(text, { quality: 'highest' });
        await vorterx.sendMessage(m.from, { video: videoStream, caption: `╭–– *『YTMP4 DOWNDR』*\n┆\n*Title*: ${videoInfo.videoDetails.title}\n┆\n*Duration*: ${videoInfo.videoDetails.lengthSeconds}s\n╰–––––––––––––––༓` }, { quoted: m });
      } else {
        // Handle the case where videoInfo.videoDetails.video_url is undefined or doesn't match the expected format
        await connect('❌');
        return m.reply(`*Invalid URL format.*`);
      }
    } catch (error) {
      console.error('Error fetching video information:', error);
      await connect('❌');
      return m.reply(`*Error fetching video information.*`);
    }
  }
};
