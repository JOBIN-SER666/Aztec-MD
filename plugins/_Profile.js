const Levels = require("discord-xp");

module.exports = {
  name: '(profile|me|user)',
  description: 'Check your profile information',
  category: 'Misc',
  async xstart(vorterx, m, { args }) {
    
    await xReact ('👤');  
    const user = m.sender;
    const bio = await vorterx.fetchStatus(user);
    const bioText = bio.status;

    const userLevel = await Levels.fetch(user,true);
    const levelPoints = userLevel.level;
    let role = '';

    if (levelPoints <= 5) role = '🍥 Naruto Uzumaki';
    else if (levelPoints <= 10) role = '🐉 Son Goku';
    else if (levelPoints <= 20) role = '⚡️ Ichigo Kurosaki';
    else if (levelPoints <= 30) role = '👑 Monkey D. Luffy';
    else if (levelPoints <= 40) role = '🔥 Natsu Dragneel';
    else if (levelPoints <= 50) role = '🌸 Sailor Moon';
    else if (levelPoints <= 60) role = '💫 Edward Elric';
    else role = '🌟 Light Yagami';

    const txt = userLevel.xp;
    const mssG = `
*👤 User Number*: ${m.sender.replace(/@c.us/g, '')}
*👥 Username*: ${m.pushName}
*⚡ Bio*: ${bioText}
*🧩 Role*: ${role}
*🍁 Level*: ${userLevel.level}
*📥 Total Messages*: ${txt}
`;

  let profileImage;
  try { profileImage = await vorterx.profilePictureUrl(user, 'image');
    } catch (e) {}
  const getColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
      color+= letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
  const mSg = { image: { url: profileImage, animated: false, }, caption: mssG, headerType: 4, headerColor: getColor(), };
    const animatedProfileImage = await vorterx.loadProfilePicture(user, 'image');
    mSg.image.animated = animatedProfileImage.isAnimated;
    vorterx.sendMessage(m.from, mSg, { quoted: m,
    });
  },
};
