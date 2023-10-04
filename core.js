const express = require('express');
const { default: AztecConnect, DisconnectReason, Browsers, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const { QuickDB } = require('quick.db');
const fs = require('fs');
const config = require('./config');
const { Collection } = require('discord.js');
const contact = require('./mangoes/contact.js');
const MessageHandler = require('./lib/message/vorterx');

  const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });
  const PORT = process.env.PORT || 3000;

  async function startAztec() {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = useMultiFileAuthState('./connects/creds.json');

  const vorterx = new AztecConnect({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.firefox('Desktop').userAgent,
    qrTimeout: undefined,
    auth: state,
    version,
   });

   store.bind(vorterx.ev);
 
   vorterx.cmd = new Collection();
   vorterx.DB = new QuickDB();
   vorterx.contactDB = vorterx.DB.table('contacts');
   vorterx.contact = contact;

   await readCommands(vorterx);

   vorterx.ev.on('creds.update', saveCreds);

   vorterx.ev.on('connection.update', async (update) => {
   const { connection, lastDisconnect } = update;

   if (connection === 'close' || connection === 'lost' || connection === 'restart' || connection === 'timeout') {
   let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

   console.log(`Connection ${connection}, reconnecting...`);

   if (reason === DisconnectReason.loggedOut) {
   console.log('Device Logged Out, Please Delete Session and Scan Again.');
   process.exit();
   }

  await startAzt();
  } else if (connection === 'close') {
  console.log(`[ 🐲AZTEC ] Connection closed, reconnecting...`);
  await startAztec();
  } else if (connection === 'lost') {
  console.log(`[ 🦅AZTEC ] Connection Lost from Server, reconnecting...`);
  await startAztec();
  } else if (connection === 'restart') {
  console.log(`[ 🦅AZTEC ] Server has just started...`);
  await startAztec();
  } else if (connection === 'timeout') {
  console.log(`[ 🐲 AZTEC ] Connection Timed Out, Trying to Reconnect...`);
  await startAztec();
  } else {
  console.log(`[ 🦅 AZTEC ] Server Disconnected: Maybe Your WhatsApp Account has got banned`);
  } else if (connection === 'open') {
  console.log('✔️ Aztec has been connected successfully');
      let D3centX = `╭────❰AZTEC CONNECTED
      |BOTNAME: 
      |PREFIX:
      |VERSION:
      |SERVER:
      X-Asena connected \nversion : ${
                    require(__dirname + "/package.json").version
                    }\nTotal Plugins : ${plugins.commands.length}\nWorktype: ${
                    config.WORK_TYPE
                    }\`\`\``;
                    conn.sendMessage(conn.user.id,
                        {
                            text: str
                        });
  });

    vorterx.ev.on('messages.upsert', async (messages) => await MessageHandler(messages, vorterx));

    vorterx.ev.on('contacts.update', async (update) => await contact.saveContacts(update, vorterx));

    const app = express();
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}/`);
    });

    await vorterx.connect();
    }

    async function readCommands(vorterx) {
    const commandFiles = fs.readdirSync('./Commands').filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    vorterx.cmd.set(command.name, command);
   }
   }

   startAztec();
