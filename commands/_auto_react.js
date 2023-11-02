// ___________[MADE BY DIEGOSON]___
// _____[@For auto react use on e.g( AUTO_REACT: process.env.AUTO_REACT || 'on'; it turn it on else off then goes of
// ____[@AZTEC_MD

const config = require('../config.js');
const prefix = config.prefix;

const commandHandler = async (vorterx, m, { xReact, text, args }) => {
  if (sender && prefix && config) {
    const AUTO_REACT = config.AUTO_REACT || 'off';
    let emojis = ['😀', '🐥', '🐤', '🐦', '👻', '😎', '😴', '🥫', '🍿', '🤬', '🕵️', '😁', '🤩', '😍', '😏', '🤮', '💩', '💥', '🔥', '💯', '🐺', '🌚', '🦄', '🐕', '⚽', '😊', '🎉', '🌟', '🐱', '🌈', '❤', '👥', '🛴', '🎎', '👮‍♂️', '😂', '⚡️', '🍕', '🎸', '🌺', '🐧'];

    function runAztec_React() {
      const Index = Math.floor(Math.random() * emojis.length);
      return emojis[Index];
    }

    if (AUTO_REACT === 'on') {
      const maxAttempts = 80;
      let autoAttempt;

      for (let attempts = 0; attempts < maxAttempts; attempts++) {
        autoAttempt = runAztec_React();
        if (!xReact.includes(autoAttempt)) {
          await xReact(autoAttempt);
          break;
        }
      }

      if (attempts >= maxAttempts) {
        m.reply('Unable to find the emoji');
      }}
     }
   };
